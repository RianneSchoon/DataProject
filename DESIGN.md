# Design

Technical details of the project: seperate parts of the web application, APIs, methods, techniques, features.

## Technical components

### Visualisations:
* **Map of the world** depicting three types of care (physician density, nurse density, hospital bed density) and life expectancy. The user can select which variable they want to see coloured in the map (radiobutton). Countries can be clicked to see specific info in the line graph. Tooltips popup on hover to show country name and variable value - MVP.
* **Multiple lines graph** per country that shows the three types of aid (y1-axis) and life expectancy (y2-axis) in time. Legend is checkbox to make one of the variables pop-out (opacity). Lines can be clicked to see correlation to life expectancy in the scatterplot - MVP.
* **Scatterplot** that shows the relation between the variable clicked in the line chart and life expectancy, for all countries. In this specific after-line-click-case, the size of the dots represents Gross Domestic Product, and the color of the dots differentiates males and females (since females have a higher average life expectancy) - MVP. Extra: furthermore, the scatterplot can be customized by the user: every variable can be plotted against every other, both on the axes and in dot size and in the color. 

### Visualisation interactivity and other interactive elements:
* When clicking a country on the map, the multiline graph is updated according to that country - MVP.
* When clicking a country on the map, this country pops up in the scatterplot. All different time points of that map-clicked-country will become visible in the scatterplot, with the 'current' time with the highest opacity - Extra.
* Different time points can be selected with a slider - applies to map and scatterplot (line chart already has time on the axis) - MVP.
* Clickable legend in the line graph to let one variable line pop-out with higher opacity - Extra.
* Checkbox of map variables (physicians, nurses, hospital beds, life expectancy, GDP) - MVP.
* Checkbox of scatterplot variables (physicians, nurses, hospital beds, life expectancy, GDP) - MVP -, and where to display that variable (x-axis, y-axis, dotsize, color) - Extra.
* Zoom functionality in the line graph, since data spans 46 years - Extra.


## Functionality

## Data sources

* http://www.oecd.org/health/health-statistics.htm
