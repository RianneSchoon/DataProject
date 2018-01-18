import csv
import json
from pprint import pprint
import sys

jsonfile = open('linechartjson.json', 'w')
dictionary = {}

with open("bajson.csv") as csvfile:
	csv_read = csv.DictReader(csvfile)

	variables = ['physicians','nurses','beds','LEP','LEM','LEF','GDP']
	for row in csv_read:
		for k,v in row.iteritems():
			if k == 'country':
				floep = dictionary.setdefault(v, {})
				for var in variables:
					dictionary[v].setdefault(var, [])
					for year in range(1960, 2017):
						dictionary[v][var].append(row[str(year)])

# json.dump(dictionary, jsonfile)

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
