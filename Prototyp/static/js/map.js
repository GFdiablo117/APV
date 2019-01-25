 // load a tile layer
 let map = new L.map('map', {
     center: [48.1403114185532, 11.5611056053238], // Location munich hbf
     zoom: 15,
     minZoom: 13,
     doubleClickZoom:false,
     scrollWheelZoom: 'center'

 });

 L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
     attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
 }).addTo(map);

 L.svg({clickable:true}).addTo(map);
 // Use Leaflet to implement a D3 geometric transformation.
 function projectPoint(x, y) {
     let point = map.latLngToLayerPoint(new L.LatLng(y, x));
     this.stream.point(point.x, point.y)
     //  this.stream.lineEnd()

 };
 // Use Leaflet to implement a D3 geometric transformation.
 let svg = d3.select(map.getPanes().overlayPane).append("svg").attr("pointer-events", "auto");
     g = svg.append("g").attr("class", "leaflet-zoom-hide");

 let parent = d3.select("svg")

 var pathGroup = parent.append("g")
     .attr("id", "groupOfPaths")






 /* //add svgLayer to map to work with d3
    let svgLayer = L.svg();
    svgLayer.addTo(map);  */


 var HBFIcon = L.icon({
    iconUrl: '/svg/HBF.svg',
    id: 'HBF',
    iconSize:     [40, 40], // size of the icon
});

var stationIcon = L.icon({
    iconUrl: '/svg/station.svg',

    iconSize: [10, 10], // size of the icon
});
let museumContent = "Das Deutsche Museum von Meisterwerken der Naturwissenschaft und Technik (meist nur Deutsches Museum genannt) in München ist nach Ausstellungsfläche das größte Wissenschafts- und Technikmuseum der Welt.[1][2] In dem Museum, das jährlich von etwa 1,5 Millionen Menschen besucht wird, werden rund 28.000 Objekte aus etwa 50 Bereichen der Naturwissenschaften und der Technik ausgestellt.Das Museum ist eine Anstalt des öffentlichen Rechts. Es ist als Forschungseinrichtung Mitglied der Leibniz-Gemeinschaft."
var museumIcon = L.icon({
    iconUrl: '/svg/museum.svg',

    iconSize: [50, 50], // size of the icon
});
let museumMarker = L.marker([48.129871, 11.583452], {icon: museumIcon}).bindPopup(museumContent).openPopup()
museumMarker.addTo(map)

let kircheContent= "Die Asamkirche (offiziell St.-Johann-Nepomuk-Kirche) in der Sendlinger Straße in Münchens Altstadt wurde von 1733 bis 1746 von den Brüdern Asam (Cosmas Damian Asam und Egid Quirin Asam) errichtet. Sie gilt als eines der bedeutendsten Bauwerke der beiden Hauptvertreter des süddeutschen Spätbarocks. Die Asamkirche steht bereits an der Schwelle zum Rokoko, doch tritt hier die typische Leitform im Ornament, die Rocaille, noch nicht auf."
var kircheIcon = L.icon({
    iconUrl: '/svg/kirche.svg',

    iconSize: [50, 50], // size of the icon
});
let kircheMarker = L.marker([48.135116666667, 11.569530555556], {icon: kircheIcon}).bindPopup(kircheContent).openPopup()
kircheMarker.addTo(map)

let staatssammlungContent= "Das Paläontologische Museum München ist ein öffentlich zugänglicher Teil der Bayerischen Staatssammlung für Paläontologie und Geologie in der Nähe des Münchener Königsplatzes. Das Gebäude in der Richard-Wagner-Straße wurde von Leonhard Romeis entworfen. Das eklektische Museumsgebäude stammt aus der Wende zum 20."
var staatssammlungIcon = L.icon({
    iconUrl: '/svg/staatssammlung.svg',

    iconSize: [40, 40], // size of the icon
});
let staatsmarker =L.marker([48.147613888889, 11.563833333333], {icon: staatssammlungIcon}).bindPopup(staatssammlungContent).openPopup()
staatsmarker.addTo(map)

