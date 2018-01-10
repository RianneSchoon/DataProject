# Data Processing - Programming Project Proposal

Do you want to live forever? When asked, most people will answer affirmatively. Unfortunately though, even if we are not afflicted by accidents or crimes, we would still have to live to eternity through disease, infections, and eventually wear and tear due to old age. Nonetheless, we still try to prolong our lives as much as possible. The success of this endeavor varies greatly. Let us explore some possible supporting means and their influence on life expectancy across the world!

### Problem statement
we can wonder whether reaching old age is an achievement of operational interventions by modern medicine, or something else. Maybe just receiving aid, as given by nurses or provided by a hospital, is important. Or, perhaps, having access to enough food and good housing is important, for which money is needed. Since this is not known by many poeple, this visualization offers a hand!

### Solution
This project aims to let a user explore the effectiveness of different aid on the life expextancy of people. The website offers information about the above mentioned types of aid and allows the user to select, adjust, and test the questions raised. The visualizations provide an overview of the aid that countries around the world provide their people with. For each country, the development of this aid can be studied over time. Also, several types of aid or their effect on life expectancy can be correlated, with the user selecting which correlation they want to investigate.

## General layout of the project

### Visualisations:
* **Map of the world** depicting three types of aid (physician density, nurse density, hospital bed density) and life expectancy. The user can select which variable they want to see coloured in the map (radiobutton). Countries can be clicked to see specific info in the line graph. Tooltips popup on hover to show country name and variable value.
* **Multiple lines graph** per country that shows the three types of aid (y1-axis) and life expectancy (y2-axis) in time. Legend is checkbox to make one of the variables pop-out (opacity). Lines can be clicked to see correlation to life expectancy in the scatterplot.
* **Scatterplot** that shows the relation between the variable clicked in the line chart and life expectancy, for all countries. In this specific after-line-click-case, the size of the dots represents Gross Domestic Product, and the color of the dots differentiates males and females (since females have a higher average life expectancy). But furthermore, the scatterplot can be customized by the user: every variable can be plotted against every other, both on the axes and in dot size and in the color.

### Visualisation interactivity and other interactive elements:
* When clicking a country on the map, the multiline graph is updated according to that country.
* When clicking a country on the map, this country pops up in the scatterplot. All different time points of that map-clicked-country will become visible in the scatterplot, with the 'current' time with the highest opacity.
* Different time points can be selected with a slider - applies to map and scatterplot (line chart already has time on the axis).
* Checkbox of map variables (physicians, nurses, hospital beds, life expectancy, GDP).
* Checkbox of scatterplot variables (physicians, nurses, hospital beds, life expectancy, GDP) and where to display that variable (x-axis, y-axis, dotsize, color).

### Sketches:
![](doc/plaatjejoepie.png)

## Prerequisites

### Data sources
* http://www.oecd.org/health/health-statistics.htm

### External components
* d3js.org/d3.v3.min.js
* d3js.org/topojson.v1.min.js
* d3js.org/queue.v1.min.js
* labratrevenge.com/d3-tip/javascripts/d3.tip.v0.6.3.js

### Hardest parts
The hardest part is going to be the coloring of the map - I have not done that in previous weeks, so that is new.
