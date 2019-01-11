#use this function to filter your stations.geojson by vehicles

from sys import argv
from os.path import exists
import simplejson as json 

#command: python filter.py <vehicleToFilter> <filename>

script, vehicle, in_file = argv

out_file= vehicle+'Stations.json'

data = json.load(open(in_file))
filteredData = {
    "type": "FeatureCollection",
    "features": []
}
for element in data['features']:
    if vehicle in element['properties']['aliases']:
        filteredData['features'].append(element)
    
output = open(out_file, 'w')
json.dump(filteredData, output)

