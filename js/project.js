/* ---------------------------------------------------------------------------
project.js
Source code to a webpage that shows supporting means of health care 
and their influence on life expectancy around the world.

Rianne Schoon, 10742794

Sources and credits:
--------------------------------------------------------------------------- */

// global variables: year selected by slider, threelettercodes countries
var selectedYear, countryKeys;

// load all datasets before display
window.onload = function() {
  queue()
    .defer(d3.json, "mapscatterjson.json")
    .defer(d3.json, "linechartjson.json")
    .await(initAll);
};

// data highlighting in scatterplot via clicking on map
function mapSelect (country) {
  // undo previous selection -> all dots stroked with white again
  d3.select("#scatter").selectAll(".dot")
    .style("stroke", "white")
    .style("opacity", ".3")
  // currently selected class gets black stroke
  d3.select("#scatter").select("." + country)
    .style("stroke", "black")
    .style("stroke-width", "2px")
    .style("opacity", "1");
};

//  init function calls functions to draw map, scatterplot, linegraph
function initAll(error, msdata, ldata) {
  if (error) console.log("Error with data");

  // initialize map and scatterplot in 2000 on page load
  var selectedYear = d3.select("#slider1").attr("value");
  // var selectedVar = d3.select("#radio").attr("value");
  d3.select("#radio").on("input", function() { console.log(this.value) });

  // update text on year slider
  d3.select("#slider1-value").text(selectedYear);

  // keys: years, countrynames, variable keys (density / life)
  var yearKeys = Object.keys(msdata);
  var countryKeys = Object.keys(msdata[selectedYear]);
  var densityKeys = ["physicians", "nurses", "beds"];
  var lifeKeys = ["LEP", "LEM", "LEF"];

  // draw visualizations (default year 2000)
  drawWorldMap(msdata, selectedYear, countryKeys);
  drawLineGraph(ldata, yearKeys, densityKeys, lifeKeys);
  drawScatter(msdata, selectedYear, countryKeys);
};

// ---------------------------------------------------------------------------
// DATAMAPS WORLD MAP
// ---------------------------------------------------------------------------

function drawWorldMap(msdata, selectedYear, countryKeys) {

  // array to put fillkeys 
  var countrycolor = {}

  // color buckets (0.001 to make countries without value grey)
  var color = d3.scale.threshold()
    .domain([0.001, 1, 2, 3, 4, 5, 6, 7.1])
    .range(["gainsboro", "#d4f7ee", "#a8f0de", "#67e4c5", "#26d9ac", "#1fb28d", "#1b9878", "#136c56"])

  // coloring based on data values for each country
  countryKeys.forEach(function (key) {
    countrycolor[key] = {
      fillColor: color(msdata[selectedYear][key]["physicians"]),
      physicians: msdata[selectedYear][key]["physicians"]
    };
  });

  // get map div in html
  var map = new Datamap({
    element: document.getElementById('container0'),

    // usual projection (greenland enlarged, etc)
    projection: 'mercator',

    // countries colored based on data
    // quantize scale -> naar kijken!! d3.scale.quantize
    fills: {
      defaultFill: "gainsboro"},
    data: countrycolor,

    // configurations
    geographyConfig: {
      borderColor: "#bfbfbf",
      highlightFillColor: false,
      highlightBorderColor: '#a6a6a6',
      zoomOnClick: true,
      popupOnHover: true,

      // tooltip template - when data: show it; otherwise: just country name
      popupTemplate: function(geo, data) {
        if (data["physicians"]) {
          return '<div class="hoverinfo"><strong>' + geo.properties.name + 
              '</strong><br>' + "Physicians per 1000: " + '<strong>' 
              + data.physicians + '</strong>'
        }
        else {
          return '<div class="hoverinfo"><strong>' + geo.properties.name 
              +'</strong><br>'
        }
      }
    },
    done: function(datamap) {
      datamap.svg.selectAll('datamaps-subunit')
        .on('click', function (d) { console.log("poep") });
    }
  });
  
  // // on click: update linechart according to country
  // map.svg.selectAll('.datamaps-subunit')
  //   .on('click', function(d) {console.log(this)});
  
  // update map and slider label on imput
  d3.select("#slider1").on("input", function () {
    var selectedYear = +this.value;
    d3.select("#slider1-value").text(selectedYear);
    countryKeys.forEach(function (key) {
      countrycolor[key] = {
        fillColor: color(msdata[selectedYear][key]["physicians"]),
        physicians: msdata[selectedYear][key]["physicians"]
      };

      // Color the map according to color buckets
      map.updateChoropleth(countrycolor);
    });
  });
  
  // map dragging and zooming functionality
  map.svg.call(d3.behavior.zoom()
    .on("zoom", redraw));

  // redraw map upon dragging/zooming
  function redraw() {
    map.svg.selectAll("g")
      .attr("transform", "scale(" + d3.event.scale + ")" + "translate(" + d3.event.translate + ")");
  };
};

// ---------------------------------------------------------------------------
// MULTI LINE GRAPH
//  first version without map selection of country: line chart for Australia
// ---------------------------------------------------------------------------