let eisbachwelleContent = "Der Eisbach gehört zum Verbund der Münchner Stadtbäche, die sämtlich aus der Isar gespeist werden und größtenteils unterirdisch die Münchner Altstadt und das Lehel durchfließen. Im Englischen Garten ist er Teil eines Bachsystems, zu dem auch der Schwabinger Bach und der Oberstjägermeisterbach gehören, die beide länger als der Eisbach sind. Dieser entsteht durch die Zusammenführung des Stadtmühlbaches und des Stadtsägmühlbaches an der Eisbachbrücke und tritt am südlichen Rand des Englischen Gartens in unmittelbarer Nähe des Hauses der Kunst zutage."

var eisbachwelleIcon = L.icon({
    iconUrl: '/svg/eisbachwelle.svg',

    iconSize: [50, 50], // size of the icon
});
let eisbachMarker= L.marker([48.143539, 11.58778], {icon: eisbachwelleIcon}).bindPopup(eisbachwelleContent).openPopup()
eisbachMarker.addTo(map)

let königsplatzContent = "Der Königsplatz ist ein Platz im Münchner Stadtteil Maxvorstadt, der zum Gesamtensemble der Brienner Straße gehört, der ersten Prachtstraße Münchens. Der Platz im Stil des europäischen Klassizismus ist ein Zentrum kulturellen Lebens und gilt als eines der Hauptwerke des ludovizianischen „Isar-Athen“."
var königsplatzIcon = L.icon({
    iconUrl: '/svg/königsplatz.svg',

    iconSize: [50, 50], // size of the icon
});
let königsplatzMarker = L.marker([48.145752777778, 11.565375], {icon: königsplatzIcon}).bindPopup(königsplatzContent).openPopup()
königsplatzMarker.addTo(map)

let nsContent = "Das NS-Dokumentationszentrum München – Lern- und Erinnerungsort zur Geschichte des Nationalsozialismus ist eine Einrichtung der Landeshauptstadt München gemeinsam mit dem Freistaat Bayern und der Bundesrepublik Deutschland."
var nsdocumentsIcon = L.icon({
    iconUrl: '/svg/nsdocuments.svg',

    iconSize: [50, 50], // size of the icon
});
let nsdocumentsMarker= L.marker([48.145366, 11.567708], {icon: nsdocumentsIcon}).bindPopup(nsContent).openPopup()
nsdocumentsMarker.addTo(map)


 d3.json("/stations/hbf.json").then(function (test) {

     L.geoJson(test, {
         pointToLayer: function (feature, latlng) {
             return L.marker(latlng, {icon: HBFIcon});
         }
     }).addTo(map);
 })


 /*d3.json("/stations/mergedStations.json").then(function (test) {

    L.geoJson(test, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {radius: 2, color: "grey"});
        }
    }).addTo(map);
}) */

/*d3.json("/stations/ubahnStations.json").then(function (test) {

    L.geoJson(test, {
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {icon: staitonIcon});
        }
    }).addTo(map);
}) */
 /*let routes = new L.LayerGroup();
 let test =  new L.GeoJSON.AJAX("/routes/test.geojson");
 let sBahn = new L.GeoJSON.AJAX("/routes/Lines_SBahn.geojson");
 let tram = new L.GeoJSON.AJAX("/routes/Lines_Tram.geojson"); 
 let uBahn = new L.GeoJSON.AJAX("/routes/Lines_UBahn.geojson");  */


 /* 
 
       d3.xml("/svg/Sbahn.svg").then
             (function (error, documentFragment) {

                 if (error) {
                     console.log(error);
                     return;
                 }
                 console.log(documentFragment)
                 var svgNode = documentFragment
                     .getElementsByTagName("svg")[0];
                 //use plain Javascript to extract the node

                 main_chart_svg.node().appendChild(svgNode);
                 //d3's selection.node() returns the DOM node, so we
                 //can use plain Javascript to append content

                 var innerSVG = main_chart_svg.select("svg");

                 innerSVG.transition().duration(1000).delay(1000)
                     .select("circle")
                     .attr("r", 100);

             });
 
 */