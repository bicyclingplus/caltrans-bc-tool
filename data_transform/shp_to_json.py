import shapefile
import json
import os

infilename = os.path.join('input', 'neighborhood_ways', 'neighborhood_ways_latlong')

sf = shapefile.Reader(infilename)
records = sf.shapeRecords()
geojson = records.__geo_interface__

json.dump(geojson, open(os.path.join('output', 'woodland.json'), 'w'))