function drawLineGraph (ldata, yearKeys, densityKeys, lifeKeys) {

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
  var svg = d3.select("#line").append("svg")
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
    for (var i = 0; i < 44; i++) {
      densityArray.push(+ldata["AUS"][density][i]);
    }
  });

  lifeKeys.forEach(function(life) {
    for (var j = 0; j < 44; j++) {
      lifeArray.push(+ldata["AUS"][life][j]);
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
      .text("GDP in moneyz");
    
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
      .attr("class", "lifelines")

  // draw lines
  densityLines.append("path")
      .attr("class", "densityline")
      .attr("fill", "none")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", "1")
      .attr("d", function(d) { return densityLine(ldata["AUS"][d]); })
      .style("stroke", function(d) { return color(d) });
  lifeLines.append("path")
      .attr("class", "lifeline")
      .attr("fill", "none")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", "1")
      .attr("d", function(d) { return lifeLine(ldata["AUS"][d]); })
      .style("stroke", function(d) { return color(d) });

  // // circles on data points
  // densityLines.selectAll('circle')
  //   .data(densityKeys)
  //   .enter().append('circle')
  //     .attr('class', 'circle')
  //     .attr('cx', function(d, i) { return x(yearArray[i]); })
  //     .attr('cy', function(d) { return y1(+d); })
  //     .attr('r', 3);
  
  // // cross hair functionality
  // var focus = svg.append("g")
  //     .style("display", "none");

  // // cross-hair functionality: data to left of mouse
  // var hairDate = d3.bisector(function(yearArray, i) { return yearArray[i]; }).left;

  // // append the circle at the intersection
  // focus.append("circle")
  //     .attr("class", "y")
  //     .style("fill", "none")
  //     .style("stroke", "blue")
  //     .attr("r", 4);

  // // append the rectangle to capture mouse
  // svg.append("rect")
  //     .attr("width", width)
  //     .attr("height", height)
  //     .style("fill", "none")
  //     .style("pointer-events", "all")
  //     .on("mouseover", function() { focus.style("display", null); })
  //     .on("mouseout", function() { focus.style("display", "none"); })
  //     .on("mousemove", mousemove);

  //   // cross-hair funcitonality
  // function mousemove() {
  //   var x0 = x.invert(d3.mouse(this)[0]),
  //     i = hairDate(yearArray, x0, 1),
  //     d0 = yearArray[i - 1],
  //     d1 = yearArray[i],
  //     d = x0 - d0.date > d1.date - x0 ? d1 : d0;
  // }

  // //   // mouse focus
  // //   focus.select("circle.y")
  // //     .attr("transform", "translate(" + x(yearArray) + "," + y(yearArray) + ")");

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

// ---------------------------------------------------------------------------
// SCATTERPLOT
// ---------------------------------------------------------------------------

// draw the scatterplot
function drawScatter(msdata, selectedYear, countryKeys) {

  // set height, width and margins
  var margin = {top: 100, right: 200, bottom: 20, left: 30},
    width = 750 - margin.left - margin.right,
    height = 435 - margin.top - margin.bottom;

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
      .attr("id", "scatter_svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); 

  // global in scatterplot: keep track of subselection of data in scatterplot
  var clicked = 0;
  var clickedData;

  // data arrays
  var physiciansArray = [], lepArray = [], gdpArray = [];

  // make values integers
  countryKeys.forEach(function(key) {
    physiciansArray.push(+msdata[selectedYear][key]["physicians"]);
    lepArray.push(+msdata[selectedYear][key]["LEP"]);
    gdpArray.push(+msdata[selectedYear][key]["GDP"]);
  });

  // scale dots based on GDP data
  var rscale = d3.scale.linear()
    .domain(d3.extent(gdpArray)).nice()
    .range([3,20]);

  // set axes division
  x.domain(d3.extent(physiciansArray)).nice();
  y.domain(d3.extent(lepArray)).nice();

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
  
  // create graph title
  svg.append("g")
      .attr("class", "title")
    .append("text")
      .attr("x", (width + margin.left + margin.right) * .032)
      .attr("y", - margin.top / 1.7)
      .attr("dx", ".71em")
      .attr("font-size", "20px")
      .style("text-anchor", "begin")
      .text("Relation between physician density and population life expectancy");  

  // create dots
  scatterDot = svg.selectAll(".dot")
      .data(countryKeys)
    .enter().append("circle")
      .attr("class", function(d) { return "dot " + d; })
      .attr("r", function(d) { return rscale(+msdata[selectedYear][d]["GDP"]); })
      .attr("cx", function(d) { return x(+msdata[selectedYear][d]["physicians"]); })
      .attr("cy", function(d) { return y(+msdata[selectedYear][d]["LEP"]); })
      .style("fill", color);
      // .style("fill", function(d) { return color(+msdata[selectedYear][d]); })

  // create legend with data selection functionality on click
  var legend = svg.selectAll(".legend")
      .data(countryKeys)
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(" + (width + margin.right - 30) + "," + i * 7 + ")"; })
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
