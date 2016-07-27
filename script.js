var data,
    margin = { top: 15, right: 15, bottom: 40, left: 15 },
    width = 1460 - margin.left - margin.right,
    height = 100 - margin.top - margin.bottom,
    cellSize = 3;

//DATE PARSER

var dateParser = d3.timeParse("%Y-%m-%d"),
    yearFormat = d3.timeFormat("%Y");


// Declaring our constants


// d3.queue() enables us to load multiple data files. Following the example below, we make
// additional .defer() calls with additional data files, and they are returned as results[1],
// results[2], etc., once they have all finished downloading.
d3.queue()
  .defer(d3.json, 'data/polviol.json')
  .awaitAll(function (error, results) {
    if (error) { throw error; }
    data = results[0];

    var chart1 = new Chart(2013),
        chart2 = new Chart(2014);
  });


function Chart(year) {
    var chart = this;

    txData = data.slice();

    txData = txData.filter(function (d) {
        return yearFormat(dateParser(d.deathDate)) === year.toString();
      }); 



    // Tooltips from http://bl.ocks.org/d3noob/a22c42db65eb00d4e369
    // Define the div for the tooltip

    var div = d3.select("body").append("div") 
                .attr("class", "tooltip")       
                .style("opacity", 0);


    // SVG

    chart.svg = d3.select('#chart')
                  .append('svg')
                  .attr("width", width + margin.right + margin.left)
                  .attr("height", height + margin.top + margin.bottom)
                  //.style("background", "lightgrey")
                  .append('g')
                  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // SCALES

    chart.x = d3.scaleTime()
                .domain([new Date(year, 0, 1), new Date(year + 1, 0, 1)])
                .range([0, width])
                .nice();
    
    // AXES

    var xAxis = d3.axisBottom()
                  .scale(chart.x);


    chart.svg.append("g")
             .attr("class", "axis") 
             .attr("transform", "translate(0," + (height) + ")")
             .call(xAxis);

    // NEST DATA 

    var vicsByDate = d3.nest()
                       .key(function(d) { return d.deathDate})
                       .entries(txData);

    var dateGroup = chart.svg.selectAll(".day")
                             .data(vicsByDate)
                             .enter().append("g")
                             .attr("transform", "translate(0," + (height - 5) + ")")
                             .attr("class", "day");

    var victims = dateGroup.selectAll(".victim")
                           .data(function(d) {return d.values; })
                           .enter().append("rect")
                           .attr("class", "victim")
                           .attr("x", function(d) { return chart.x(dateParser(d.deathDate))} )
                           .attr("y", function(d,i) { return -(i*cellSize)-(i+1)})
                           .attr("rx", .5)
                           .attr("ry", .5)
                           .attr("height", cellSize)
                           .attr("width", cellSize)
                           .attr("class", function(d) { return d.status})
                           .on("mouseover", function(d) {    
                                       div.transition()    
                                          .duration(200)    
                                          .style("opacity", .9);    
                                       div.html(d.deathDate)  
                                          .style("left", (d3.event.pageX) + "px")   
                                          .style("top", (d3.event.pageY - 28) + "px");  
                                      })          
                            .on("mouseout", function(d) {   
                                div.transition()    
                                    .duration(500)    
                                    .style("opacity", 0);
                                     }); 
                              
  }
