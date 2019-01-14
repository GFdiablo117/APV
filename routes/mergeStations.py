#use this function to combine two staitonlists, but filter duplictes

from sys import argv
from os.path import exists
import simplejson as json 



#command: python filter.py <vehicleToFilter> <filename>

script, stations1, stations2 = argv

out_file= 'mergedStations.json'

stationList1 = json.load(open(stations1))
stationList2 = json.load(open(stations2))
mergedStations = stationList1


#author: Hanh Pham
def appendUniqueStation(stationToCheck){
    twin
    for station in mergedStations['features']:
        if stationToCheck['properties']['locationName']==station['properties']['locationName']:
            twin=True
            break
    if !(twin):
        mergedStations['features'].append(station)
}




for station in stationList2['features']:
    appendUniqueStation(staiton)

output = open(out_file, 'w')
json.dump(filteredData, output)

