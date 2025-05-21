import sys
import os
import datetime 

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))

from weather_forecast.fetcher import fetch_forecast
from weather_forecast.parser import parse_hourly_data
from pipeline.feature_engineering import process_forecast_data

import pandas as pd
import time

def run_forecast_job():
    try:
        forecast_json = fetch_forecast()
        forecast_df = parse_hourly_data(forecast_json)
        processed_df = process_forecast_data(forecast_df, do_scale=False)

        now = datetime.datetime.now()
        current_hour = now.hour

        current_row_df = processed_df[processed_df['hour'] == current_hour]

        if current_row_df.empty:
            print(f"No data found for current hour: {current_hour}")
        else:
            print(current_row_df)

            # TODO: Truyền dòng này vào model dự đoán
            # prediction = model.predict(current_row_df)

        now_str = now.strftime("%Y%m%d_%H%M%S")
        output_path = os.path.abspath(os.path.join(os.path.dirname(__file__), f"../outputs/forecast_processed_{now_str}.csv"))
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        processed_df.to_csv(output_path, index=False)

    except Exception as e:
        print(f"Forecast job failed: {e}")

def start_scheduler():
    while True:
        print("Running hourly forecast job...")
        run_forecast_job()
        print("Waiting for next run...\n")
        time.sleep(3600) 

if __name__ == "__main__":
    run_forecast_job()