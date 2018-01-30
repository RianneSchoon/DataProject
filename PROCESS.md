# Process - Programming Project

## Week 1

### Sat 06-01-18
Thought up several interesting research questions. However, there was no data for any of my plans. Decided to turn the empirical cycle upside down and start looking for coherent data first, and then figure out a fitting research question, although my academic conscience was not happy. 

### Mon 08-01-18
Continued searching for coherent data. Found this to be really hard since data from different sources is not compatible in most cases. Eventually I found some data about climate change, an exhausted subject, but with a lot of data. Made up an interesting story about air pollution by different sources and mortality rates of human populations. I submitted the proposal at 16.40, well in time for the deadline at 17.59. 
I thought there would be some kind of introduction to the course, but there was not. Apps did have an intro. I think this is weird, since all data students received an email asking them to be present at 10. We did not really know what was expected of us. 

### Tue 09-01-18
Yesterday I received an email that I had not submitted the proposal. I immediately mailed back and resubmitted it, apparently something had gone wrong earlier. I hoped that the staff would have considered my proposal yesterday evening and that I had a green light to continue. However, the proposal was not yet approved. Moreover, there was no staff until 13.00, so I felt a bit lost. I decided to continue with my idea, at the risk of being rejected. I then saw that one of my datasets had data from 1 year, instead of several years, as I thought yesterday (weirdly, the same data was shown in several columns of the table, so at first glance it looked like several years). So I decided to use another dataset and overturn my idea again. This was successful and at 13.00 I was one of the first to get assistance, and this idea got approved! The afternoon I figured out the layout of the JSON.

### Wed 10-01-18
I continued to have trouble with the JSON. I found it really hard to get the data in the right format. Furthermore, I started working with Datamaps to get a map. The map did not immediately work (even though everyone said datamaps is so simple, and it is, it only has one line but that line did not work…), so I returned to trying with the JSON. Got some really nice help from Jan. 

### Thu 11-01-18
We started with a meeting with our peer feedback group. It was nice to see everyones ideas and to pith my idea. I am really glad that I switched ideas, otherwise I would practically do the same as Xander from my group. Also I think my subject is interesting, which is nice for the course. After the meeting I continued fixing the JSON. Felt really stupid because how hard can a dataformat be. I understand what I wanted to do, but it just did not work out the way I wanted. I learned a lot about csv readers and dictreaders and some python functions.

### Fri 12-10-18
Today no peer meeting, since we have the group meeting in the afternoon. In the morning, I figured out the JSON, hurray! I fixed it with a python function ‘setdefault’ because the problem was that I was emptying the dictionary when a key already existed. I knew I was doing that, but I did not know how to solve it. I tried a try/except setup, but in the end the setdefault function did the trick. In the afternoon we presented our plans to a small group under Tims supervision. It was nice to see all the plans. I got some inspiration about what cool things you can do with D3.

## Week 2

### Mon 15-01-18
In the group meeting we told each other what we had so far, and where we want to be at the end of this week. I have a bootstrap website with a cool layout and a navbar. There is already an introduction on the site (storytelling and explanation of functionalities). Since datamaps was not working with me, I put up my D3 map that I made before. There, I have visualized in the tooltip the landname and the value of a variable of choice. Also I realized axes of the scatterplot (but not in the right format). The afternoon I asked assistance with datamaps. At 17.00, I had a beautiful map with colors according to the data and working tooltips for countries that have data! Before the weekend, I want to have all views on my website, all linked and interacting. For the linked views, I already made an interactive legend with which data can be selected. I will try to implement that too this week. But I am slower than expected, the checkbox will be made next week, as well as the time slider.

### Tue 16-01-18
In the group meeting we told each other the progress of Monday. Xander showed that he made a functional datamap and a time slider that updates the colors. He told me it was not that hard, only a few lines of code. With this new information, I updated my plans for this week: the time slider this week, and the checkbox next week. Today I want to make the time slider, fix the axes of the scatterplot, and get the dots. 

