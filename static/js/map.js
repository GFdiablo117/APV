 // load a tile layer
 let map = new L.map('map', {
     center: [48.1403114185532, 11.5611056053238], // Location munich hbf
     zoom: 16
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

    iconSize:     [40, 40], // size of the icon
});

var stationIcon = L.icon({
    iconUrl: '/svg/station.svg',

    iconSize: [10, 10], // size of the icon
});
 d3.json("/stations/hbf.json").then(function (test) {

     L.geoJson(test, {
         pointToLayer: function (feature, latlng) {
             return L.marker(latlng, {icon: HBFIcon});
         }
     }).addTo(map);
 })


 d3.json("/stations/mergedStations.json").then(function (test) {

    L.geoJson(test, {
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {icon: stationIcon});
        }
    }).addTo(map);
}) 

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