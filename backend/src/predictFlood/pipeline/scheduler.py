import sys
import os
import datetime 
import requests
import json
import joblib
import pandas as pd
import time

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))

from weather_forecast.fetcher import fetch_forecast
from weather_forecast.parser import parse_hourly_data
from pipeline.feature_engineering import process_forecast_data

def send_prediction_to_backend(payload):
    try:
        response = requests.post(
            "https://danahub-backend-4ccd2faffe40.herokuapp.com/api/v1/predictions",
            json=payload
        )
        print(f"Sent prediction: {response.status_code}")
    except Exception as e:
        print(f"Failed to send prediction: {e}")

def load_merged_road_segments():
    merged_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../data/raw/label/merged_data.json"))
    with open(merged_path, "r") as f:
        merged_data = json.load(f)
    return set(entry["road_segment_id"] for entry in merged_data)

def load_road_segment_properties():
    properties_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../data/raw/landCover/roadsegments_with_ids.json"))
    with open(properties_path, "r") as f:
        data = json.load(f)

    result = []
    for item in data:
        if "_id" in item and "groundwater_level" in item:
            result.append({
                "_id": item["_id"],
                "groundwater_level": item["groundwater_level"]
            })
    return result

def load_model():
    model_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "./random_forest_flood_model.pkl"))
    return joblib.load(model_path)

def merge_forecast_with_road_segments(forecast_df, road_segment_props):

    forecast_df['year'] = forecast_df['time'].dt.year
    forecast_df['month'] = forecast_df['time'].dt.month
    forecast_df['day'] = forecast_df['time'].dt.day
    forecast_df['hour'] = forecast_df['time'].dt.hour
    forecast_df['date'] = forecast_df['time'].dt.date.astype(str)  
    forecast_df['timestamp'] = forecast_df['time'].astype(str)
    forecast_df['soil_temperature_0_to_7cm'] = (forecast_df['soil_temperature_0cm'] + forecast_df['soil_temperature_6cm']) / 2
    forecast_df['wind_speed_100m'] = forecast_df['wind_speed_10m'] 
    forecast_df['precipitation'] = forecast_df['precipitation_probability']

    props_df = pd.DataFrame(road_segment_props)
    props_df = props_df.rename(columns={"_id": "road_segment_id"})
    merged_df = pd.merge(forecast_df, props_df, how='cross')

    cols_to_keep = [
        "road_segment_id", "timestamp", "groundwater_level", "rain", "precipitation",
        "temperature_2m", "dew_point_2m", "soil_temperature_0_to_7cm", "pressure_msl",
        "cloud_cover", "wind_speed_100m", "year", "month", "day", "hour", "date"
    ]

    model_input_df = merged_df[cols_to_keep]
    return model_input_df

def run_forecast_job():
    try:
        road_segment_props = load_road_segment_properties()

        forecast_json = fetch_forecast()
        forecast_df = parse_hourly_data(forecast_json)

        merged_df = merge_forecast_with_road_segments(forecast_df, road_segment_props)
        print(merged_df.columns.to_list());
        merged_df['road_segment_id_encoded'] = merged_df['road_segment_id'].astype('category').cat.codes

        model = load_model()

        predict_for_road_segments(model, merged_df)

        now_str = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        output_path = os.path.abspath(os.path.join(os.path.dirname(__file__), f"../outputs/forecast_processed_{now_str}.csv"))
        os.makedirs(os.path.dirname(output_path), exist_ok=True)

    except Exception as e:
        print(f"❌ Forecast job failed: {e}")


def predict_for_road_segments(model, merged_df):
    now_utc = datetime.datetime.utcnow().isoformat() + "Z"
    current_hour = datetime.datetime.now().hour

    df_current_hour = merged_df[merged_df['hour'] == current_hour]

    for _, row in df_current_hour.iterrows():
        X_input = pd.DataFrame([row[model.feature_names_in_].to_dict()])
        prediction = model.predict(X_input)

        road_id = row["road_segment_id"]
        if prediction[0] == 1:
            payload = {
                "type": "predict",
                "data": {
                    "road_segment_id": road_id,
                    "timestamp": now_utc,
                }
            }
            send_prediction_to_backend(payload)
        else:
            print(f"✅ No flood predicted for road_segment_id={road_id}")

def start_scheduler():
    while True:
        print("Running hourly forecast job...")
        run_forecast_job()
        print("Waiting for next run...\n")
        time.sleep(3600) 

def test_send_prediction():
    fake_payload = {
        "type": "predict",
        "data": {
            "road_segment_id": "682f302627f935072e175faf",
            "timestamp": datetime.datetime.utcnow().isoformat() + "Z"
        }
    }
    send_prediction_to_backend(fake_payload)


if __name__ == "__main__":
   start_scheduler()