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

// default values for initial page load
var selectedYear = "2000";
var selectedVar = "physicians"
var selectedCountry = "AUS";
// variables for linechart axes
var y1Keys = ["physicians", "nurses", "beds"]; // var lifeKeys = ["LEP", "LEM", "LEF"];
var y2Key = ["LEP"];
// variables for scatterplot axes and dotsize
var scatXVar = [selectedVar];
var scatYVar = ["LEM"];
var scatDotSize = ["GDP"];
// further globals
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

    // all lines low opacity
    d3.select("#line").selectAll(".y1line")
      .style("opacity", ".3")
      .style("stroke-width", "2px");
    d3.select("#line").selectAll(".y2line")
      .style("opacity", ".3")
      .style("stroke-width", "2px");

    // only selected lines high opacity, according to variable
    if (selectedVar == "LEP") {
      d3.select("#line").selectAll(".LEP")
      .style("opacity", "1")
      .style("stroke-width", "3px"); }
    else if (selectedVar == "physicians") {
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
    else if (selectedVar == "GDP") {
      d3.select("#line").selectAll(".GDP")
      .style("opacity", "1")
      .style("stroke-width", "3px"); }
  };


  // set initial graph titles
  d3.select("#maptitle-value").text(selectedVar);
  d3.select("#lineTitleY2-value").text(y2Key);
  d3.select("#scatterTitleX-value").text(scatXVar);
  d3.select("#scatterTitleY-value").text(scatYVar);

  // get initial slider value (year 2000) and update slider label
  var selectedYear = d3.select("#slider1").attr("value");
  d3.select("#slider1-value").text(selectedYear);

  // keys: years, countrynames, variable keys (density / life)
  var yearKeys = Object.keys(msdata);
  var countryKeys = Object.keys(msdata[selectedYear]);

  // Listen for radio button change and register value
  d3.selectAll(".radio").on("change", function() {
    selectedVar = d3.select(this).attr("value");

    // update map title and colors to selected variables
    d3.select("#maptitle-value").text(selectedVar);
    d3.select(".datamap").remove();
    drawWorldMap(msdata, selectedYear, selectedVar, countryKeys, ldata, selectedCountry, yearKeys, y1Keys, lifeKeys);

    // update linechart, scatterplot, title
    if (selectedVar == "GDP" || selectedVar == "LEP") {

      // linechart: update title with x-axis data
      d3.select("#lineTitleY2-value").text(selectedVar);

      // linechart: update axes and line highlighting
      if (y2Key[0] == selectedVar) {
        d3.select(".linechart").remove();
        drawLineGraph(ldata, y2Key, selectedCountry, selectedVar, yearKeys, y1Keys, lifeKeys);
      }
      else if (y2Key[0] != selectedVar) {
        d3.select(".linechart").remove();
        y2Key[0] = selectedVar;
        drawLineGraph(ldata, y2Key, selectedCountry, selectedVar, yearKeys, y1Keys, lifeKeys);
      };

      // scatterplot: update plot
      if (selectedVar == "LEP") {
        scatXVar = ["physicians"]; scatYVar = ["LEP"]; scatDotSize = ["GDP"];
        d3.select("#scatterTitleX-value").text(scatXVar);
        d3.select("#scatterTitleY-value").text(scatYVar);
        d3.select(".scatterchart").remove();
        drawScatter(msdata, selectedYear, selectedVar, countryKeys);
      }
      else if (selectedVar == "GDP") {
        scatXVar = ["physicians"]; scatYVar = ["GDP"]; scatDotSize = ["LEP"];
        d3.select("#scatterTitleX-value").text(scatXVar);
        d3.select("#scatterTitleY-value").text(scatYVar);
        d3.select(".scatterchart").remove();
        drawScatter(msdata, selectedYear, selectedVar, countryKeys);
      };
    }
    else if (selectedVar == "physicians" || selectedVar == "nurses" || selectedVar == "beds") {
      
      // linechart: update axes and line highlighting
      d3.select(".linechart").remove();
      drawLineGraph(ldata, y2Key, selectedCountry, selectedVar, yearKeys, y1Keys, lifeKeys);
      
      // scatterplot: update title and chart
      scatXVar = [selectedVar]; scatYVar = ["LEP"]; scatDotSize = ["GDP"];
      d3.select("#scatterTitleX-value").text(scatXVar);
      d3.select("#scatterTitleY-value").text(scatYVar);
      d3.select(".scatterchart").remove();
      drawScatter(msdata, selectedYear, selectedVar, countryKeys)
    };
  });

  // draw visualizations (default year 2000)
  drawWorldMap(msdata, selectedYear, selectedVar, countryKeys, ldata, selectedCountry, yearKeys, y1Keys, lifeKeys);
  drawLineGraph(ldata, y2Key, selectedCountry, selectedVar, yearKeys, y1Keys, lifeKeys);
  drawScatter(msdata, selectedYear, selectedVar, countryKeys);

  // but do not show line chart already -> first user must select country
  // d3.selectAll(".linechart").remove();
};
