import csv

with open("bajson.csv") as csvfile:
	csv_read = csv.DictReader(csvfile)

	for row in csv_read:
		if row["var"] == "physicians":
			print(row["var"], row["country"])
		if row["var"] == "LEM":
			print(row["var"], row["country"])
		if row["var"] == "LEF":
			print(row["var"], row["country"])
		if row["var"] == "LEP":
			print(row["var"], row["country"])