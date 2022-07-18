import json
import os

foldername = 'output'

# filename = 'Final_network_nodes.geojson'
# filename = 'Final_network_links.geojson'
filename = 'Final_network_links_merged.geojson'
#

geojson = json.load(open(os.path.join(foldername, filename)))

print(json.dumps(geojson['features'][1234]['properties']))
