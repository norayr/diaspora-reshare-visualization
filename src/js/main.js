$(function() {

    var loader = $('#loader');

    var viewportWidth = $(window).width();
    var viewportHeight = $(window).height();

    var createGraph = function (startUrl) {
        $('#mainBox svg').remove();

        var width =  viewportWidth
            height = viewportHeight - 120 ;

        var color = d3.scale.category20();

        var force = d3.layout.force()
            .linkDistance(150)
            .charge(-1000)
            .size([width, height]);


        var svg = d3.select("#mainBox").append("svg")
            .attr("width", width)
            .attr("height", height);

        var redraw = function redraw() {
            console.log("here", d3.event.translate, d3.event.scale);
            vis.attr("transform",
                "translate(" + d3.event.translate + ")"
                    + " scale(" + d3.event.scale + ")");
        };

        d3.json(startUrl, function(graph) {



            $('#loader').fadeOut();

            force
                .nodes(graph.nodes)
                .links(graph.links)
                .start();


            var link = svg.selectAll("line.link")
                    .data(graph.links)
                    .enter().append("line")
                    .attr("class", "link")
                ;


            var node = svg.selectAll("g.node")
                .data(graph.nodes)
                .enter().append("g")
                .call(d3.behavior.zoom().on("zoom", redraw))
                .attr("class", "node")
                //.on('click', click)
                .call(force.drag);


            node.append("svg:rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("height", 32)
                .attr("width", 140)
                .attr("class", "node-rect");


            node.append("image")
                .attr("xlink:href", function (d) {
                    return d.avatar
                })
                .attr("x", 8)
                .attr("y", -8)
                .attr("width", function (d) {
                    return 32
                })
                .attr("height", function (d) {
                    return 32
                });

            node.append("circle")
                .attr("class", "node-circle")
                .attr("r", function (d) {
                    return Math.sqrt(d.sumReshares * 2.5) + 8
                })
                .style("fill", function (d) {
                    return color(d.group);
                });


            node.append("svg:text")
                .attr("dx", 42)
                .attr("dy", '2em')
                .text(function (d) {
                    return 'Likes: ' + d.sumLikes.toString()
                });

            node.append("svg:text")
                .attr("dx", 42)
                .attr("dy", '1em')
                .text(function (d) {
                    return 'Comments: ' + d.sumComments.toString()
                });


            force.on("tick", function () {
                link.attr("x1", function (d) {
                    return d.source.x;
                })
                    .attr("y1", function (d) {
                        return d.source.y;
                    })
                    .attr("x2", function (d) {
                        return d.target.x;
                    })
                    .attr("y2", function (d) {
                        return d.target.y;
                    });

                node.attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")";
                });
            });
        });


    };

    $('#searchForm').submit(function(e) {
        e.preventDefault();
        loader.fadeIn(function() {
            url =  'endpoint.php?startUrl='+  $('#startUrl').val();
            createGraph(url);
        });
    });
});

