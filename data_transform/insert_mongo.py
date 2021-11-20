import json
import os
from pymongo import MongoClient

client = MongoClient("mongodb://bctool:phev@localhost:27017")
dbname = client['bctool']
collection_name = dbname['ways']

geojson = json.load(open(os.path.join('output', 'woodland.json')))

collection_name.insert_many(geojson['features'])

collection_name = dbname['intersections']

geojson = json.load(open(os.path.join('output', 'woodland_intersections.json')))

collection_name.insert_many(geojson['features'])