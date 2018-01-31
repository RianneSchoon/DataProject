/* ---------------------------------------------------------------------------
drawWorldMap.js
Function that draws a world map using Datamaps plugin.

Rianne Schoon, 10742794
--------------------------------------------------------------------------- */

function drawWorldMap(msdata, selectedYear, selectdVar, countryKeys, ldata, selectedCountry, yearKeys, y1Keys, lifeKeys, translations) {

  // determine map coloring domain and range
  var colorDomain = calcColDomain(msdata, selectedVar, yearKeys, countryKeys);
  var colorRange = calcColRange(selectedVar);

  // map coloring - domain according to data
  var color = d3.scale.threshold()
    .domain(colDomain)
    .range(colRange);

  // coloring dictionary for datamap
  countryKeys.forEach(function (key) {
    countrycolor[key] = {
      fillColor: color(msdata[selectedYear][key][selectedVar]),
      variable: msdata[selectedYear][key][selectedVar]
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
        if (msdata[selectedYear][geo.id] != undefined && msdata[selectedYear][geo.id][selectedVar] != "") {
          return ['<div class="hoverinfo"><strong>' + geo.properties.name + 
              '</strong><br>' + selectedVar + " " + '<strong>' 
              + msdata[selectedYear][geo.id][selectedVar] + '</strong></div>'];
        }
        else {
          return ['<div class="hoverinfo"><strong>' + geo.properties.name 
              +'</strong><br>' + "No data" + '</div>'];
        }
      }
    }
  });
  
  // clicking country in map updates linechart and scatterplot
  map.svg.selectAll('.datamaps-subunit').on('click', function() {
    selectedCountry = d3.select(this).attr("class").slice(-3);

    // update current selection text
    d3.select("#country-value").text(translations[selectedCountry]);

    // when the country clicked is in dataset
    if (selectedCountry in ldata) {
      // update linechart and title
      d3.select("#noDataText").style("display", "none");
      d3.selectAll(".linechart").remove();
      drawLineGraph(ldata, y2Key, selectedCountry, selectedVar, yearKeys, y1Keys, lifeKeys);
      d3.select("#lineTitleY2-value").text(translations[selectedVar]);
      // highlight country dot in scatterplot
      dotSelect(selectedCountry);
    }
    // when there is no data, display text saying no data, unselect all dots
    else {
      d3.selectAll(".linechart").remove();
      d3.select("#noDataText").style("display", "inline");
      d3.select("#noDataText-value").text("No data available for " + translations[selectedCountry]);
      d3.select("#scatter").selectAll(".dot").style("stroke", "white").style("opacity", ".3")
    }
  });

  // on sliderinput: update map colors, sliderlabel, scatterplot
  d3.select("#slider1").on("input", function () {
    var selectedYear = +this.value;
    d3.select("#slider1-value").text(selectedYear);
    countryKeys.forEach(function (key) {
      countrycolor[key] = {
        fillColor: color(msdata[selectedYear][key][selectedVar]),
        variable: msdata[selectedYear][key][selectedVar]
      };
      map.updateChoropleth(countrycolor);
    });
    d3.selectAll(".scatterchart").remove();
    drawScatter(msdata, ldata, selectedYear, selectedVar, countryKeys);
  });
  
  // map dragging and zooming functionality
  map.svg.call(d3.behavior.zoom()
    .on("zoom", redraw));

  // redraw map upon dragging/zooming
  function redraw() {
    map.svg.selectAll('.datamaps-subunit')
      .attr("transform", "scale(" + d3.event.scale + ")" + "translate(" + d3.event.translate + ")");
  };

  // create legend
  var legend = map.svg.selectAll(".maplegend")
      .data(countryKeys)
    .enter().append("g")
      .attr("class", "maplegend")
      .attr("transform", function(d, i) { return "translate(" + (15) + "," + (240 + i * 18) + ")"; })

  // legend colored rectangles
  legend.append("rect")
      .data(colDomain)
      .attr("class", function(d, i) { return "maplegendsquare " + d; })
      .attr("width", 15)
      .attr("height", 15)
      .style("fill", color);

  // legend text
  legend.append("text")
      .data(colDomain)
      .attr("class", "maplegendtext ")
      .attr("x", 20)
      .attr("y", 8)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .style("font-size", "12px")
      .text(function(d) { return d});
};
