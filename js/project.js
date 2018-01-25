/* ---------------------------------------------------------------------------
project.js
Source code to a webpage that shows supporting means of health care 
and their influence on life expectancy around the world.

Rianne Schoon, 10742794
--------------------------------------------------------------------------- */

// load all datasets before display
window.onload = function() {
  queue()
    .defer(d3.json, "data/mapscatterjson.json")
    .defer(d3.json, "data/linechartjson.json")
    .await(initAll);
};

// global variables
var selectedYear = "2000";
var selectedVar = "physicians"
var selectedCountry = "AUS";
var densityKeys = ["physicians", "nurses", "beds"];
// var lifeKeys = ["LEP", "LEM", "LEF"];
var lifeKeys = ["LEP"];
var countryKeys, yearKeys, msdata, ldata;

/* ---------------------------------------------------------------------------
function initAll(error, msdata, ldata): 
listens to html input elements (radiobuttons and slider); calls visualizations
--------------------------------------------------------------------------- */
//  init function calls functions to draw map, scatterplot, linegraph
function initAll(error, msdata, ldata) {
  if (error) console.log("Error with data");

  /* ---------------------------------------------------------------------------
  function lineSelect(selectedVar): 
  highlight line of variable selected in radiobuttons
  --------------------------------------------------------------------------- */
  function lineSelect(selectedVar) {
    console.log("lineselect");

    // all lines low opacity
    d3.select("#line").selectAll(".lifeline")
      .style("opacity", ".3")
      .style("stroke-width", "2px");
    d3.select("#line").selectAll(".densityline")
      .style("opacity", ".3")
      .style("stroke-width", "2px");

    // only selected lines high opacity, according to variable
    if (selectedVar == "physicians") {
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
    else if (selectedVar == "LEP") {
      d3.select("#line").selectAll(".LEP")
      .style("opacity", "1")
      .style("stroke-width", "3px"); }
  };

  // /* ---------------------------------------------------------------------------
  // function calcColDomain(selectedVar): 
  // determine map coloring domain
  // --------------------------------------------------------------------------- */
  // function calcColDomain(selectedVar, yearKeys, countryKeys) {

  //   // empty arrays to fill according to data
  //   countrycolor = {};
  //   varValues = [];
  //   colDomain = [];

  //   // get data for the selected country and variable in array
  //   yearKeys.forEach(function(year) {
  //     countryKeys.forEach(function(land) {
  //       varValues.push(+msdata[year][land][selectedVar]);
  //     });
  //   });

  //   // determine coloring domain scale (7 color shades according to data maximum)
  //   var varStep = d3.max(varValues) / 7;

  //   // countries with missing data ('null' values) must retain gainsboro gray color
  //   var coloring = 0.0001;

  //   // fill domain array
  //   for (var i = 0; i < 8; i++) {
  //     colDomain.push(coloring);
  //     coloring += varStep;
  //   };

  //   // return coloring domain according to data
  //   return colDomain;
  // };

  //  ---------------------------------------------------------------------------
  // function calcColRange(selectedVar): 
  // determine map coloring range
  // --------------------------------------------------------------------------- 
  // function calcColRange(selectedVar) {

  //   var colrange;
  //   // physicians green, nurses red, beds blue, LEP orange, GDP purple
  //   if (selectedVar == "physicians") {
  //     colRange = ["gainsboro", "#d7f4d7", "#afe9af", "#87de87", "#5fd35f", "#37c837", "#2ca02c", "#217821"];
  //   }
  //   if (selectedVar == "nurses") {
  //     colRange = ["gainsboro", "#f7d4d4", "#efa9a9", "#e77e7e", "#df5353", "#d62728", "#ac2020", "#811818"];
  //   }
  //   if (selectedVar == "beds") {
  //     colRange = ["gainsboro", "#d3e9f8", "#a8d2f0", "#7cbce9", "#51a5e1", "#258fda", "#1e72ae", "#165683"];
  //   }
  //   if (selectedVar == "LEP") {
  //     colRange = ["gainsboro", "#ffe4cc", "#ffc999", "#ffad66", "#ff9233", "#ff7700", "#cc5f00", "#994700"];
  //   }
  //   if (selectedVar == "GDP") {
  //   colRange = ["gainsboro", "#e6dcef", "#cdb8e0", "#b395d0", "#9a71c1", "#814eb1", "#673e8e", "#4d2f6a"];
  //   };
  //   return colRange;
  // };

  // get initial slider value (year 2000) and update label
  var selectedYear = d3.select("#slider1").attr("value");
  d3.select("#slider1-value").text(selectedYear);

  // keys: years, countrynames, variable keys (density / life)
  var yearKeys = Object.keys(msdata);
  console.log(msdata[selectedYear]);
  var countryKeys = Object.keys(msdata[selectedYear]);

  // // determine map coloring domain and range
  // var colorDomain = calcColDomain(selectedVar, yearKeys, countryKeys);
  // var colorRange = calcColRange(selectedVar);



  // get radio value on change to update map
  d3.selectAll(".radio").on("change", function() {
    selectedVar = d3.select(this).attr("value");
    d3.select(".datamap").remove();
    drawWorldMap(msdata, selectedYear, selectedVar, countryKeys, ldata, selectedCountry, yearKeys, densityKeys, lifeKeys);
    lineSelect(selectedVar);
  });


  // draw visualizations (default year 2000)
  drawWorldMap(msdata, selectedYear, selectedVar, countryKeys, ldata, selectedCountry, yearKeys, densityKeys, lifeKeys);
  drawLineGraph(ldata, selectedCountry, yearKeys, densityKeys, lifeKeys);
  drawScatter(msdata, selectedYear, countryKeys);

  // but do not show line chart already -> first user must select country
  d3.selectAll(".linechart").remove();
};
