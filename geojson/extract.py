import json

geojson = json.load(open('sf.geojson'))

# bishop
# ids = [
# 10377075,
# 465481470,
# 607842890,
# 489172857,
# 182297199,
# ]

#kern
# ids = [
# 918769056,
# 91642147
# ]

#la
# ids = [
# 399264540,
# 399264552,
# 399264558,
# 173717947,
# 186070712,
# 13340600,
# 399276102,
# 485629626,
# 607568624,
# 13430424,
# 607576346,
# 399276115,
# 399276114
# ]

#sf
ids = [
828551969,
27145750,
43759486
]

extracted = {
    "features": []
}

for feature in geojson['features']:

    osm_id = int(feature['properties']['osm_id'])

    if osm_id in ids:
        extracted['features'].append({
            "type": "Feature",
            "geometry": feature['geometry'],
            "properties": {
                "osm_id": feature['properties']['osm_id']
            },
        })

json.dump(extracted, open('output.json', 'w'))

