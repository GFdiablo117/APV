#use this function to filter your routes by cretain vehicles

from sys import argv
from os.path import exists
import simplejson as json
from math import cos, asin, sqrt

def calcDistance(lat1, lon1, lat2, lon2):
    p = 0.017453292519943295
    a = 0.5 - cos((lat2-lat1)*p)/2 + cos(lat1*p)*cos(lat2*p) * (1-cos((lon2-lon1)*p)) / 2
    return 12742 * asin(sqrt(a))


#command: python filter.py <vehicleToFilter> <filename>

script, vehicle, in_route, in_stations = argv

out_file= vehicle+'newStations.json'

route = json.load(open(in_route))
stations = json.load(open(in_stations))
filteredData = {
    "type": "FeatureCollection",
    "features": [{
        "geometry": {
            "type": "LineString",
            "coordinates": []
        },
        "type": "Feature",
        "properties": {
            "Name": None,
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

print(stations['features'][0])

for station in stations['features']:
    closest = 100000000000000000000
    closestPoint= []
    for line in route['features']:
        for point in line['geometry']['coordinates']:
            distance = calcDistance(point[0],point[1],station['geometry']['coordinates'][0], station['geometry']['coordinates'][1])
            if closest>distance:
                closest=distance
                closestPoint=point
    station['geometry']['coordinates']= closestPoint
print(stations['features'][0])

output = open(out_file, 'w')
json.dump(stations, output)

