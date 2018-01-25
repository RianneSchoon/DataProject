/* ---------------------------------------------------------------------------
drawLineGraph.js
Function that draws a multi line graph with two y-axes.

Rianne Schoon, 10742794
--------------------------------------------------------------------------- */

function drawLineGraph (ldata, selectedCountry, yearKeys, densityKeys, lifeKeys) {

  // set height, width and margins
  var margin = {top: 100, right: 200, bottom: 20, left: 30},
    width = 750 - margin.left - margin.right,
    height = 435 - margin.top - margin.bottom;

  // axes ranges
  var x = d3.time.scale().range([0, width]);
  var y1 = d3.scale.linear().range([height, 0]);
  var y2 = d3.scale.linear().range([height, 0]);

  // axes orientation
  var xAxis = d3.svg.axis().scale(x).orient("bottom");
  var y1Axis = d3.svg.axis().scale(y1).orient("left");
  var y2Axis = d3.svg.axis().scale(y2).orient("right");

  // enable lines to be colored
  var color = d3.scale.category10();

  // append svg to html body
  var svg = d3.selectAll("#line").append("svg")
      .attr("class", "linechart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // append line to svg
  var lineSvg = svg.append("g");

  // arrays for d3 extent per axis
  var yearArray = [], densityArray = [], lifeArray = [];

  // data type translations for axes division (date objects / integers)
  yearKeys.forEach(function(year) {
    yearArray.push(new Date(year));
  });
  densityKeys.forEach(function(density) {
    for (var i = 0; i < yearArray.length; i++) {
      densityArray.push(+ldata[selectedCountry][density][i]);
    }
  });
  lifeKeys.forEach(function(life) {
    for (var j = 0; j < yearArray.length; j++) {
      lifeArray.push(+ldata[selectedCountry][life][j]);
    }
  });

  // set axes division
  x.domain(d3.extent(yearArray));
  y1.domain(d3.extent(densityArray));
  y2.domain(d3.extent(lifeArray));

  // create x-axis and title
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Year");

  // create y1-axis and title
  svg.append("g")
      .attr("class", "y1 axis")
      .call(y1Axis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Per 1000 of population");

  // create y2-axis and title
  svg.append("g")
      .attr("class", "y2 axis")
      .attr("transform", "translate(" + width + " ,0)")
      .call(y2Axis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", -13)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Life expextancy in years (total population)");
    
  // create graph title
  svg.append("g")
      .attr("class", "title")
    .append("text")
      .attr("x", (width + margin.left + margin.right) * .09)
      .attr("y", - margin.top / 1.7)
      .attr("dx", ".71em")
      .attr("font-size", "20px")
      .style("text-anchor", "begin")
      .text("Cool title for this multi-line graph yas"); 

  // valuelines declarations
  var densityLine = d3.svg.line()
    .defined(function(d) { return d; })
    .x(function(d, i) { return x(yearArray[i]) })
    .y(function(d) { return y1(+d) });
  var lifeLine = d3.svg.line()
    .defined(function(d) { return d; })
    .x(function(d, i) { return x(yearArray[i]) })
    .y(function(d) { return y2(+d) });

  // create right lines on svg for every variable
  var densityLines = svg.selectAll(".densitylines")
    .data(densityKeys)
    .enter().append("g")
      .attr("class", "densitylines");
  var lifeLines = svg.selectAll(".lifelines")
    .data(lifeKeys)
    .enter().append("g")
      .attr("class", "lifelines");

  // draw lines
  densityLines.append("path")
      .attr("class", function(d) { return "densityline " + d; })
      .attr("fill", "none")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", "2")
      .attr("d", function(d) { return densityLine(ldata[selectedCountry][d]); })
      .style("stroke", function(d) { return color(d) });
  lifeLines.append("path")
      .attr("class", function(d) { return "lifeline " + d; })
      .attr("fill", "none")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", "2")
      .attr("d", function(d) { return lifeLine(ldata[selectedCountry][d]); })
      .style("stroke", function(d) { return color(d) });

  // // create legend
  // var legend = svg.selectAll(".legend")
  //     .data(color.domain())
  //   .enter().append("g")
  //     .attr("class", "legend")
  //     .attr("transform", function(d, i) { return "translate(" + (width + margin.right - 30) + "," + i * 25 + ")"; })

  //     // legend data selection functionality
  //     .on('click', function(region) { return selectData(region); })

  // // legend colored rectangles
  // legend.append("rect")
  //     .attr("class", function(d) { return "dot " + d.replace(/\s/g, ''); })
  //     .attr("width", 18)
  //     .attr("height", 18)
  //     .style("fill", color);

  // // legend text
  // legend.append("text")
  //     .attr("x", -5)
  //     .attr("y", 8)
  //     .attr("dy", ".35em")
  //     .style("text-anchor", "end")
  //     .text(function (d) { return d; });
};