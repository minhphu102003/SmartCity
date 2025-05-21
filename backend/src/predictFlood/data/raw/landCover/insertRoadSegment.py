from pymongo import MongoClient
from pyproj import Transformer
import json

transformer = Transformer.from_crs("epsg:3405", "epsg:4326", always_xy=True)

client = MongoClient("connection string")
db = client["smartcity"]
collection = db["roadsegments"]

with open("processed_roadsegments.json", "r", encoding="utf-8") as f:
    data = json.load(f)

inserted_segments = [] 

for segment in data:
    segment["roadName"] = segment.pop("roadname", None)

    if "roadSegmentLine" in segment:
        coords = segment["roadSegmentLine"]["coordinates"]
        converted_coords = [list(transformer.transform(x, y)) for x, y in coords]

        segment["roadSegmentLine"]["type"] = "LineString"
        segment["roadSegmentLine"]["coordinates"] = converted_coords

        segment["start_location"] = {
            "type": "Point",
            "coordinates": converted_coords[0]
        }
        segment["end_location"] = {
            "type": "Point",
            "coordinates": converted_coords[-1]
        }

    result = collection.insert_one(segment)

    segment["_id"] = str(result.inserted_id) 

    inserted_segments.append(segment)

with open("roadsegments_with_ids.json", "w", encoding="utf-8") as f:
    json.dump(inserted_segments, f, ensure_ascii=False, indent=2)

print(f"✅ Inserted {len(inserted_segments)} road segments and stored with _id.")