### Wed 17-01-18
Yesterday I got overambitious with my planning for the day. I got the axes of the scatterplot and the dots, however they are not yet correctly scaled. A lot of the dots go outside of the scatterplot and I do not know what is the problem since I use D3 scaling. I have a time slider on my page, however it is stretched along the entire page, which is ugly and not really easy in use, but it is linked to data! Really cool to see the map update its colors! To fix the stretched time slider I tried to make a different layout for my webpage with bootstrap and columns and rows. Right now, all visualizations are below each other and that is not really userfriendly for understanding and for seeing the graphs update. Tomorrow I want the time slider to be pretty and in the right place on the page, and i want to have the line chart finished, or at least the correct axes divisions. 

### Thu 18-01-18
We made a style guide with our team, see STYLE.md for the consensus style and my own personal taste/interpretations. After the group meeting I abandoned the layout of my webpage for now, since it did not work. I think it has to do with the bootstrap css and that it specifies svgs to be stretched in a container, or something like that which messes up my layout. Instead, I continued working on the line chart, to have every visualization ready to present on Friday. With the line chart I stumbled upon some problems. For this project I planned on using only one JSON. I foresaw that that could be complicated with the linechart, since for that graph another setup of the JSON would be easier to work with, but i decided that loading two JSONS with the exact same data but with different layout would be superfluous. Therefore I decided to manipulate the data with code to make the line chart. However, this turned out to be a lot more trouble than I anticipated. Therefore, after half a day of struggling with the lines, I decided to make another JSON for the line chart. The afternoon I struggled a lot with python to make that happen.

### Fri 19-01-18
In the morning I struggled with python to fix the data. Also I made radiobuttons on the site, but they are not in the correct place and do not work with data yet. In the afternoon we had the group meeting to show everyones projects. Really cool to see, and I feel very slow with where I am at this point in time, compared to the other students. This weekend I have zero time, so stress takes over just a little bit.

## Week 3

### Mon 22-01-18
Due to the stress I managed to fix the linechart JSON this weekend! So for this week I want to finish every interactive element, basically be ready with the entire project, minus some details and minus the code quality. To this end, the radiobuttons must work, and the map-select to update the line chart and to highlight a dot in the scatterplot. Also I want a variable line to be highlighted in the line chart when the radiobuttons are selected, and I want to make crosshair functionality in the line chart. It would be really cool to have the interactive elements in the scatterplot, where the user can select what they want on every axis and in the dots, but that is an extra feature that time will have to allow me to fix. Today I wanted to finish the line chart, with correct axes and nice colors and line labels and all; as well as a label for the time slider; and that the radiobuttons update the map colors. Unfortunately I did not make a legend for the colors on the map today and the radiobuttons do not work how I want them to.

### Tue 23-02-18
I was sick today, so I did not meet with my group and did not accomplish as much as i'd like. Yesterday I fixed the linechart lines and there are axes, although not yet in the right division, and a working updateable label for the time slider. Today I had another go at the layout of the webpage, it is slightly better than before when I tried to place graphs next to eachother, but still it is not really how I want it. Nonetheless I decided to leave it in this layout, for now. It is pretty as long as the user does not enter half-screen or zoom in the browser too much. I thought the beauty of bootstrap was the automatic scaling and placing colums under eachother on smaller devices, but it does not work. Also I tried to grab the correct output from the radiobuttons but they keep returning LEP (one of my variables) somehow, and the other boxes do not respond. Super weird and frustrating.

### Wed 24-01-18
Met with my group and discussed our Github structure. For some days now I have not committed to Github, since the 'push' button has disappeared (I use the desktop version) and instead only pull is available. I thought that pull meant overwriting the content of the folder on my computer with whatever was on Github (old versions). But I went to Martijn and he explained to me (for the third time now) the principles of Github. Was able to commit with his help, and now my pretty map structure is also visible on Github and not just locally! Today I fixed the radiobutton functionality to update the map, fixed the on-click functionality on countries on the map to update the line chart, fixed the linechart axes division and line coloring and line labels. 

### Thu 25-01-18
Radiobuttons color the map in the right way, with different colors for different datasets. The according line is highlighted in the line chart, although the lines do not yet have the same color as the variable has on the map. The layout of the webpage is updated, everything is now in the right columns and rows. Things are still a little bit to big, so a little scrolling is needed to see everything, but that is a worry for later. The damn radiobuttons still do not stay in a square but instead are all over the place. It's starting to piss me off, but they work so I will worry about their placement later. Somehow the labels in the map have vanished, spent the evening trying to get those to return and not only display the country but also the value. 

