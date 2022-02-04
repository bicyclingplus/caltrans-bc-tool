import json
import os
from pymongo import MongoClient

client = MongoClient("mongodb://bctool:phev@localhost:27017")
dbname = client['bctool']

collection_name = dbname['ways']
collection_name.delete_many({})

way_files = [
    "Sacramento_Bike_Network.geojson",
]

for file in way_files:
    geojson = json.load(open(os.path.join('input', file)))
    collection_name.insert_many(geojson['features'])


collection_name = dbname['intersections']
collection_name.delete_many({})

intersection_files = [
    "Sacramento_Ped_Network.geojson",
]

for file in intersection_files:

    geojson = json.load(open(os.path.join('input', file)))
    collection_name.insert_many(geojson['features'])
