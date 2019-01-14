
let disableSingleMapEvent = false;
let focusedLine;


function pathDistanceBetweenTwoPoints(path, x1, x2) {
    var pathLength = path.getTotalLength();
    var distance = 0, distance1;
    while (distance < pathLength && x1 > path.getPointAtLength(distance))
        distance1 = distance++;
    while (distance < pathLength && x2 > path.getPointAtLength(distance))
        distance++;
    return distance - distance1;
}

function combineRoutes(route1, route2) {
    for (let i = 0; i < route2.features.length; i++) {
        route1.features.push(route2.features[i])
    }
    return route1
}

function focusLine(line, lineData){
    if(focusedLine){
        unfocusLine()
    }
    d3.select(line)
    .attr("stroke", lineData.properties.color)
    .attr("stroke-width", 6)
    focusedLine=line;
    disableSingleMapEvent=true
}
function unfocusLine(){
    d3.select(focusedLine)
    .attr("stroke", "gray")
    .attr("stroke-width", 3)
}

//usingJquery to update the board
function updateBoard(departues){

   elements= [{line: '.cls-3', departues: ".cls-6[x='28']"}, {line: '.cls-8', departues: '.cls-8 .cls-6'} ,{line: '.cls-9', departues: '.cls-9 .cls-6'} ,{line: '.cls-12', departues: '.cls-12 .cls-6'}, {line: '.cls-25', departues: '.value'}] 
   elements.forEach((element)=> {
    d3.select('#bahnen').select(element.departues).text('test')
   })
   
   
   //d3.select('#bahnen').select('.cls-6').text("New");
       
    
}

d3.select('#map').on("click", function(){
    if(disableSingleMapEvent){
        disableSingleMapEvent=false;
    }
    else if(focusedLine){
        unfocusLine();
    } 
    updateBoard()  
}) 



d3.json("/routes/UBahnRoutes.json")
    .then(function (ubahn) {
        d3.json("/routes/TramRoutes.json")
            .then(async function (tram) {
                let collection = combineRoutes(ubahn, tram)

                //stream transform. transforms geometry before passing it to
                // listener. Can be used in conjunction with d3.geo.path
                // to implement the transform. 
                let transform = d3.geoTransform({
                    point: projectPoint
                })

                //d3.geo.path translates GeoJSON to SVG path codes.
                //essentially a path generator. In this case it's
                // a path generator referencing our custom "projection"
                // which is the Leaflet method latLngToLayerPoint inside
                // our function called projectPoint 
                let path = d3.geoPath().projection(transform);
 
                let feature = g.selectAll("path")
                    .data(collection.features)
                    .enter()
                    .append("path")
                    .attr("class", "lineConnect")
                    .attr("stroke", "gray")
                    .attr("stroke-width", 3)
                    .on("click", function(lineData){
                        focusLine(this, lineData)    
                    }) 




                map.on("zoomend", reset);

                let bounds;
                let topLeft;
                let bottomRight;

                reset();

                // Reposition the SVG to cover the features.
                function reset() {
                    bounds = path.bounds(collection)
                    topLeft = bounds[0]
                    bottomRight = bounds[1]
                    svg.attr("width", bottomRight[0] - topLeft[0])
                        .attr("height", bottomRight[1] - topLeft[1])
                        .style("left", topLeft[0] + "px")
                        .style("top", topLeft[1] + "px")
                    g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");
                    feature.attr("d", path);
                }

                // Draw a red circle on the map:


                var innerSVG = svg.select("svg");



                let animationRoutes = {};
                //generate Paths for different vehicles
                for (let i = 0; i < collection.features.length; i++) {
                    let path = d3.selectAll('.lineConnect')._groups[0][i]
                    animationRoutes[collection.features[i].properties.Start_Name] = path;
                }

                //Add ids to Paths to acess them with jquery
                let keys = Object.keys(animationRoutes)
                keys.forEach(key => {
                    const selector= animationRoutes[key]
                    d3.select(selector).attr("id", key+'Route')
                });
  

                let uBahnDepartues = await fetch('/departues/Flughafen/u')
                    .then(function (res) {
                        try{
                        return res.json()
                        }catch(err){
                            return null
                        }
                    })
                    .then(function (data) {
                        if(data.length==0){
                            data=[{lineNumber: 1, departue: 1}, {lineNumber: 2, departue: 4}, {lineNumber: 4, departue: 6}, {lineNumber:5}]
                        }
                        let departues = []
                        for (let i = 0; i < data.length; i++) {
                            if (keys.includes("U" + data[i].lineNumber))
                                departues.push(data[i])
                        }
                        return departues
                    })
                    .catch(function (error) {
                        // If there is any error you will catch them here
                    });

                let tramDepartues = await fetch('/departues/Flughafen/t')
                    .then(function (res) {
                        return res.json()
                    })
                    .then(function (data) {
                        let departues = []
                        for (let i = 0; i < data.length; i++) {
                            if (keys.includes(data[i].lineNumber.toString()))
                                departues.push(data[i])
                        }
                        return departues
                    })
                    .catch(function (error) {
                        // If there is any error you will catch them here
                    });

                let circleRadii = []
                let circleID = []
                for (let i = 0; i < (tramDepartues.length + uBahnDepartues.length); i++) {
                    circleRadii.push(40)
                    circleID.push(i);
                }
                //let circleRadii = [40, 40, 40];

                var defs = svg.append('svg:defs');

                //Initialize Logos
                for (let i = 0; i < keys.length; i++) {
                    defs.append("svg:pattern")
                        .attr("id", keys[i])
                        .attr("width", 100)
                        .attr("height", 100)
                        .attr("patternUnits", "userSpaceOnUse")
                        .append("svg:image")
                        .attr("xlink:href", `/svg/${keys[i]}.svg`)
                        .attr("width", 30)
                        .attr("height", 30)

                }


                let count = 1
                let copyOfUbahn = JSON.parse(JSON.stringify(uBahnDepartues))
                let copyOfTram = JSON.parse(JSON.stringify(tramDepartues))

                function getID() {
                    if (copyOfUbahn.length != 0) {
                        const temp = copyOfUbahn.pop()
                        return "U" + temp.lineNumber
                    } else if (copyOfTram.length != 0) {
                        const temp = copyOfTram.pop()
                        return temp.lineNumber
                    } else {
                        return 0;
                    }
                }

                let circles = svg.selectAll("circle")
                    .data(circleRadii)
                    .enter()
                    .append("circle")

                let circleAttributes = circles
                    .attr("r", function (d) {
                        return d;
                    })
                    .attr("id", function () {
                        let id = getID()
                        return id;
                    })
                    /* .attr("transform", function () {
                         let p = pathNode.getPointAtLength(0)
                         return "translate(" + [p.x + -topLeft[0], p.y + -topLeft[1]] + ")";
                     })*/
                    .style("fill", "#fff")
                    .style("fill", function (d, i, id) {
                        return `url(#${id[i].id})`
                    });

                duration = 100000;
                circles.transition()
                    .duration(duration)
                    .ease(d3.easePoly)
                    .attrTween("transform", function (d, i, id) {
                        return function (t) {
                            let pathLength = animationRoutes[`${id[i].id}`].getTotalLength();
                            p = animationRoutes[`${id[i].id}`].getPointAtLength(pathLength * t)
                            return "translate(" + [(p.x + -topLeft[0] - 15), (p.y + -topLeft[1] - 15)] + ")";
                        }
                    });
                    //For late point eventacess with jquery
                   /* $( "#U1Route" ).click(function() {
                        alert( "Handler for .click() called." );
                      });*/

            })

    })