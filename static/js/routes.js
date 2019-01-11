function combineRoutes(route1, route2) {
    for (let i = 0; i < route2.features.length; i++) {
        route1.features.push(route2.features[i])
    }
    return route1
}

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
                    .enter().append("path")
                    .attr("class", "lineConnect");
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


                //svg.node().appendChild(svgNode);
                //d3's selection.node() returns the DOM node, so we
                //can use plain Javascript to append content

                var innerSVG = svg.select("svg");



                let animationRoutes = {};
                //generate Paths for different vehicles
                for (let i = 0; i < collection.features.length; i++) {
                    let path = d3.selectAll('.lineConnect')._groups[0][i]
                    animationRoutes[collection.features[i].properties.Start_Name]=path;
                }
                let keys = Object.keys(animationRoutes)


                console.log(animationRoutes)


                let uBahnDepartues = await fetch('/departues/Hauptbahnhof/u')
                    .then(function (res) {
                        return res.json()
                    })
                    .then(function (data) {
                        let departues= []
                        for(let i = 0; i<data.length; i++){
                        if(keys.includes("U"+data[i].lineNumber))
                            departues.push(data[i])             
                        }
                        return departues
                    })
                    .catch(function (error) {
                        // If there is any error you will catch them here
                    });

                    let tramDepartues = await fetch('/departues/Hauptbahnhof/t')
                    .then(function (res) {
                        return res.json()
                    })
                    .then(function (data) {
                        let departues= []
                        for(let i = 0; i<data.length; i++){
                        if(keys.includes(data[i].lineNumber.toString()))
                            departues.push(data[i])             
                        }
                        return departues
                    })
                    .catch(function (error) {
                        // If there is any error you will catch them here
                    });
                console.log(tramDepartues)
                console.log(uBahnDepartues);
                let testPath = d3.selectAll('.lineConnect')._groups[0][0]
                let testPath2 = d3.selectAll('.lineConnect')._groups[0][1]
                let testPath3 = d3.selectAll('.lineConnect')._groups[0][2]
                let pathNode = testPath
                let pathNode2 = testPath2
                let pathNode3 = testPath3
                let pathLength = pathNode.getTotalLength();
                //generate circles for amount of Lines
                let circleRadii= []
                let circleID= []
                for(let i = 0; i <(tramDepartues.length+ uBahnDepartues.length); i++){
                    circleRadii.push(40)
                    circleID.push(i);
                }
                //let circleRadii = [40, 40, 40];

                var defs = svg.append('svg:defs');
                
                //Initialize Logos
                for(let i = 0 ; i<keys.length; i++){
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
               /* defs.append("svg:pattern")
                    .attr("id", "grump_avatar2")
                    .attr("width", 100)
                    .attr("height", 100)
                    .attr("patternUnits", "userSpaceOnUse")
                    .append("svg:image")
                    .attr("xlink:href", '/svg/Ubahn.svg')
                    .attr("width", 30)
                    .attr("height", 30)


                defs.append("svg:pattern")
                    .attr("id", "grump_avatar3")
                    .attr("width", 100)
                    .attr("height", 100)
                    .attr("patternUnits", "userSpaceOnUse")
                    .append("svg:image")
                    .attr("xlink:href", '/svg/Tram.svg')
                    .attr("width", 30)
                    .attr("height", 30) */
                let count = 1
                let copyOfUbahn = JSON.parse(JSON.stringify(uBahnDepartues))
                let copyOfTram = JSON.parse(JSON.stringify(tramDepartues))
                function getID() {
                    if(copyOfUbahn.length!=0){
                        const temp = copyOfUbahn.pop()
                        return "U"+temp.lineNumber
                    }
                    else if(copyOfTram.length!=0) {
                        const temp = copyOfTram.pop()
                        return temp.lineNumber
                    }
                    else{
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
                        console.log(id)
                        return id;
                    })
                    .attr("transform", function () {
                        let p = pathNode.getPointAtLength(0)
                        return "translate(" + [p.x + -topLeft[0], p.y + -topLeft[1]] + ")";
                    })
                    .style("fill", "#fff")
                    .style("fill", function (d, i) {
                        if (i == 1) {
                            return "url(#grump_avatar1)"
                        } else if (i == 2) {
                            return "url(#grump_avatar2)"
                        } else {
                            return "url(#grump_avatar3)"
                        }
                    });

                duration = 100000;
                circles.transition()
                    .duration(duration)
                    .ease(d3.easeLinear)
                    .attrTween("transform", function (d, i, id) {
                        return function (t) {
                            if (i === 1) {
                                p = pathNode2.getPointAtLength((pathLength * t))
                            } else if (i == 2) {
                                p = pathNode.getPointAtLength(20 + (pathLength * t))
                            } else {
                                p = pathNode3.getPointAtLength(20 + (pathLength * t))
                            }
                            return "translate(" + [(p.x + -topLeft[0] - 15), (p.y + -topLeft[1] - 15)] + ")";
                        }
                    });

            })

    })