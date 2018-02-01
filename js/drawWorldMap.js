/* ---------------------------------------------------------------------------
drawWorldMap.js

Function that draws a world map using Datamaps plugin.
Coloring of the map according to data is calculated with functions. On-click,
on-hover, zoom, and drag functionality on countries and map.

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
    d3.select("#countryCode").text(selectedCountry);

    // update current selection text
    d3.select("#country-value").text(translations[selectedCountry]);

    // when the country clicked is in dataset
    if (selectedCountry in ldata) {
      // update linechart and title
      d3.select("#noDataText").style("display", "none");
      d3.selectAll(".linechart").remove();
      drawLineGraph(ldata, y2Key, selectedYear, selectedCountry, selectedVar, lineKeys, yearKeys, y1Keys, lifeKeys, translations);
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
    drawScatter(msdata, ldata, selectedYear, selectedVar, countryKeys, translations);
    d3.select(".linechart").remove();
    drawLineGraph(ldata, y2Key, selectedYear, selectedCountry, selectedVar, lineKeys, yearKeys, y1Keys, lifeKeys, translations);
      
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

/* ---------------------------------------------------------------------------
function calcColDomain(msdata, selectedVar, yearKeys, countryKeys): 
determine map coloring domain.
--------------------------------------------------------------------------- */
function calcColDomain(msdata, selectedVar, yearKeys, countryKeys) {

  // empty arrays to fill according to data
  countrycolor = {};
  varValues = [];
  extValues = [];
  colDomain = [];

  // get data for the selected country and variable in array
  yearKeys.forEach(function(year) {
    countryKeys.forEach(function(land) {
      varValues.push(+msdata[year][land][selectedVar]);
    });
  });

  // array to calculate extent of not-null data
  yearKeys.forEach(function(year) {
    countryKeys.forEach(function(land) {
      if (msdata[year][land][selectedVar] != 0 && msdata[year][land][selectedVar] != "") {
        extValues.push(+msdata[year][land][selectedVar]);
      }
    });
  });

  // determine coloring domain scale (7 color shades according to data maximum)
  var varExt = d3.extent(extValues);
  var varStep = (varExt[1] - varExt[0]) / 7;

  // countries with missing data ('null' values) must retain gainsboro gray color
  var coloring = varExt[0];

  // fill domain array
  for (var i = 0; i < 8; i++) {
    colDomain.push(roundValues(coloring, 1));
    coloring += varStep;
  };

  // return coloring domain according to data
  return colDomain;
};

/* ---------------------------------------------------------------------------
function calcColRange(selectedVar): 
determine map coloring range
--------------------------------------------------------------------------- */
function calcColRange(selectedVar) {

  // function returns color range variable
  var colrange;

  // physicians blue, nurses orange, beds green, LEP red, GDP purple
  if (selectedVar == "physicians") {
    colRange = ["gainsboro", "#d3e9f8", "#a8d2f0", "#7cbce9", "#51a5e1", "#258fda", "#1e72ae", "#165683"];
  } if (selectedVar == "nurses") {
    colRange = ["gainsboro", "#ffe4cc", "#ffc999", "#ffad66", "#ff9233", "#ff7700", "#cc5f00", "#994700"];
  } if (selectedVar == "beds") {
    colRange = ["gainsboro", "#d7f4d7", "#afe9af", "#87de87", "#5fd35f", "#37c837", "#2ca02c", "#217821"];
  } if (selectedVar == "LEP") {
    colRange = ["gainsboro", "#f7d4d4", "#efa9a9", "#e77e7e", "#df5353", "#d62728", "#ac2020", "#811818"];
  } if (selectedVar == "GDP") {
    colRange = ["gainsboro", "#e6dcef", "#cdb8e0", "#b395d0", "#9a71c1", "#814eb1", "#673e8e", "#4d2f6a"];
  };
  return colRange;
};

/* ---------------------------------------------------------------------------
function roundValues(value, precision): 
rounds values to 1 decimal place
--------------------------------------------------------------------------- */
function roundValues(value, precision) {
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
};
