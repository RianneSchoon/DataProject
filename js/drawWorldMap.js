/* ---------------------------------------------------------------------------
drawWorldMap.js
Function that draws a world map using Datamaps plugin.

Rianne Schoon, 10742794
--------------------------------------------------------------------------- */

function drawWorldMap(msdata, selectedYear, selectdVar, countryKeys, ldata, selectedCountry, yearKeys, y1Keys, lifeKeys) {

  /* ---------------------------------------------------------------------------
  function calcColDomain(selectedVar): 
  determine map coloring domain
  --------------------------------------------------------------------------- */
  function calcColDomain(selectedVar, yearKeys, countryKeys) {

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
      colDomain.push(Math.round(coloring));
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

    var colrange;
    // // physicians green, nurses red, beds blue, LEP orange, GDP purple
    // if (selectedVar == "physicians") {
    //   colRange = ["gainsboro", "#d7f4d7", "#afe9af", "#87de87", "#5fd35f", "#37c837", "#2ca02c", "#217821"];
    // } if (selectedVar == "nurses") {
    //   colRange = ["gainsboro", "#f7d4d4", "#efa9a9", "#e77e7e", "#df5353", "#d62728", "#ac2020", "#811818"];
    // } if (selectedVar == "beds") {
    //   colRange = ["gainsboro", "#d3e9f8", "#a8d2f0", "#7cbce9", "#51a5e1", "#258fda", "#1e72ae", "#165683"];
    // } if (selectedVar == "LEP") {
    //   colRange = ["gainsboro", "#ffe4cc", "#ffc999", "#ffad66", "#ff9233", "#ff7700", "#cc5f00", "#994700"];
    // } if (selectedVar == "GDP") {
    // colRange = ["gainsboro", "#e6dcef", "#cdb8e0", "#b395d0", "#9a71c1", "#814eb1", "#673e8e", "#4d2f6a"];
    // };
    // return colRange;

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
  function dotSelect(country): 
  data highlighting: clicking on map makes strokes dot in scatterplot black
  --------------------------------------------------------------------------- */
  function dotSelect (country) {
    d3.select("#scatter").selectAll(".dot")
      .style("stroke", "white")
      .style("opacity", ".3")
    d3.select("#scatter").select("." + country)
      .style("stroke", "black")
      .style("stroke-width", "2px")
      .style("opacity", "1");
  };

  // determine map coloring domain and range
  var colorDomain = calcColDomain(selectedVar, yearKeys, countryKeys);
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
        if (msdata[selectedYear]) {
          console.log(msdata[selectedYear][geo.properties.id][selectedVar]);
          return ['<div class="hoverinfo"><strong>' + geo.properties.name + 
              '</strong><br>' + selectedVar + " " + '<strong>' 
              + data.physicians + '</strong></div>'];
        }
        else {
          console.log(msdata[selectedYear]);
          return ['<div class="hoverinfo"><strong>' + geo.properties.name 
              +'</strong><br>' + "No data" + '</div>'];
        }
      }
    },

    done: function(map) {

    }
  });
  
  // on click: update linechart according to country
  map.svg.selectAll('.datamaps-subunit').on('click', function() {
    selectedCountry = d3.select(this).attr("class").slice(-3);
    if (selectedCountry in ldata) {
      d3.selectAll(".linechart").remove();
      drawLineGraph(ldata, y2Key, selectedCountry, yearKeys, y1Keys, lifeKeys);
      dotSelect(selectedCountry);
    }
    else {
      d3.selectAll(".densitylines").remove();
      d3.selectAll(".lifelines").remove();
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
    drawScatter(msdata, selectedYear, selectedVar, countryKeys);
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