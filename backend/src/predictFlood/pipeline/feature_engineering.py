import pandas as pd
from sklearn.preprocessing import MinMaxScaler

def process_forecast_data(df: pd.DataFrame, do_scale: bool = False) -> pd.DataFrame:
    df['time'] = pd.to_datetime(df['time'])
    df['year'] = df['time'].dt.year
    df['month'] = df['time'].dt.month
    df['day'] = df['time'].dt.day
    df['hour'] = df['time'].dt.hour

    df = df.fillna(method='ffill')

    if do_scale:
        scaler = MinMaxScaler()
        cols_to_scale = ['rain', 'temperature_2m', 'dew_point_2m', 'wind_speed_10m']
        df[cols_to_scale] = scaler.fit_transform(df[cols_to_scale])


    return df