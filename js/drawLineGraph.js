/* ---------------------------------------------------------------------------
drawLineGraph.js

Function that draws a multi line graph with two y-axes. 
Lines and axes update and highlight on map-click. The time selected by slider 
is shown as a vertical line. Hovering lines lets information pop-up in tooltip.

Rianne Schoon, 10742794
--------------------------------------------------------------------------- */

function drawLineGraph (ldata, y2Key, selectedYear, selectedCountry, selectedVar, lineKeys, yearKeys, y1Keys, lifeKeys, translations) {

  // set height, width and margins
  var margin = {top: 10, right: 180, bottom: 20, left: 30},
    width = 750 - margin.left - margin.right,
    height = 325 - margin.top - margin.bottom;

  // axes ranges
  var x = d3.time.scale().range([0, width]);
  var y1 = d3.scale.linear().range([height, 0]);
  var y2 = d3.scale.linear().range([height, 0]);
  // var line = d3.svg.line()
  //   .x(function(d) {return x(d.year); })
  //   .y(function(d) {return y(d.population); });

  // axes orientation
  var xAxis = d3.svg.axis().scale(x).orient("bottom");
  var y1Axis = d3.svg.axis().scale(y1).orient("left");
  var y2Axis = d3.svg.axis().scale(y2).orient("right");

  // enable lines to be colored
  var color = {"physicians": "#1f77b4", "nurses": "#ff7f0e", "beds": "#2ca02c", "LEP": "#d62728", "GDP": "#9467bd"};

  // append svg to html body
  var svg = d3.selectAll("#line").append("svg")
      .attr("class", "linechart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // // append line to svg
  // var lineSvg = svg.append("g");

  // arrays for d3 extent per axis
  var xArray = [], y1Array = [], y2Array = [];

  // data type translations for axes division (date objects / integers)
  yearKeys.forEach(function(year) {
    xArray.push(new Date(year));
  });
  y1Keys.forEach(function(density) {
    for (var i = 0; i < xArray.length; i++) {
      y1Array.push(+ldata[selectedCountry][density][i]);
    }
  });
  for (var j = 0; j < xArray.length; j++) {
    y2Array.push(+ldata[selectedCountry][y2Key][j]);
  }

  // set axes division
  x.domain(d3.extent(xArray));
  y1.domain(d3.extent(y1Array));
  y2.domain(d3.extent(y2Array));

  // create x-axis and title
  svg.append("g")
      .attr("class", "linexaxis")
      .attr("class", "axis")
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
      .attr("class", "liney1axis")
      .attr("class", "axis")
      .call(y1Axis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Health care (per 1000 of population)");

  // create y2-axis and title for LEP
  svg.append("g")
    .attr("class", "liney2axis")
    .attr("class", "axis")
    .attr("transform", "translate(" + width + " ,0)")
    .call(y2Axis);

  // variable title on y2 axis
  if (selectedVar == "GDP") {
    d3.select(".liney2axis")
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", -13)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Gross Domestic Product (USD");
  }
  else if (selectedVar == "LEP") {
    d3.select(".liney2axis")
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", -13)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Life expectancy (years)");
  }; 

  // vertical line showing year selected with slider
  var yearDate = new Date(String(selectedYear));
  svg.append("path")
      .attr("class", "timeLine")
      .style("stroke", "#999999")
      .style("stroke-width", 1);
  d3.select(".timeLine")
      .attr("d", function() {
        var d = "M" + x(yearDate) + "," + height;
        d += " " + x(yearDate) + "," + 0;
        return d;
      });

  // valuelines declarations
  var y1Line = d3.svg.line()
    .defined(function(d) { return d; })
    .x(function(d, i) { return x(xArray[i]) })
    .y(function(d) { return y1(+d) });
  var y2Line = d3.svg.line()
    .defined(function(d) { return d; })
    .x(function(d, i) { return x(xArray[i]) })
    .y(function(d) { return y2(+d) });  

  // create lines on svg for every variable
  var y1Lines = svg.selectAll(".y1lines")
    .data(y1Keys)
    .enter().append("g")
      .attr("class", "y1lines");
  var y2Lines = svg.selectAll(".y2lines")
    .data(y2Key)
    .enter().append("g")
      .attr("class", "y2lines");

  // draw lines
  y1Lines.append("path")
      .attr("class", function(d) { return "y1line " + d; })
      .attr("fill", "none")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", "2")
      .attr("d", function(d) { return y1Line(ldata[selectedCountry][d]); })
      .style("stroke", function(d) { return color[d]; });
  y2Lines.append("path")
      .attr("class", function(d) { return "y2line " + d; })
      .attr("fill", "none")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", "2")
      .attr("d", function(d) { return y2Line(ldata[selectedCountry][d]); })
      .style("stroke", function(d) { return color[d]; });

  // line labels
  svg.selectAll(".y1Labels")
      .data(y1Keys)
    .enter().append("text")
      .attr("class", function(d) { return "linelabel " + d; })
      .attr("transform", function(d, i) { return "translate(" + (width + 55) + "," + i * 25 + ")"; })
      .attr("dy", ".35em")
      .attr("text-anchor", "start")
      .style("fill", function(d) { return color[d]; })
      .text(function(d) { return translations[d]; });
  svg.selectAll(".y2Labels")
      .data(y2Key)
    .enter().append("text")
      .attr("class", function(d) { return "linelabel " + d; })
      .attr("transform", function(d, i) {; return "translate(" + (width + 55) + "," + 8 + i * 25 + ")"; })
      .attr("dy", ".35em")
      .attr("text-anchor", "start")
      .style("fill", function(d) { return color[d]; })
      .text(function(d) { return translations[d]; });

  // highlight variable line according to radio button selection
  lineSelect(selectedVar);
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





//   // tooltip info box
//   tipBox = svg.append('rect')
//     .attr('width', width)
//     .attr('height', height)
//     .attr('opacity', 0)
//     .on('mousemove', drawTooltip)
//     .on('mouseout', removeTooltip);

//   // hide tooltip
//   function removeTooltip() {
//     if (tooltip) tooltip.style('display', 'none');
//     if (tooltipLine) tooltipLine.attr('stroke', 'none');
//   }

//   // draw tooltip
//   function drawTooltip() {

//     var year = Math.floor((x.invert(d3.mouse(tipBox.node())[0]) + 5) / 10) * 10;
//     console.log(((x.invert(d3.mouse(tipBox.node())[0]) + 5) / 10) * 10);
    
//     states.sort((a, b) => {
//       return b.history.find(h => h.year == year).population - a.history.find(h => h.year == year).population;
//   })  
    
//   tooltipLine.attr('stroke', 'black')
//     .attr('x1', x(year))
//     .attr('x2', x(year))
//     .attr('y1', 0)
//     .attr('y2', height);
  
//   tooltip.html(year)
//     .style('display', 'block')
//     .style('left', d3.event.pageX + 20)
//     .style('top', d3.event.pageY - 20)
//     .selectAll()
//     .data(states).enter()
//     .append('div')
//     .style('color', d => d.color)
//     .html(d => d.name + ': ' + d.history.find(h => h.year == year).population);
// }






  // // clicking line to see where the axes light up
  // d3.selectAll('.y1line').on('click', function() {
  //   console.log("click");
  //   console.log(d3.select(this).attr("class").slice(7));

  //   // update current selection text
  //   d3.select("#country-value").text(translations[selectedCountry]);
  // });





    // var mouseG = svg.append("g")
    //   .attr("class", "mouse-over-effects");

    // var lines = document.getElementsByClassName('line');

    // var mousePerLine = mouseG.selectAll('.mouse-per-line')
    //   .data(y1Keys)
    //   .enter()
    //   .append("g")
    //   .attr("class", "mouse-per-line");

    // mousePerLine.append("circle")
    //   .attr("r", 7)
    //   .style("stroke", function(d) {console.log(d); return color[d]; })
    //   .style("fill", "none")
    //   .style("stroke-width", "1px")
    //   .style("opacity", "0");

    // mousePerLine.append("text")
    //   .attr("transform", "translate(10,3)");

    // mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
    //   .attr('width', width) // can't catch mouse events on a g element
    //   .attr('height', height)
    //   .attr('fill', 'none')
    //   .attr('pointer-events', 'all')
    //   .on('mouseout', function() { // on mouse out hide line, circles and text
    //     d3.selectAll(".mouse-per-line circle")
    //       .style("opacity", "0");
    //     d3.selectAll(".mouse-per-line text")
    //       .style("opacity", "0");
    //   })
    //   .on('mouseover', function() { // on mouse in show line, circles and text
    //     d3.selectAll(".mouse-per-line circle")
    //       .style("opacity", "1");
    //     d3.selectAll(".mouse-per-line text")
    //       .style("opacity", "1");
    //   })
    //   .on('mousemove', function() { // mouse moving over canvas
    //     var mouse = d3.mouse(this);
    //     d3.select(".mouse-line")
    //       .attr("d", function() {
    //         var d = "M" + mouse[0] + "," + height;
    //         d += " " + mouse[0] + "," + 0;
    //         return d;
    //       });

    //     d3.selectAll(".mouse-per-line")
    //       .attr("transform", function(d, i) {
    //         console.log(width/mouse[0])
    //         var xDate = x.invert(mouse[0]),
    //             bisect = d3.bisector(function(d) { console.log(d); return d; }).right;
    //             idx = bisect(d.values, xDate);
            
    //         var beginning = 0,
    //             end = lines[i].getTotalLength(),
    //             target = null;

    //         while (true){
    //           target = Math.floor((beginning + end) / 2);
    //           pos = lines[i].getPointAtLength(target);
    //           if ((target === end || target === beginning) && pos.x !== mouse[0]) {
    //               break;
    //           }
    //           if (pos.x > mouse[0])      end = target;
    //           else if (pos.x < mouse[0]) beginning = target;
    //           else break; //position found
    //         }
            
    //         d3.select(this).select('text')
    //           .text(y.invert(pos.y).toFixed(2));
              
    //         return "translate(" + mouse[0] + "," + pos.y +")";
    //       });
    //   });






  // // tooltip functionality
  // var tooltip_l = d3.select(".linechart").append("div").attr("class", "tooltip lct hidden");

  // // offsets for tooltips
  // var offsetL = document.getElementById('line').offsetLeft + 50;
  // var offsetT = document.getElementById('line').offsetTop + 40;

  // console.log(offsetL, offsetT)

  // hier?

  // // tooltips appear when mouse is over line - and follow mouse movements
  // y1Lines
  //   .on("mouseover", function(d, i) {
  //     console.log("movementtttt");

  //     // tooltip visible centered on line when mouse moves over
  //     var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); });
  //     console.log((mouse[0] + offsetL));
  //     floepje = (mouse[0] + offsetL);
  //     console.log(floepje);
  //     tooltip_l.classed("hidden", false)
  //       .style("x", 20)
  //       .style("y", 20)
  //       .attr("style", "left:" + floepje + "px;top:" + (mouse[1] + offsetT)+"px")
  //       .html("<strong>Country:</strong> <span style='color:midnightblue'>" + selectedCountry + "</span>" + "<br>" +
  //         "<strong>variable:</strong> <span style='color:midnightblue'>" + translations[selectedVar] + "</span>");
  //   })

  // // when mouse moves away, tooltip disappears
  // .on("mouseout",  function(d, i) {
  //   tooltip_l.classed("hidden", true);
  // });






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
