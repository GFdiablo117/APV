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
    "features": [{
        "geometry": {
            "type": "LineString",
            "coordinates": []
        },
        "type": "Feature",
        "properties": {
            "Name": vehicle,
            "Start_long": None,
            "color": "#4dc5ea",
            "descriptio": None,
            "backcolor": None,
            "color3": None,
            "color2": None,
            "Start_lat": None,
            "Start_Name": None,
            "id": None
        }
    }]
}
for element in data['features']:
    
    if vehicle in element['properties']['Name']:
            if element['properties']['Start_lat']is None:
                print('isnone')
                for coordinates in element['geometry']["coordinates"]:
                    filteredData['features'][0]['geometry']["coordinates"].append(coordinates) 
            else:
                print('NOONe')
                filteredData['features'].append(element)

print(filteredData)
output = open(out_file, 'w')
json.dump(filteredData, output)

