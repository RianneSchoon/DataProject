import csv
import json
from pprint import pprint
import sys

jsonfile = open('linechartjson.json', 'w')

dictionary = {}

variables = ['physicians','nurses','beds','LEP','LEM','LEF','GDP']
countrycodes = ["AUS", "AUT", "BEL", "CAN", "CHL", "CZE", "DNK", "EST", "FIN", "FRA","DEU","GRC","HUN","ISL","IRL","ISR", "ITA", "JPN", "KOR", "LVA", "LUX", "MEX", "NLD", "NZL", "NOR", "POL", "PRT", "SVK", "SVN", "ESP", "SWE", "CHE", "TUR", "GBR", "USA", "BRA", "CHN", "COL", "CRI", "IND", "IDN", "LTU", "RUS", "ZAF"]

for country in countrycodes:
	dictionary[country] = {}
	for variable in variables:
		dictionary[country][variable] = []

with open("belangrijkedata.csv") as csvfile:
	csv_read = csv.DictReader(csvfile)

	# voor elke csv-rij
	for row in csv_read:
		# vanaf hier gaat het mis huuu
		for i in range(1960, 2017):
			# print(row["country"], row["var"])
			dictionary[row["country"]][row["var"]].append(row[str(i)])
	
	pprint(dictionary)
	# 	# voor elke key in de csv-rij
	# 	for k,v in row.iteritems():

	# 		# eerste key wordt de country
	# 		# if k == 'country':

	# 		dictionary[{})
	# 			countrycodes.append(v)

	# 			# # per country komen alle variabelen als volgende keys
	# 			# for var in variables:
	# 			# 	dictionary[v].setdefault(var, [])

	# 			# 	# per variabele wordt de variabele toegevoegd voor elk jaar
	# 			# 	for year in range(1960, 2017):
	# 			# 		dictionary[v][var].append(row[str(year)])
	# print(countrycodes)


json.dump(dictionary, jsonfile)

# import csv
# import json

# csvfile = open('temp2016.csv', 'r')
# jsonfile = open('testfloep.json', 'w')

# reader = csv.reader(csvfile)

# dictionaryvar = {"mean":{}, "min":{}, "max":{}}

# for row in reader:
# 	dictionaryvar['mean'][row[0]] = row[1]
# 	dictionaryvar['min'][row[0]] = row[2]
# 	dictionaryvar['max'][row[0]] = row[3]

# json.dump(dictionaryvar, jsonfile)
