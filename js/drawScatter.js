/* ---------------------------------------------------------------------------
drawScatter.js

Function that draws scatterplot. 
Dots represent countries; legend clickable to highlight data by continent. 
Hovering dots lets information pop-up in tooltip. Country selection in map
highlights the dot. The axes update according to radio button selection.

Rianne Schoon, 10742794
--------------------------------------------------------------------------- */

function drawScatter(msdata, ldata, selectedYear, selectedVar, countryKeys, test) {

  // set height, width and margins
  var margin = {top: 10, right: 130, bottom: 20, left: 55},
    width = 750 - margin.left - margin.right,
    height = 325 - margin.top - margin.bottom;

  // scatterplot axes range
  var x = d3.scale.linear().range([0, width]);
  var y = d3.scale.linear().range([height, 0]);

  // scatterplot axes orientation
  var xAxis = d3.svg.axis().scale(x).orient("bottom");
  var yAxis = d3.svg.axis().scale(y).orient("left");

  // enable scatterplot dots to be colored
  var color = {"Africa": "#808080", "Americas": "#fcd703", "Asia": "#4a36fc", "Europe": "#7ce7ca", "Oceania": "#ff6666"};
  // var color = d3.scale.category10();


  // append scatterplot svg to html body
  var svg = d3.select("#scatter").append("svg")
      .attr("class", "scatterchart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); 

  // global in scatterplot: keep track of subselection of data in scatterplot
  var clicked = 0;
  var clickedData;

  // data arrays
  var scatXArray = [], scatYArray = [], scatDotSizeArray = [];

  // make values integers
  countryKeys.forEach(function(key) {
    scatXArray.push(+msdata[selectedYear][key][scatXVar]);
    scatYVar.forEach(function(Yvar) {
      scatYArray.push(+msdata[selectedYear][key][Yvar]);
    });
    scatDotSizeArray.push(+msdata[selectedYear][key][scatDotSize]);
  });

  // scale dots based on GDP data
  var rscale = d3.scale.linear()
    .domain(d3.extent(scatDotSizeArray)).nice()
    .range([3,20]);

  // set axes division
  x.domain(d3.extent(scatXArray)).nice();
  y.domain(d3.extent(scatYArray)).nice();

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
      .text("Physicians per 1000 people");

  // create y-axis and title
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Population life expectancy (years)");
  
  // create dots
  scatterDot = svg.selectAll(".dot")
      .data(countryKeys)
    .enter().append("circle")
      .attr("class", function(d) { return "dot " + d + " " + ldata[d].Continent; })
      .attr("r", function(d) { return rscale(+msdata[selectedYear][d][scatDotSize]); })
      .attr("cx", function(d) { return x(+msdata[selectedYear][d][scatXVar]); })
      .attr("cy", function(d) { return y(+msdata[selectedYear][d][scatYVar]); })
      .style("fill", function(d) { return color[ldata[d].Continent]; });

  // create legend with data selection functionality on click
  var continents = ["Africa", "Americas", "Asia", "Europe", "Oceania"]
  var legend = svg.selectAll(".legend")
      .data(continents)
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(" + (width + 15) + "," + i * 20 + ")"; })
      .on('click', function(continent) { return legendSelect(continent); });

  // legend colored rectangles
  legend.append("rect")
      .data(continents)
      .attr("class", function(d) { return "dot " + d; })
      .attr("width", 15)
      .attr("height", 15)
      .style("fill", function(d) { return color[d]; });

  // legend text
  legend.append("text")
      .data(continents)
      .attr("x", 20)
      .attr("y", 8)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .style("font-size", "12px")
      .text(function (d) { return d; });  

  // map and scatterplot: enabling tooltip functionality
  var tooltip_s = d3.select("#scatter").append("div").attr("class", "tooltip sct hidden");

  // offsets for tooltips
  var offsetL = document.getElementById('scatter').offsetLeft + 50;
  var offsetT = document.getElementById('scatter').offsetTop + 40;

  // tooltips appear when mouse is over country - and follow mouse movements
  scatterDot
    .data(countryKeys)
    .on("mouseover", function(d, i) {

      // tooltip visible centered on dot when mouse moves over dot
      var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); });
      tooltip_s.classed("hidden", false)
        .style("x", 20)
        .style("y", 20)
        .attr("style", "left:" + (mouse[0] + offsetL) + "px;top:" + (mouse[1] + offsetT)+"px")
        .html("<strong>Country:</strong> <span style='color:midnightblue'>" + d + "</span>" + "<br>" +
          "<strong>GDP:</strong> <span style='color:midnightblue'>" + msdata[selectedYear][d]["GDP"] + "</span>");
    })

  // when mouse moves away, tooltip disappears
  .on("mouseout",  function(d, i) {
    tooltip_s.classed("hidden", true);
  });

  /* ---------------------------------------------------------------------------
  function legendSelect(region): 
  highlight country dots from a continent in scatterplot by altering opacities
  --------------------------------------------------------------------------- */
  function legendSelect (continent) {
    // if no continent was clicked yet: according countries highlighted
    if (clicked == 0) {
      d3.selectAll(".dot").style("opacity", .3).style("stroke-width", "1px").style("stroke", "white");
      d3.selectAll("." + continent).style("opacity", 1);
      clickedData = continent
      clicked = 1;
    }
    // if a continent is clicked again: reset plot to no highlighting
    else if (clicked == 1 && continent == clickedData) {
      d3.selectAll(".dot").style("opacity", 1).style("stroke-width", "1px").style("stroke", "white");
      clickedData = continent
      clicked = 0;
    } 
    // continent already selected: switch highlight to last clicked subset
    else if (clicked == 1 && continent != clickedData) {
      d3.selectAll(".dot").style("opacity", .3);
      d3.selectAll("." + continent).style("opacity", 1).style("stroke-width", "1px").style("stroke", "white");
      clickedData = continent
      clicked = 1;
    } 
  };
};