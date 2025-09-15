import csv
import sys
from decimal import Decimal

print ('argument list', sys.argv)
comparedFromCountry = sys.argv[1]
comparedFromMoney = sys.argv[2]
comparedToCountry = sys.argv[3]

header=[]
rows=[]
with open('big-mac-2023-07-01.csv', newline='', encoding='utf-8') as csvfile:
    spamreader = csv.reader(csvfile, delimiter=',', quotechar='|')
    for index, row in enumerate(spamreader):
        if index == 0:
            header.append(', '.join(row))
        else:
            rows.append(', '.join(row))

dollar_price_index = 5
country_index = 0
country_code_index = 1

dollar_price_comparedFromCountry = 0
dollar_price_comparedToCountry = 0

for row in rows:
    rowSplit = row.split(", ")
    if rowSplit[country_code_index] == comparedFromCountry:
        dollar_price_comparedFromCountry = rowSplit[dollar_price_index]
    if rowSplit[country_code_index] == comparedToCountry:
        dollar_price_comparedToCountry = rowSplit[dollar_price_index]

print("dollar_price_comparedFromCountry", dollar_price_comparedFromCountry)
print("dollar_price_comparedToCountry", dollar_price_comparedToCountry)

converted = Decimal(dollar_price_comparedFromCountry) * Decimal(comparedFromMoney) / Decimal(dollar_price_comparedToCountry)

print(converted)