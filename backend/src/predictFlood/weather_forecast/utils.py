def save_to_csv(df, path="forecast.csv"):
    df.to_csv(path, index=False)
    print(f"Forecast saved to {path}")