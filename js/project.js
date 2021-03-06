/* ---------------------------------------------------------------------------
project.js

Source code to a webpage that shows supporting means of health care 
and their influence on life expectancy around the world.

In this script, data is loaded and the visualizations are initiated with the 
function "initAll". The variables declared in this file are global. The "draw~"
functions call the visualizations. In "project,js" input on the time slider 
and radiobuttons is listened, and visualizations updated accordingly.

Rianne Schoon, 10742794
--------------------------------------------------------------------------- */

// load all datasets before display
window.onload = function() {
  queue()
    .defer(d3.json, "data/mapscatterjson.json")
    .defer(d3.json, "data/linechartjson.json")
    .defer(d3.json, "data/variabletranslater.json")
    .await(initAll);
};

// default values for initial page load
var selectedYear = "2000";
var selectedVar = "physicians"
var selectedCountry = "CAN";
// variables for linechart axes
var y1Keys = ["physicians", "nurses", "beds"]; // var lifeKeys = ["LEP", "LEM", "LEF"];
var y2Key = ["LEP"];
var lineKeys = ["physicians", "nurses", "beds", "LEP", "GDP"]
// variables for scatterplot axes and dotsize
var scatXVar = [selectedVar];
var scatYVar = ["LEP"];
var scatDotSize = ["GDP"];
// further globals
var lifeKeys = ["LEP"];
var countryKeys, yearKeys, msdata, ldata;

/* ---------------------------------------------------------------------------
function initAll(error, msdata, ldata): 
listens to html input elements (radiobuttons and slider); calls visualizations
--------------------------------------------------------------------------- */
function initAll(error, msdata, ldata, translations) {
  if (error) console.log("Error with data");

  // set initial graph titles
  d3.select("#maptitle-value").text(translations[selectedVar]);
  d3.select("#country-value").text(translations[selectedCountry]);
  d3.select("#lineTitleY2-value").text(translations[y2Key]);
  d3.select("#scatterTitleX-value").text(translations[scatXVar]);
  d3.select("#scatterTitleY-value").text(translations[scatYVar]);
  d3.select("#noDataText").style("display", "none");

  // get initial slider value (year 2000) and update slider label
  var selectedYear = d3.select("#slider1").attr("value");
  d3.select("#slider1-value").text(selectedYear);

  // keys: years, countrynames, variable keys (health care / life)
  var yearKeys = Object.keys(msdata);
  var countryKeys = Object.keys(msdata[selectedYear]);

  // Listen for radio button change and register value
  d3.selectAll(".radioform").on("change", function() {
    selectedVar = d3.select(this).attr("value");

    // update map title and colors to selected variables
    d3.select("#maptitle-value").text(translations[selectedVar]);
    d3.select(".datamap").remove();
    drawWorldMap(msdata, selectedYear, selectedVar, countryKeys, ldata, 
      selectedCountry, yearKeys, y1Keys, lifeKeys, translations);
    selectedCountry = d3.select("#countryCode").text();
    
    // update linechart, scatterplot, title
    if (selectedVar == "GDP" || selectedVar == "LEP") {

      // linechart: update title with x-axis data
      d3.select("#lineTitleY2-value").text(translations[selectedVar]);

      // linechart: update axes and line highlighting
      if (y2Key[0] == selectedVar) {
        d3.select(".linechart").remove();
        drawLineGraph(ldata, y2Key, selectedYear, selectedCountry, selectedVar, lineKeys, 
          yearKeys, y1Keys, lifeKeys, translations);
      }
      else if (y2Key[0] != selectedVar) {
        d3.select(".linechart").remove();
        y2Key[0] = selectedVar;
        drawLineGraph(ldata, y2Key, selectedYear, selectedCountry, selectedVar, lineKeys, 
          yearKeys, y1Keys, lifeKeys, translations);
      };

      // scatterplot: update plot
      if (selectedVar == "LEP") {
        scatXVar = ["physicians"]; scatYVar = ["LEP"]; scatDotSize = ["GDP"];
        d3.select("#scatterTitleX-value").text(translations[scatXVar]);
        d3.select("#scatterTitleY-value").text(translations[scatYVar]);
        d3.select(".scatterchart").remove();
        drawScatter(msdata, ldata, selectedYear, selectedVar, countryKeys, translations);
      }
      else if (selectedVar == "GDP") {
        scatXVar = ["physicians"]; scatYVar = ["GDP"]; scatDotSize = ["LEP"];
        d3.select("#scatterTitleX-value").text(translations[scatXVar]);
        d3.select("#scatterTitleY-value").text(translations[scatYVar]);
        d3.select(".scatterchart").remove();
        drawScatter(msdata, ldata, selectedYear, selectedVar, countryKeys, translations);
      };
    }
    else if (selectedVar == "physicians" || selectedVar == "nurses" || selectedVar == "beds") {
      
      // linechart: update axes and line highlighting
      d3.select(".linechart").remove();
      drawLineGraph(ldata, y2Key, selectedYear, selectedCountry, selectedVar, lineKeys, yearKeys, y1Keys, lifeKeys, translations);
      
      // scatterplot: update title and chart
      scatXVar = [selectedVar]; scatYVar = ["LEP"]; scatDotSize = ["GDP"];
      d3.select("#scatterTitleX-value").text(translations[scatXVar]);
      d3.select("#scatterTitleY-value").text(translations[scatYVar]);
      d3.select(".scatterchart").remove();
      drawScatter(msdata, ldata, selectedYear, selectedVar, countryKeys, translations)
    };
  });

  // draw visualizations (default year 2000)
  drawWorldMap(msdata, selectedYear, selectedVar, countryKeys, ldata, selectedCountry, yearKeys, y1Keys, lifeKeys, translations);
  drawLineGraph(ldata, y2Key, selectedYear, selectedCountry, selectedVar, lineKeys, yearKeys, y1Keys, lifeKeys, translations);
  drawScatter(msdata, ldata, selectedYear, selectedVar, countryKeys, translations);

  // but do not show line chart already -> first user must select country
  // d3.selectAll(".linechart").remove();
};
