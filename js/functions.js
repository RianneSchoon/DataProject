/* ---------------------------------------------------------------------------
functions.js
Helper file with functions for that ensure intaractivity and/or selection of 
data across visualizations. These functions may be called in the main script
or in the drawVisuzalization() functions.

Rianne Schoon, 10742794
--------------------------------------------------------------------------- */

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

/* ---------------------------------------------------------------------------
function lineSelect(selectedVar): 
highlight line and of variable selected in radiobuttons
--------------------------------------------------------------------------- */
function lineSelect(selectedVar) {

  // all lines and legend elements low opacity
  d3.select("#line").selectAll(".y1line")
    .style("opacity", ".3")
    .style("stroke-width", "2px");
  d3.select("#line").selectAll(".y2line")
    .style("opacity", ".3")
    .style("stroke-width", "2px");
  d3.selectAll(".linelabel")
    .style("opacity", ".3")
    .style("color", "purple");

  // only selected lines high opacity, according to variable
  if (selectedVar == "LEP") {
    d3.select("#line").selectAll(".LEP")
      .style("opacity", "1")
      .style("stroke-width", "3px")
    d3.select(".linelabel").selectAll(".LEP")
      .style("opacity", "1")
      .style("font-weight", "bold"); }
  else if (selectedVar == "physicians") {
    d3.select("#line").selectAll(".physicians")
      .style("opacity", "1")
      .style("stroke-width", "3px")
    d3.select(".linelabel").selectAll(".physicians")
      .style("opacity", "1")
      .style("font-weight", "bold"); }
  else if (selectedVar == "nurses") {
    d3.select("#line").selectAll(".nurses")
      .style("opacity", "1")
      .style("stroke-width", "3px")
    d3.select(".linelabel").selectAll(".nurses")
      .style("opacity", "1")
      .style("font-weight", "bold"); }
  else if (selectedVar == "beds") {
    d3.select("#line").selectAll(".beds")
      .style("opacity", "1")
      .style("stroke-width", "3px")
    d3.select(".linelabel").selectAll(".beds")
      .style("opacity", "1")
      .style("font-weight", "bold"); }
  else if (selectedVar == "GDP") {
    d3.select("#line").selectAll(".GDP")
      .style("opacity", "1")
      .style("stroke-width", "3px")
    d3.select(".linelabel").selectAll(".GDP")
      .style("opacity", "1")
      .style("font-weight", "bold"); }
};


// {":AUS": "Australia", "AUT": "Austria", "BEL": "Belgium", "BRA": "Brazil", "CAN": "Canada", "CHE": "Switzerland", "CHL": "Chile", "CHN": "China", "CRI": "Costa Rica", "CZE": "Czechia", "DEU": "Germany", "DNK": "Denmark", "ESP": "Spain", "EST": "Estonia", "FIN": "Finland", "FRA": "France", "GBR": "United Kingdom", "GRC": "Greece", "HUN": "Hungary", "IDN": "Indonesia", "IND": "India", "IRL": "Ireland", "ISL": "Iceland", "ISR": "Israel", "ITA": "Italy", "JPN": "Japan", "KOR": "Republic of Korea", "LTU": "Lithuania", "LUX": "Luxembourg", "LVA": "Latvia", "MEX": "Mexico", "NLD": "Netherlands", "NOR": "Norway", "NZL": "New Zealand", "POL": "Poland", "PRI": "Puerto Rico", "PRT": "Portugal", "RUS": "Russian Federation", "SVK": "Slovakia", "SVN": "Slovenia", "SWE": "Sweden", "TUR": "Turkey", "USA": "United States of America", "ZAF": "South Africa", "LEP": "Life expectancy population", "LEF": "Life ecpectancy females", "LEM": "Life expectancy males", "physicians": "Physicians per 1000 of population", "nurses": "Nurses per 1000 of population", "beds": "Hospital beds per 1000 of population"}
