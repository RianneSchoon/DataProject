/* ----------------------------------------------------------------------------
linked.js
Source code to a webpage that shows two linked visualizations.

Rianne Schoon, 10742794

Sources and credits:
- map: http://techslides.com/demos/d3/worldmap-template.html
- scatterplot from week 4: https://bl.ocks.org/mbostock/3887118
---------------------------------------------------------------------------- */

// load all datasets before display
window.onload = function() {
  queue()
    .defer(d3.json, "data/world-topo-min.json")
    .defer(d3.json, "murderdata.json")
    .defer(d3.json, "dataWeek4.json")
    .await(initAll);
  };

  // data highlighting in scatterplot via clicking on map
  function mapSelect (country) {
    // undo previous selection -> all dots stroked with white again
    d3.select("#scatter").selectAll(".dot").style("stroke", "white").style("opacity", ".3")
    // currently selected class (country name without spaces) gets black stroke
    d3.select("#scatter").select("." + country.replace(/\s/g, '')).style("stroke", "black").style("stroke-width", "2px").style("opacity", "1");

  };

//  init function calls functions to draw map and scatterplot
function initAll(error, world, murderings, happiness) {
  if (error) console.log("Error with data");

  // store country properties
  var countries = topojson.feature(world, world.objects.countries).features;

  // draw map
  drawWorldMap(countries, murderings);

  // draw scatterplot
  drawScatter(happiness);
}

// draw the countries on the map
function drawWorldMap (countries, murderRate) {
  // map zoom functionality
  d3.select(window).on("resize", throttle);

  // map zoom functionality
  var zoom = d3.behavior.zoom()
      .scaleExtent([1, 9])
      .on("zoom", move);

  // set height and width
  var width = document.getElementById('container').offsetWidth,
      height = width / 1.8;

  // map variables
  var topo, projection, path, svg, g;

  // map and scatterplot: enabling tooltip functionality
  var tooltip = d3.select("#container").append("div").attr("class", "tooltip hidden");

  // map dimensions setup
  function setupMap (width,height) {
    projection = d3.geo.mercator()
      .translate([(width/2), (height/2)])
      .scale( width / 2 / Math.PI);

    // to draw countries
    path = d3.geo.path().projection(projection);

    // map can be zoomed and clicked everywhere
    svg = d3.select("#container").append("svg")
        .attr("width", width)
        .attr("height", height)
        .call(zoom)
        .append("g");
    g = svg.append("g");

    // draw countries on map
    drawTopo(countries);
  }

  // call the setup function so that the map can be drawn
  setupMap(width,height);

  // draw countries on map
  function drawTopo(countries) {

    //  draw equator
    g.append("path")
     .datum({type: "LineString", coordinates: [[-180, 0], [-90, 0], [0, 0], [90, 0], [180, 0]]})
     .attr("class", "equator")
     .attr("d", path);

    // each country has own g element
    var country = g.selectAll(".country").data(countries);

    // each country on g element on the map
    country.enter().insert("path")
        // class is country name
        .attr("class", function(d, i) { return "country" + " " + d.properties.name; })
        .attr("d", path)
        .attr("id", function(d,i) { return d.id; })
        .attr("title", function(d, i) { return d.properties.name; })
        .on("click", function(d) { mapSelect(d.properties.name); })
        // TO DO: fill color according to murderdata (chloropleth)
        .style("fill", function(d, i) { return d.properties.color; });

    // offsets for tooltips
    var offsetL = document.getElementById('container').offsetLeft + 20;
    var offsetT = document.getElementById('container').offsetTop + 10;

    // tooltips appear when mouse is over country - and follow mouse movements
    country
      .on("mousemove", function(d, i) {

        // mouse place on the map
        var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); });

        // tooltip is visible when mouse moves on country
        tooltip.classed("hidden", false)
          // tooltip placement
          .attr("style", "left:" + (mouse[0] + offsetL) + "px;top:" + (mouse[1] + offsetT)+"px")
          // .html(d.properties.name + murderRate[d.properties.name]);
          .html("<strong>Country:</strong> <span style='color:midnightblue'>" + d.properties.name + "</span>" + "<br>" +
            "<strong>Murders:</strong> <span style='color:midnightblue'>" + murderRate[d.properties.name] + "</span>");
      })

      // when mouse moves away, tooltip disappears
      .on("mouseout",  function(d, i) {
        tooltip.classed("hidden", true);
      })
  }

  // when user changes map on page, redraw it
  function redrawMap() {

    console.log("redrawMap aangeroepen!");

    width = document.getElementById('container').offsetWidth;
    height = width / 2;
    d3.select('svg').remove();
    setupMap(width,height);
    drawTopo(countries);
  }

  // update map scale when user zooms map
  function move() {

    // 
    var t = d3.event.translate;
    var s = d3.event.scale; 
    zscale = s;
    var h = height/4;

    // 
    t[0] = Math.min(
      (width/height)  * (s - 1), 
      Math.max( width * (1 - s), t[0] )
    );

    t[1] = Math.min(
      h * (s - 1) + h * s, 
      Math.max(height  * (1 - s) - h * s, t[1])
    );

    zoom.translate(t);
    g.attr("transform", "translate(" + t + ")scale(" + s + ")");
    d3.selectAll(".country").style("stroke-width", 1.5 / s);
  }

  // when map is moved, update
  var throttleTimer = 0
  function throttle() {
      window.clearTimeout(throttleTimer);
        throttleTimer = window.setTimeout(function() {
          redrawMap();
        }, 200);
  }
}

