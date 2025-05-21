import pandas as pd

def parse_hourly_data(json_data):
    hourly = json_data.get("hourly", {})
    if not hourly:
        raise ValueError("No 'hourly' data found in response")

    df = pd.DataFrame(hourly)
    df["time"] = pd.to_datetime(df["time"])
    return df