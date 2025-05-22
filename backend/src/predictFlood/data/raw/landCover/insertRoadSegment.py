from pymongo import MongoClient
from pyproj import Transformer
import json

transformer = Transformer.from_crs("epsg:3405", "epsg:4326", always_xy=True)

client = MongoClient("mongodb+srv://demo:demo123@smartcity.mfjx0.mongodb.net/smartcity")
db = client["smartcity"]
collection = db["roadsegments"]


with open("processed_roadsegment_after_shift.json", "r", encoding="utf-8") as f:
    data = json.load(f)


delta_long = 108.22314725347536 - 108.22498535795717
delta_lat = 16.075738487397103 - 16.074689765494767


def adjust_coords(coords, delta_long, delta_lat):
    return [[x + delta_long, y + delta_lat] for x, y in coords]

inserted_segments = []

for segment in data:
    segment["roadName"] = segment.pop("roadname", None)

    if "roadSegmentLine" in segment:
        coords = segment["roadSegmentLine"]["coordinates"]

        converted_coords = [list(transformer.transform(x, y)) for x, y in coords]

        shifted_coords = adjust_coords(converted_coords, delta_long, delta_lat)

        segment["roadSegmentLine"]["type"] = "LineString"
        segment["roadSegmentLine"]["coordinates"] = shifted_coords

        segment["start_location"] = {
            "type": "Point",
            "coordinates": shifted_coords[0]
        }
        segment["end_location"] = {
            "type": "Point",
            "coordinates": shifted_coords[-1]
        }

    result = collection.insert_one(segment)
    segment["_id"] = str(result.inserted_id)
    inserted_segments.append(segment)

with open("roadsegments_with_ids.json", "w", encoding="utf-8") as f:
    json.dump(inserted_segments, f, ensure_ascii=False, indent=2)

print(f"✅ Inserted {len(inserted_segments)} road segments and stored with _id.")