#use this function to filter your routes by cretain vehicles

from sys import argv
from os.path import exists
import simplejson as json 

#command: python filter.py <vehicleToFilter> <filename>

script, vehicle, in_file = argv

out_file= vehicle+'Route.json'

data = json.load(open(in_file))
filteredData = {
    "type": "FeatureCollection",
    "features": []
}
for element in data['features']:
    if vehicle in element['properties']['Name']:
        filteredData['features'].append(element)    

output = open(out_file, 'w')
json.dump(filteredData, output)

