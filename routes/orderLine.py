#use this function to filter your routes by cretain vehicles

from sys import argv
from os.path import exists
import simplejson as json
from math import cos, asin, sqrt
import networkx as nx

#funciton to calculate distance between 2 coordinates
def calcDistance(lat1, lon1, lat2, lon2):
    p = 0.017453292519943295
    a = 0.5 - cos((lat2-lat1)*p)/2 + cos(lat1*p)*cos(lat2*p) * (1-cos((lon2-lon1)*p)) / 2
    return 12742 * asin(sqrt(a))


#command: python filter.py <vehicleToFilter> <VehicleRoute> <vehicleStaitons (already mapped)>

script, vehicle, in_route, in_stations = argv

out_file= vehicle+'newLine.json'

route = json.load(open(in_route))
stations = json.load(open(in_stations))

lineTemplate = {
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
startPoints = {
    "type": "FeatureCollection",
    "features": []
}
# Add al Coordinates to one Array we can iterate through
pointPool = []
for element in route['features']:
    for coordinate in element['geometry']['coordinates']:
        pointPool.append(coordinate)

#Now all Koordinates are in the point pool

for element in route['features']:
    if vehicle in element['properties']['Name']:
            if element['properties']['Start_lat']is None:
                None
            else:
                startPoints['features'].append(element)

#Now we got the start Points, but we need to map them with the real station coordinates
newStartPoints=[]
for element in startPoints['features']:
    closest = 100000000000000000000
    closestPoint= []
    for station in stations['features']:
        distance = calcDistance(element['properties']['Start_long'], element['properties']['Start_lat'],station['geometry']['coordinates'][0], station['geometry']['coordinates'][1])
        if closest>distance:
            closest=distance
            closestPoint=[station['geometry']['coordinates'][0], station['geometry']['coordinates'][1]]
    newStartPoints.append(closestPoint)

startPoints=newStartPoints



# Now we have to make a line from every start point to every start point. These will be all aviable lines   
#First we need to make a tree to recognize all different routes

G = nx.Graph()
for point in pointPool:
    G.add_node(point[0], pos=(point[0], point[1]))

#dann minimum tree abspeichern 
G2=nx.minimum_spanning_tree(G)
#jetzt kannst du easy checken ob ein punkt eine kreuzung is, naemlich falls das true is isses ne kreuzung:
#len(G2.edges(koordinaten))>2
#command: python filter.py <vehicleToFilter> <filename>






lines = []
for startPoint in startPoints:
    for endPoint in startPoints:
        lines.append(lineTemplate)

        clonedPointPool = list(pointPool)
        while(startPoint in clonedPointPool):
            clonedPointPool.remove(startPoint)
        if endPoint == startPoint:
            continue
        lastAddedPoint = startPoint
        if(lastAddedPoint not in lines[len(lines)-1]['features'][0]['geometry']['coordinates']):
            lines[len(lines)-1]['features'][0]['geometry']['coordinates'].append(lastAddedPoint)
        while endPoint != lastAddedPoint:
                if(lastAddedPoint not in lines[len(lines)-1]['features'][0]['geometry']['coordinates']):
                    lines[len(lines)-1]['features'][0]['geometry']['coordinates'].append(lastAddedPoint)
                closest = 100000000000000000000
                closestPoint= []
                while lastAddedPoint in clonedPointPool:
                    clonedPointPool.remove(lastAddedPoint)
                if lastAddedPoint in clonedPointPool:
                    print('schwaaaaanz')
                for nextPoint in clonedPointPool:
                    distance = calcDistance(lastAddedPoint[0], lastAddedPoint[1], nextPoint[0], nextPoint[1])
                    if closest>distance:
                        closest=distance
                        lastAddedPoint=nextPoint
                  




output = open(out_file, 'w')
json.dump(lines, output)

