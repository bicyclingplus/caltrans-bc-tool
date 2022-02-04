import json
import os

data = json.load(open(os.path.join('input', 'Sacramento_Bike_Network.geojson')))

for f in data['features']:
    if f['properties']['edgeUID'] == 212462008:
        print(f)
        break

data = json.load(open(os.path.join('input', 'Sacramento_Ped_Network.geojson')))

for f in data['features']:
    if f['properties']['nodeID'] == 33612:
        print(f)
        break
