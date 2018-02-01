/* ---------------------------------------------------------------------------
drawLineGraph.js

Function that draws a multi line graph with two y-axes. 
Lines, labels, axes and highlighting are updated on radio input. The selected
time by slider is shown as a vertical line. Hovering lines lets tooltip pop-up.

Rianne Schoon, 10742794
--------------------------------------------------------------------------- */

function drawLineGraph (ldata, y2Key, selectedYear, selectedCountry, selectedVar, lineKeys, yearKeys, y1Keys, lifeKeys, translations) {

  // set height, width and margins
  var margin = {top: 10, right: 200, bottom: 20, left: 30},
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
  var color = {"physicians": "#1f77b4", "nurses": "#ff7f0e", "beds": "#2ca02c", "LEP": "#d62728", "GDP": "#9467bd"};

  // append svg to html body
  var svg = d3.selectAll("#line").append("svg")
      .attr("class", "linechart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
  y2.domain(d3.extent(y2Array));

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
    .call(y2Axis);

  // variable title on y2 axis
  if (selectedVar == "GDP") {
    d3.select(".liney2axis")
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", -13)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Gross Domestic Product (USD");
  }
  else if (selectedVar == "LEP") {
    d3.select(".liney2axis")
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", -13)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Life expectancy (years)");
  }; 

  // vertical line showing year selected with slider
  var yearDate = new Date(String(selectedYear));
  svg.append("path")
      .attr("class", "timeLine")
      .style("stroke", "#999999")
      .style("stroke-width", 1);
  d3.select(".timeLine")
      .attr("d", function() {
        var d = "M" + x(yearDate) + "," + height;
        d += " " + x(yearDate) + "," + 0;
        return d;
      });

  // valuelines declarations
  var y1Line = d3.svg.line()
    .defined(function(d) { return d; })
    .x(function(d, i) { return x(xArray[i]) })
    .y(function(d) { return y1(+d) });
  var y2Line = d3.svg.line()
    .defined(function(d) { return d; })
    .x(function(d, i) { return x(xArray[i]) })
    .y(function(d) { return y2(+d) });  

  // create lines on svg for every variable
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

  // tooltip functionality
  var tooltip_l = d3.select("#line").append("div").attr("class", "tooltip lct hidden");

  // offsets for tooltips
  var offsetL = document.getElementById('line').offsetLeft + 50;
  var offsetT = document.getElementById('line').offsetTop + 40;

  // tooltips appear when mouse is over y1lines - and follow mouse movements
  y1Lines
    .on("mouseover", function(d, i) {
      // tooltip visible centered on line when mouse moves over
      var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); });
      tooltip_l.classed("hidden", false)
        .style("x", 20)
        .style("y", 20)
        .attr("style", "left:" + (mouse[0] + offsetL) + "px;top:" + (mouse[1] + offsetT)+"px")
        .html("<strong>" + translations[selectedCountry] + "</span>" + "<br>" +
          "<span style='font-weight: normal'>" + "left axis: " + translations[y1Keys[0]] + "</span>" + "<br>" +
          "<span style='font-weight: normal'>" + "left axis: " + translations[y1Keys[1]] + "</span>" + "<br>" + 
          "<span style='font-weight: normal'>" + "left axis: " + translations[y1Keys[2]] + "</span>" + "<br>" +
          "<span style='font-weight: normal'>" + "right axis: " + translations[y2Key] + "</span>");
    })
    // when mouse moves away, tooltip disappears
    .on("mouseout",  function(d, i) {
      tooltip_l.classed("hidden", true);
    });

  // tooltip functionality for y2 lines
  y2Lines
    .on("mouseover", function(d, i) {
      // tooltip visible centered on line when mouse moves over
      var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); });
      tooltip_l.classed("hidden", false)
        .style("x", 20)
        .style("y", 20)
        .attr("style", "left:" + (mouse[0] + offsetL) + "px;top:" + (mouse[1] + offsetT)+"px")
        .html("<strong>" + translations[selectedCountry] + "</span>" + "<br>" +
          "<span style='font-weight: normal'>" + "left axis: " + translations[y1Keys[0]] + "</span>" + "<br>" +
          "<span style='font-weight: normal'>" + "left axis: " + translations[y1Keys[1]] + "</span>" + "<br>" + 
          "<span style='font-weight: normal'>" + "left axis: " + translations[y1Keys[2]] + "</span>" + "<br>" +
          "<span style='font-weight: normal'>" + "right axis: " + translations[y2Key] + "</span>");
    })

  // when mouse moves away, tooltip disappears
  .on("mouseout",  function(d, i) {
    tooltip_l.classed("hidden", true);
  });

  // highlight variable line according to radio button selection
  lineSelect(selectedVar);
};

/* ---------------------------------------------------------------------------
function lineSelect(selectedVar): 
highlight line and label of variable selected in radiobuttons
--------------------------------------------------------------------------- */
function lineSelect(selectedVar) {

  // all lines and legend elements low opacity
  d3.select("#line").selectAll(".y1line")
    .style("opacity", ".3")
    .style("stroke-width", "3px");
  d3.select("#line").selectAll(".y2line")
    .style("opacity", ".3")
    .style("stroke-width", "3px");
  d3.selectAll(".linelabel")
    .style("opacity", ".3")
    .style("color", "purple");

  // only selected lines high opacity, according to variable
  if (selectedVar == "LEP") {
    d3.select("#line").selectAll(".LEP")
      .style("opacity", "1")
      .style("stroke-width", "3px")
    d3.select(".linelabel").selectAll(".LEP")
      .style("opacity", "1")
      .style("font-weight", "bold"); }
  else if (selectedVar == "physicians") {
    d3.select("#line").selectAll(".physicians")
      .style("opacity", "1")
      .style("stroke-width", "3px")
    d3.select(".linelabel").selectAll(".physicians")
      .style("opacity", "1")
      .style("font-weight", "bold"); }
  else if (selectedVar == "nurses") {
    d3.select("#line").selectAll(".nurses")
      .style("opacity", "1")
      .style("stroke-width", "3px")
    d3.select(".linelabel").selectAll(".nurses")
      .style("opacity", "1")
      .style("font-weight", "bold"); }
  else if (selectedVar == "beds") {
    d3.select("#line").selectAll(".beds")
      .style("opacity", "1")
      .style("stroke-width", "3px")
    d3.select(".linelabel").selectAll(".beds")
      .style("opacity", "1")
      .style("font-weight", "bold"); }
  else if (selectedVar == "GDP") {
    d3.select("#line").selectAll(".GDP")
      .style("opacity", "1")
      .style("stroke-width", "3px")
    d3.select(".linelabel").selectAll(".GDP")
      .style("opacity", "1")
      .style("font-weight", "bold"); }
};
