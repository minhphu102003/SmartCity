import requests
from .config import LATITUDE, LONGITUDE, FORECAST_DAYS, HOURLY_FIELDS, BASE_URL, TIMEZONE

def fetch_forecast():
    params = {
        "latitude": LATITUDE,
        "longitude": LONGITUDE,
        "hourly": ",".join(HOURLY_FIELDS),
        "forecast_days": FORECAST_DAYS,
        "timezone": TIMEZONE
    }
    response = requests.get(BASE_URL, params=params)
    response.raise_for_status()
    return response.json()