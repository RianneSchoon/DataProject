/* ---------------------------------------------------------------------------
drawLineGraph.js
Function that draws a multi line graph with two y-axes.

Rianne Schoon, 10742794
--------------------------------------------------------------------------- */

function drawLineGraph (ldata, y2Key, selectedCountry, selectedVar, yearKeys, y1Keys, lifeKeys) {

  /* ---------------------------------------------------------------------------
  function lineSelect(selectedVar): 
  highlight line of variable selected in radiobuttons
  --------------------------------------------------------------------------- */
  function lineSelect(selectedVar) {

    // all lines low opacity
    d3.select("#line").selectAll(".y1line")
      .style("opacity", ".3")
      .style("stroke-width", "2px");
    d3.select("#line").selectAll(".y2line")
      .style("opacity", ".3")
      .style("stroke-width", "2px");

    // only selected lines high opacity, according to variable
    if (selectedVar == "LEP") {
      d3.select("#line").selectAll(".LEP")
      .style("opacity", "1")
      .style("stroke-width", "3px"); }
    else if (selectedVar == "physicians") {
      d3.select("#line").selectAll(".physicians")
      .style("opacity", "1")
      .style("stroke-width", "3px"); }
    else if (selectedVar == "nurses") {
      d3.select("#line").selectAll(".nurses")
      .style("opacity", "1")
      .style("stroke-width", "3px"); }
    else if (selectedVar == "beds") {
      d3.select("#line").selectAll(".beds")
      .style("opacity", "1")
      .style("stroke-width", "3px"); }
    else if (selectedVar == "GDP") {
      d3.select("#line").selectAll(".GDP")
      .style("opacity", "1")
      .style("stroke-width", "3px"); }
  };

  // set height, width and margins
  var margin = {top: 10, right: 130, bottom: 20, left: 30},
    width = 750 - margin.left - margin.right,
    height = 325 - margin.top - margin.bottom;

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
  var xArray = [], y1Array = [], y2Array = [];

  // data type translations for axes division (date objects / integers)
  yearKeys.forEach(function(year) {
    xArray.push(new Date(year));
  });
  y1Keys.forEach(function(density) {
    for (var i = 0; i < xArray.length; i++) {
      y1Array.push(+ldata[selectedCountry][density][i]);
    }
  });
  for (var j = 0; j < xArray.length; j++) {
    y2Array.push(+ldata[selectedCountry][y2Key][j]);
  }

  // set axes division
  x.domain(d3.extent(xArray));
  y1.domain(d3.extent(y1Array));
  y2.domain(d3.extent(y2Array))

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

  // create y2-axis and title for LEP
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
    .text("Gross Domestic Product (USD");

  // // create graph title
  // svg.append("g")
  //     .attr("class", "title")
  //   .append("text")
  //     .attr("x", (width + margin.left + margin.right) * .09)
  //     .attr("y", - margin.top / 1.7)
  //     .attr("dx", ".71em")
  //     .attr("font-size", "20px")
  //     .style("text-anchor", "begin")
  //     .text("Cool title that is dynamic with the content"); 

  // valuelines declarations - y1 lines
  var y1Line = d3.svg.line()
    .defined(function(d) { return d; })
    .x(function(d, i) { return x(xArray[i]) })
    .y(function(d) { return y1(+d) });

  // LEP or GDP lines
  var y2Line = d3.svg.line()
    .defined(function(d) { return d; })
    .x(function(d, i) { return x(xArray[i]) })
    .y(function(d) { return y2(+d) });  

  // create right lines on svg for every variable
  var y1Lines = svg.selectAll(".y1lines")
    .data(y1Keys)
    .enter().append("g")
      .attr("class", "y1lines");
  var y2Lines = svg.selectAll(".y2lines")
    .data(y2Key)
    .enter().append("g")
      .attr("class", "y2lines");

  // draw lines
  y1Lines.append("path")
      .attr("class", function(d) { return "y1line " + d; })
      .attr("fill", "none")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", "2")
      .attr("d", function(d) { return y1Line(ldata[selectedCountry][d]); })
      .style("stroke", function(d) { return color(d) });
  y2Lines.append("path")
      .attr("class", function(d) { return "y2line " + d; })
      .attr("fill", "none")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", "2")
      .attr("d", function(d) { return y2Line(ldata[selectedCountry][d]); })
      .style("stroke", function(d) { return color(d) });

  // line labels
  svg.selectAll(".y1Labels")
      .data(y1Keys)
    .enter().append("text")
      .attr("transform", function(d, i) { return "translate(" + (width + margin.right - 70) + "," + i * 25 + ")"; })
      .attr("dy", ".35em")
      .attr("text-anchor", "start")
      .style("fill", function(d) { return color(d); })
      .text(function(d) { return d; });
  svg.selectAll(".y2Labels")
      .data(y2Key)
    .enter().append("text")
      .attr("transform", function(d, i) {; return "translate(" + (width + margin.right - 70) + "," + 8 + i * 25 + ")"; })
      .attr("dy", ".35em")
      .attr("text-anchor", "start")
      .style("fill", function(d) { return color(d); })
      .text(function(d) { return d; });
  // svg.append("text")
  //   .attr("transform", function(d, i) { console.log(d); return "translate(" + (width + margin.right - 30) + "," + i * 25 + ")"; })
  //   .attr("dy", ".35em")
  //   .attr("text-anchor", "start")
  //   .style("fill", "steelblue")
  //   .text("Close");

  // highlight variable line according to radio button selection
  lineSelect(selectedVar);

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