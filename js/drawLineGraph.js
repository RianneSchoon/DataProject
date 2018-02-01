/* ---------------------------------------------------------------------------
drawLineGraph.js

Function that draws a multi line graph with two y-axes. 
Lines and axes update and highlight on map-click. The time selected by slider 
is shown as a vertical line. Hovering lines lets information pop-up in tooltip.

Rianne Schoon, 10742794
--------------------------------------------------------------------------- */

function drawLineGraph (ldata, y2Key, selectedCountry, selectedVar, lineKeys, yearKeys, y1Keys, lifeKeys, translations) {

  // set height, width and margins
  var margin = {top: 10, right: 180, bottom: 20, left: 30},
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
  // var color = d3.scale.category10();
  var color = {"physicians": "#1f77b4", "nurses": "#ff7f0e", "beds": "#2ca02c", "LEP": "#d62728", "GDP": "#9467bd"};

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
      .attr("class", "linexaxis")
      .attr("class", "axis")
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
      .attr("class", "liney1axis")
      .attr("class", "axis")
      .call(y1Axis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Health care (per 1000 of population)");

  // create y2-axis and title for LEP
  svg.append("g")
    .attr("class", "liney2axis")
    .attr("class", "axis")
    .attr("transform", "translate(" + width + " ,0)")
    .call(y2Axis)
    
  if (selectedVar == "GDP") {
    d3.select(liney2axis)
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", -13)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Gross Domestic Product (USD");
  }
  else if (selectedVar == "LEP") {
    d3.select(liney2axis)
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", -13)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Life expectancy (years)");
  }
  

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
      .style("stroke", function(d) { return color[d]; });
  y2Lines.append("path")
      .attr("class", function(d) { return "y2line " + d; })
      .attr("fill", "none")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", "2")
      .attr("d", function(d) { return y2Line(ldata[selectedCountry][d]); })
      .style("stroke", function(d) { return color[d]; });

  // line labels
  svg.selectAll(".y1Labels")
      .data(y1Keys)
    .enter().append("text")
      .attr("class", function(d) { return "linelabel " + d; })
      .attr("transform", function(d, i) { return "translate(" + (width + 55) + "," + i * 25 + ")"; })
      .attr("dy", ".35em")
      .attr("text-anchor", "start")
      .style("fill", function(d) { return color[d]; })
      .text(function(d) { return translations[d]; });
  svg.selectAll(".y2Labels")
      .data(y2Key)
    .enter().append("text")
      .attr("class", function(d) { return "linelabel " + d; })
      .attr("transform", function(d, i) {; return "translate(" + (width + 55) + "," + 8 + i * 25 + ")"; })
      .attr("dy", ".35em")
      .attr("text-anchor", "start")
      .style("fill", function(d) { return color[d]; })
      .text(function(d) { return translations[d]; });

  // highlight variable line according to radio button selection
  lineSelect(selectedVar);

  // clicking line to see where the axes light up
  d3.selectAll('.line').on('click', function() {
    console.log(d3.select(this).attr("class").slice(17));

    // update current selection text
    d3.select("#country-value").text(translations[selectedCountry]);
  });

  // tooltip functionality
  var tooltip_s = d3.select(".linechart").append("div").attr("class", "tooltip sct hidden");

  // offsets for tooltips
  var offsetL = document.getElementsByClassName('linechart').offsetLeft + 50;
  var offsetT = document.getElementsByClassName('linechart').offsetTop + 40;

  // tooltips appear when mouse is over country - and follow mouse movements
  y1Lines
    .on("mouseover", function(d, i) {
      console.log("movementtttt")

      // tooltip visible centered on dot when mouse moves over dot
      var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); });
      tooltip_s.classed("hidden", false)
        .style("x", 20)
        .style("y", 20)
        .attr("style", "left:" + (mouse[0] + offsetL) + "px;top:" + (mouse[1] + offsetT)+"px")
        .html("<strong>Country:</strong> <span style='color:midnightblue'>" + selectedCountry + "</span>" + "<br>" +
          "<strong>variable:</strong> <span style='color:midnightblue'>" + translate[selectedVar] + "</span>");
    })

  // when mouse moves away, tooltip disappears
  .on("mouseout",  function(d, i) {
    tooltip_s.classed("hidden", true);
  });

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