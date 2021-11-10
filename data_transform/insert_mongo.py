import json
import os
from pymongo import MongoClient

client = MongoClient("mongodb://bctool:phev@localhost:27017")
dbname = client['bctool']
collection_name = dbname['features']

geojson = json.load(open(os.path.join('input', 'yolo_osm_id.geojson')))

collection_name.insert_many(geojson['features'])
