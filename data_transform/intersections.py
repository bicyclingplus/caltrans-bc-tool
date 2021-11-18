import json
import os

infilename = os.path.join("output", "woodland.json")

geojson = json.load(open(infilename))

intersections = {}

for f in geojson['features']:

    int_a = int(f['properties']['INTERSECTI'])
    int_a_coords = f['geometry']['coordinates'][0]
    int_b = int(f['properties']['INTERSE_01'])
    int_b_coords = f['geometry']['coordinates'][-1]

    if int_a not in intersections:
        intersections[int_a] = int_a_coords

    if int_b not in intersections:
        intersections[int_b] = int_b_coords

newjson = {
    "features": [],
    "type": "FeatureCollection",
}

for i in intersections.keys():

    newjson["features"].append({
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": intersections[i],
        },
        "properties": {
            "id": i,
        }
    })

outfilename = os.path.join('output', 'woodland_intersections.json')
json.dump(newjson, open(outfilename, 'w'))