// draw the scatterplot
function drawScatter(happiness) {

  // set height, width and margins
  var margin = {top: 100, right: 200, bottom: 20, left: 30},
    width = 1000 - margin.left - margin.right,
    height = 580 - margin.top - margin.bottom;

  // scatterplot x-axis range
  var x = d3.scale.linear()
      .range([0, width]);

  // scatterplot y-axis range
  var y = d3.scale.linear()
      .range([height, 0]);

  // enable scatterplot dots to be colored
  var color = d3.scale.category10();

  // scatterplot x-axis orientation
  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  // scatterplot y-axis orientation
  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  // append scatterplot svg to html body
  var svg = d3.select("#scatter").append("svg")
      .attr("id", "scatter_svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); 

  // global: keep track of subselection of data in scatterplot
  var clicked = 0;
  var clickedData;

  // convert data from string (as in json) to integer (for display purposes)
  happiness.forEach(function(d) {
    d.happyLifeYears = +d.happyLifeYears;
    d.AvLifeExp = +d.AvLifeExp;
    d.GDPCapita = +d.GDPCapita;
  });

  // scale dots based on data
  var rscale = d3.scale.linear()
  .domain(d3.extent(happiness, function(d) { return d.GDPCapita; })).nice()
  .range([5,22]);

  // set axes division
  x.domain(d3.extent(happiness, function(d) { return d.happyLifeYears; })).nice();
  y.domain(d3.extent(happiness, function(d) { return d.AvLifeExp; })).nice();

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
      .text("Happy life years");

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
      .text("Average life expectancy (years)");
  
  // create graph title
  svg.append("g")
      .attr("class", "title")
    .append("text")
      .attr("x", (width + margin.left + margin.right) * .032)
      .attr("y", - margin.top / 1.7)
      .attr("dx", ".71em")
      .attr("font-size", "20px")
      .style("text-anchor", "begin")
      .text("Happy life years and average life expectancy related to world region and Gross Domestic Product");  

  // create dots
  scatterDot = svg.selectAll(".dot")
      .data(happiness)
    .enter().append("circle")
      .attr("class", function(d) { return "dot " + d.Region.replace(/\s/g, '') + " " + d.Country.replace(/\s/g, ''); })
      .attr("r", function(d) { return rscale(d.GDPCapita); })
      .attr("cx", function(d) { return x(d.happyLifeYears); })
      .attr("cy", function(d) { return y(d.AvLifeExp); })
      .style("fill", function(d) { return color(d.Region); })

  // create legend
  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(" + (width + margin.right - 30) + "," + i * 25 + ")"; })
      // legend data selection functionality
      .on('click', function(region) { return legendSelect(region); });

  // legend colored rectangles
  legend.append("rect")
      .attr("class", function(d) { return "dot " + d.replace(/\s/g, ''); })
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  // legend text
  legend.append("text")
      .attr("x", -5)
      .attr("y", 8)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
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
    .on("mouseover", function(d, i) {

      var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); });
      console.log(mouse)
      // tooltip is visible when mouse moves on country
      tooltip_s.classed("hidden", false)
        // tooltip placement
        // .style("x", 20)
        // .style("y", 20)
        .attr("style", "left:" + (mouse[0] + offsetL) + "px;top:" + (mouse[1] + offsetT)+"px")
        // .html(d.properties.name + murderRate[d.properties.name]);
        .html("<strong>Country:</strong> <span style='color:midnightblue'>" + d.Country + "</span>" + "<br>" +
          "<strong>GDP:</strong> <span style='color:midnightblue'>" + d.GDPCapita + "</span>");
    })

    // when mouse moves away, tooltip disappears
    .on("mouseout",  function(d, i) {
      tooltip_s.classed("hidden", true);
    })
};
