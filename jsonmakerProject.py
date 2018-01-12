import csv
import json
from pprint import pprint

csvfile = open('projectjson.csv', 'r')
jsonfile = open('projectjson.json', 'w')

reader = list(csv.reader(csvfile))
dictionary = {}

print(reader[0][2])

years = range(1960, 2017)

for year in years:
	dictionary[year] = {}

for r_index, row in enumerate(reader):
	print(row)
	if r_index > 3:
		for year in years:
			dictionary[year][row[0]] = {}

		for c_index, col in enumerate(row):
			if c_index > 1:
				# print("yes")
				# print(col)
				# print(reader[3][c_index])
				# # print(dictionary[reader[3][c_index]])
				# print("poep")
				dictionary[int(reader[3][c_index])][row[0]]['physicians'] = row[c_index] 

# pprint(dictionary)


# json.dump(dictionaryvar, jsonfile)
