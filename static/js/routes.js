let disableSingleMapEvent = false;
let focusedLine;
let focusedCircle;



function pathDistanceBetweenTwoPoints(path, x1, x2) {
    var pathLength = path.getTotalLength();
    var distance = 0,
        distance1;
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

function focusCircles(line) {
    console.log(line)
    const id = "[id='" + line + "']"
    console.log(d3.selectAll(id).style("fill", `url(#${line}big)`)
        .attr("r", 80))
    focusedCircle = id;

}

function unfocusCircles() {
    const id = focusedCircle.split("'")[1]
    d3.selectAll(focusedCircle).style("fill", `url(#${id})`)
        .attr("r", 40)
}

function focusLine(line, lineData) {
    if (focusedLine) {
        unfocusLine()
    }
    if (focusedCircle) {
        unfocusCircles()
    }
    let circleID = lineData ? lineData.properties.Name : line.id
    let color = lineData ? lineData.properties.color : d3.select(line).attr("color")
    if (!lineData) {
        const id = "[id='" + line.id + "Route']"
        line = d3.select(id)._groups[0][0]
    }
    d3.select(line)
        .attr("stroke", color)
        .attr("stroke-width", 6)
    focusedLine = line;
    disableSingleMapEvent = true
    focusCircles(circleID)
}

function unfocusLine() {
    unfocusCircles()
    d3.select(focusedLine)
        .attr("stroke", "gray")
        .attr("stroke-width", 3)
}

//usingJquery to update the board
function updateBoard(departures) {

    elements = [{
        line: '.cls-3',
        departures: ".cls-6[x='28']"
    }, {
        line: '.cls-8',
        departures: '.cls-8 .cls-6'
    }, {
        line: '.cls-9',
        departures: '.cls-9 .cls-6'
    }, {
        line: '.cls-12',
        departures: '.cls-12 .cls-6'
    }, {
        line: '.cls-25',
        departures: '.value'
    }]
    elements.forEach((element) => {
        d3.select('#bahnen').select(element.departures).text('test')
    })


    //d3.select('#bahnen').select('.cls-6').text("New");


}

d3.select('#map').on("click", function () {
    if (disableSingleMapEvent) {
        disableSingleMapEvent = false;
    } else if (focusedLine) {
        unfocusLine();
    }
    //updateBoard()
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
                    .on("click", function (lineData) {
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
                    const selector = animationRoutes[key]
                    d3.select(selector).attr("id", key + 'Route')
                });


                let uBahnDepartures = await fetch('/departues/Hbf/u')
                    .then(function (res) {
                        return [];
                    })
                    .then(function (data) {
                        data = [{
                            lineNumber: 1,
                            departure: 1,
                            location: "Rotkreuzplatz"
                        },{
                            lineNumber: 1,
                            departure: 22,
                            location: "Rotkreuzplatz"
                        },{
                            lineNumber: 1,
                            departure: 60,
                            location: "Mangfallplatz"
                        }, {
                            lineNumber: 2,
                            departure: 4,
                            location: "Scheidplatz"
                        },{
                            lineNumber: 2,
                            departure: 15,
                            location: "Messestadt Ost"
                        },{
                            lineNumber: 2,
                            departure: 30,
                            location: "Messestadt Ost"
                        },{
                            lineNumber: 2,
                            departure: 19,
                            location: "Scheidplatz"
                        }, {
                                lineNumber: 4,
                                departure: 5,
                                location: "Heimeranplatz"
                            }, {
                                lineNumber: 5,
                                departure: 50,
                                location: "Neuperlach Süd"
                            },{
                                lineNumber: 5,
                                departure: 34,
                                location: "Heimeranplatz"
                            }, {
                                lineNumber: 1,
                                departure: 1,
                                location: "Mangfallplatz"
                            }, {
                                lineNumber: 2,
                                departure: 15,
                                location: "Scheidplatz"
                            }, {
                                lineNumber: 4,
                                departure: 6,
                                location: "Arabellapark"
                            },{
                                lineNumber: 4,
                                departure: 28,
                                location: "Arabellapark"
                            }, {
                                lineNumber: 5,
                                departure: 25,
                                location: "Neuperlach Süd"
                            },
                            {
                                lineNumber: 1,
                                departure: 1,
                                location: "Rotkreuzplatz"
                            }, {
                                lineNumber: 2,
                                departure: 17,
                                location: "Messestadt Ost"
                            }, {
                                lineNumber: 4,
                                departure: 6,

                            }, {
                                lineNumber: 5,
                                departure: 7,
                                location: "Heimeranplatz"
                            }
                        ]
                        let departures = []
                        for (let i = 0; i < data.length; i++) {
                            if (keys.includes("U" + data[i].lineNumber))
                                departures.push(data[i])
                        }
                        return departures
                    })
                    .catch(function (error) {
                        // If there is any error you will catch them here
                    });

                let tramDepartures = await fetch('/departues/Hbf/t')
                    .then(function (res) {
                        return [];
                    })
                    .then(function (data) {
                        data = [{
                                lineNumber: 16,
                                departure: 3,
                                location: "Hackerbrücke"
                            }, {
                                lineNumber: 17,
                                departure: 6,
                                location: "Hackerbrücke"
                            }, {
                                lineNumber: 19,
                                departure: 10,
                                location: "Trappentreustraße"
                            }, {
                                lineNumber: 20,
                                departure: 15,
                                location: "Hochschule München"
                            }, {
                                lineNumber: 16,
                                departure: 3,
                                location: "Hackerbrücke"
                            }, {
                                lineNumber: 17,
                                departure: 6,
                                location: "Hochschule München"
                            }, {
                                lineNumber: 19,
                                departure: 30,
                                location: "Trappentreustraße"
                            }, {
                                lineNumber: 20,
                                departure: 7,
                                location: "Hochschule München"
                            }, {
                                lineNumber: 16,
                                departure: 25,
                                location: "Effnerplatz"
                            }, {
                                lineNumber: 17,
                                departure: 40,
                                location: "Hackerbrücke"
                            }, {
                                lineNumber: 20,
                                departure: 35,
                                location: "Hochschule München"
                            },
                            {
                                lineNumber: 16,
                                departure: 16,
                                location: "Donnersbergerstraße"
                            }, {
                                lineNumber: 17,
                                departure: 10,
                                location: "Giesing Bahnhof"
                            }, {
                                lineNumber: 19,
                                departure: 12,
                                location: "Ostbahnhof"
                            },
                            {
                                lineNumber: 19,
                                departure: 70,
                                location: "Ostbahnhof"
                            },
                            {
                                lineNumber: 20,
                                departure: 13,
                                location: "Karlsplatz"
                            },
                            {
                                lineNumber: 16,
                                departure: 28,
                                location: "Donnersbergerstraße"
                            }, {
                                lineNumber: 17,
                                departure: 25,
                                location: "Giesing Bahnhof"
                            }, {
                                lineNumber: 19,
                                departure: 30,
                                location: "Ostbahnhof"
                            }, {
                                lineNumber: 20,
                                departure: 30,
                                location: "Karlsplatz"
                            }
                        ]
                        let departures = []
                        for (let i = 0; i < data.length; i++) {
                            if (keys.includes(data[i].lineNumber.toString()))
                                departures.push(data[i])
                        }
                        return departures
                    })
                    .catch(function (error) {
                        // If there is any error you will catch them here
                    });

                let circleRadii = []
                let circleID = []
                for (let i = 0; i < (tramDepartures.length + uBahnDepartures.length); i++) {
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

                    defs.append("svg:pattern")
                        .attr("id", `${keys[i]}big`)
                        .attr("width", 200)
                        .attr("height", 200)
                        .attr("patternUnits", "userSpaceOnUse")
                        .append("svg:image")
                        .attr("xlink:href", `/svg/${keys[i]}big.svg`)
                        .attr("width", 60)
                        .attr("height", 60)
                }


                let count = 1
                let copyOfUbahnLine = [];
                let copyOfUbahnDepartue = [];
                let copyOfUbahnLocation = [];

                uBahnDepartures.forEach((element) => {
                    copyOfUbahnLine.push(element.lineNumber)
                    copyOfUbahnDepartue.push(element.departure)
                    copyOfUbahnLocation.push(element.location)
                })

                let copyOfTramLine = [];
                let copyOfTramDepartue = [];
                let copyOfTramLocation = [];
                tramDepartures.forEach((element) => {
                    copyOfTramLine.push(element.lineNumber)
                    copyOfTramDepartue.push(element.departure)
                    copyOfTramLocation.push(element.location)
                })


                function getID() {
                    if (copyOfUbahnLine.length != 0) {
                        const temp = copyOfUbahnLine.pop()
                        return "U" + temp
                    } else if (copyOfTramLine.length != 0) {
                        const temp = copyOfTramLine.pop()
                        return temp
                    } else {
                        return 0;
                    }
                }

                function getLocation() {
                    if (copyOfUbahnLocation.length != 0) {
                        const temp = copyOfUbahnLocation.pop()
                        return temp
                    } else if (copyOfTramLocation.length != 0) {
                        const temp = copyOfTramLocation.pop()
                        return temp
                    } else {
                        return 0;
                    }

                }

                function getColor(name) {
                    let color;
                    collection.features.forEach((element) => {
                        if (element.properties.Start_Name == name) {
                            color = element.properties.color
                        }
                    })
                    return color
                }

                function getDepartueTime() {
                    if (copyOfUbahnDepartue.length != 0) {
                        const temp = copyOfUbahnDepartue.pop()
                        return temp
                    } else if (copyOfTramDepartue.length != 0) {
                        const temp = copyOfTramDepartue.pop()
                        return temp
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
                    .attr("location", function () {
                        let location = getLocation()
                        return location;
                    })
                    .attr("departure", function () {
                        let departure = getDepartueTime()
                        return departure;
                    })
                    .attr("color", function () {
                        const color = getColor(this.id)
                        return color;
                    })
                    .on("click", function () {
                        focusLine(this)
                    })
                    /* .attr("transform", function () {
                         let p = pathNode.getPointAtLength(0)
                         return "translate(" + [p.x + -topLeft[0], p.y + -topLeft[1]] + ")";
                     })*/
                    .style("fill", "#fff")
                    .style("fill", function (d, i, id) {
                        return `url(#${id[i].id})`
                    });

                duration = 1000 * 60 * 20;
                circles.transition()
                    .duration(duration)
                    .ease(d3.easeLinear)
                    .attrTween("transform", function (d, i, id) {
                        let direction;
                        collection.features.forEach((element) => {
                            if (element.properties.Start_Name == id[i].id) {
                                if (element.properties.before_HBF.includes(d3.select(id[i]).attr("location"))) {
                                    direction = true
                                } else {
                                    direction = false
                                }
                            }
                        })
                        return function (t) {
                            let position = d3.select(id[i]).attr("departure");
                            let radius = d3.select(id[i]).attr("r")
                            let p;
                            let pathLength = animationRoutes[`${id[i].id}`].getTotalLength();
                            if (direction) {
                                p = animationRoutes[`${id[i].id}`].getPointAtLength(pathLength - (pathLength * t) - (pathLength / position) * 3)
                            } else {
                                p = animationRoutes[`${id[i].id}`].getPointAtLength((pathLength / (position) * 7) + pathLength * t)
                            }
                            if (radius == 80) {
                                return "translate(" + [(p.x + -topLeft[0] - 30), (p.y + -topLeft[1] - 30)] + ")";
                            } else {
                                return "translate(" + [(p.x + -topLeft[0] - 15), (p.y + -topLeft[1] - 15)] + ")";

                            }
                        }
                    });
                //For late point eventacess with jquery
                /* $( "#U1Route" ).click(function() {
                     alert( "Handler for .click() called." );
                   });*/

            })

    })