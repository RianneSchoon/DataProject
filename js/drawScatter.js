/* ---------------------------------------------------------------------------
drawScatter.js
Function that draws a scatterplot with clickable legend.

Rianne Schoon, 10742794
--------------------------------------------------------------------------- */

function drawScatter(msdata, selectedYear, selectedVar, countryKeys, test) {
  console.log(countryKeys);
  console.log(selectedVar);

  // if (selectedVar == "physicians" || scatX == "nurses" || scatX == "beds") {
  //   scatY.push("LEM");
  //   scatY.push("LEF");
  //   scatDotSize.push["GDP"]
  // }
  // else if (selectedVar == "GDP") {
  //   scatY.push("LEM");
  //   scatY.push("LEF");
  //   scatDotSize.push["GDP"] 
  // }

  var margin = {top: 10, right: 130, bottom: 20, left: 30},
    width = 750 - margin.left - margin.right,
    height = 325 - margin.top - margin.bottom;

  // scatterplot axes range
  var x = d3.scale.linear().range([0, width]);
  var y = d3.scale.linear().range([height, 0]);

  // scatterplot axes orientation
  var xAxis = d3.svg.axis().scale(x).orient("bottom");
  var yAxis = d3.svg.axis().scale(y).orient("left");

  // enable scatterplot dots to be colored
  var color = d3.scale.category20();

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
  
  // // create graph title
  // svg.append("g")
  //     .attr("class", "title")
  //   .append("text")
  //     .attr("x", (width + margin.left + margin.right) * .032)
  //     .attr("y", - margin.top / 1.7)
  //     .attr("dx", ".71em")
  //     .attr("font-size", "20px")
  //     .style("text-anchor", "begin")
  //     .text("Relation between physician density and population life expectancy");  

  // create dots
  scatterDot = svg.selectAll(".dot")
      .data(countryKeys)
    .enter().append("circle")
      .attr("class", function(d) { return "dot " + d; })
      .attr("r", function(d) { return rscale(+msdata[selectedYear][d][scatDotSize]); })
      .attr("cx", function(d) { return x(+msdata[selectedYear][d][scatXVar]); })
      .attr("cy", function(d) { return y(+msdata[selectedYear][d][scatYVar]); })
      .style("fill", color);
      // .style("fill", function(d) { return color(+msdata[selectedYear][d]); })

  // create legend with data selection functionality on click
  var legend = svg.selectAll(".legend")
      .data(countryKeys)
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(" + (width + margin.right - 70) + "," + i * 7 + ")"; })
      .on('click', function(region) { return legendSelect(region); });

  // legend colored rectangles
  legend.append("rect")
      .data(countryKeys)
      .attr("class", function(d) { return "dot " + d; })
      .attr("width", 6)
      .attr("height", 6)
      .style("fill", color);

  // legend text
  legend.append("text")
      .data(countryKeys)
      .attr("x", -5)
      .attr("y", 3)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .style("font-size", "6px")
      .text(function (d) { return d; });

  // enable data selection in scatterplot via the legend

  function legendSelect (region) {
    // if no subset of data has been clicked yet: clicked subset of data pops out
    if (clicked == 0) {
      d3.selectAll(".dot").style("opacity", .3).style("stroke-width", "1px").style("stroke", "white");
      // the "replace" part: no spaces in the class name (see line 147)
      d3.selectAll("." + region.replace(/\s/g, '')).style("opacity", 1);
      clickedData = region
      clicked = 1;
    }
    // if a selected data subset is clicked again: reset graph to no pop-outs
    else if (clicked == 1 && region == clickedData) {
      d3.selectAll(".dot").style("opacity", 1).style("stroke-width", "1px").style("stroke", "white");
      clickedData = region
      clicked = 0;
    } 
    // if a data subset has been selected, but now another subset is clicked: 
    // switch pop-out to last clicked subset
    else if (clicked == 1 && region != clickedData) {
      d3.selectAll(".dot").style("opacity", .3);
      d3.selectAll("." + region.replace(/\s/g, '')).style("opacity", 1).style("stroke-width", "1px").style("stroke", "white");
      clickedData = region
      clicked = 1;
    } 
  };

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
    })
};