volgende week:
smooth overgangen van assen en lijnen bij het updaten (transition)
layout van de webpage (bootstrap werkt nog steeds niet naar wens. vandaag bedacht dat het misschien ligt aan dat de container wel fluid werkt, maar dat ik de svg een harde hoogte en breedte meegeef! Daar ga ik volgende week mee bezig.

### Fri 26-01-18
In the morning I tried to get my map pop-ups back. Sadly, I only got them to return the country, not the variable value of that country. I then decided to let that go and focus on the line chart. In the linechart, two variables share the Y2 axis (GDP and life expectancy (LEP)). Today I made them share the axis, so that on a selection in the radiobutton, the axes are updated if the other variable is clicked, and the line of the selected variable is directly highligted. When a user clicks a density variable, all of which are visible at all times on the y1 axis, the line simply highlights, but the axes stay the same. I realize it is hard to know where to read which line. I figured, if I can highlight a line on a radiobutton click, I can also highlight an axis. I quickly made a label for the visible lines in the according color, in which variables will also get a higher opacity on radio button selection. Then, the weekly meeting was already, so I ended this week with a little bit of worry about all the things I still want to do next week...

## Week 4

### Mon 29-01-18
Today I made the titles of all charts update according to the data depicted at any moment. The radiobuttons are now nicely aligned, and somehow that also fixed the problem of the graphs overlapping when the screen is made smaller. Also I got the tooltips back in the map, and that the countries with no data say "no data" in the tip. Furthermore, the scatterplot now also updates according to the radio button selection, albeit in a fairly statical manner. When either one of the density variables are clicked (nurses, physicians, hospital beds), they go on the x-axis, life expectancy on the y-axis, and GDP in the size of the dots. When life ecpectancy is selected in the buttons, it stays on the y-axis and the variable on the x-axis is set to physicians, with GDP in the dots. When GDP is clicked, it goes on the y-axis and the life expectancy goes in the size of the dots. Today I also tried to make another layout for the webpage, with the info on what is visible in the chart not on the page, but rather behind an info button in the navbar, which gives an overlay on the screen with the information. That way, the user immediately sees the graph when they open the page, can directly start clicking, and when they need additional info they can ask for it by clicking the button in the navbar. However, this did not work out so I decided to stick with my original layout (for the thousandth time i have to give in..). I also cleaned up my code a little bit. I do not have a seperate update function, rather the graphs are removed and redrawn with the new information on input change of buttons and slider. I have all the listening events together in the 'main' script, I think that is most neat. I wish the main file is also where all functions are defined, but that was not feasible since the funcitons are used in the makeGraph scripts, and the main script is loaded lastly. I have decided to keep the funcitons in the graph functions where they are, not really centralized, but working!

### Tue 30-01-18
Today I am having a migraine attack, did not manage to do a lot. altered the margins on all plots to make them look nicer. Made a display to see which country is most recently clicked and displayed in the line chart. 


todo:
en op basis van de radiobuttons de scatterplot assen veranderen. scatteplot levensverwachting scheiding mannen en vrouwen maken, en dan via de legenda bepalen welke van deze twee gehighlight wordt (nu staat bij de scatterplot alle landen in de legenda, dat is echt onhandig en niet mooi).
vandaag:
legenda bij de map een gradient maken. Als ik nog tijd heb, zorgen dat hij niet naar de rechterbovenhoek verdwijnt als de map gezoomd wordt. Als dat niet meer lukt, kiezen om de map zoomfunctie eruit te halen / de legenda naast de map vast te plakken aan de website zodat hij geen kant op kan.
andere pagina indeling zodat alles wel past zonder scrollen / uitzoomen
dataselectie in de scatterplot op orde maken (andere variabelen op de assen bij aanklikken radiobuttons)
als ik nog tijd heb, update functies maken zodat ik invloed heb op de transition van visualizaties, het gaat nu doormiddel van het weghalen en opnieuw maken van svg’s en dat kan smoother.
Verder deze week: 
alle interactie af, update functies, code netjes, handige indeling in de webpage.
