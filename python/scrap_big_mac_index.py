"""
HOW TO SCRAP

https://worldpopulationreview.com/country-rankings/big-mac-index-by-country

https://www.economist.com/big-mac-index 
has an iframe into
https://infographics.economist.com/2018/big-mac/index.html
gets csv file from javascript bundle 
https://infographics.economist.com/2018/big-mac/js/bundle.js


or get from here
https://github.com/TheEconomist/big-mac-data/tree/master/output-data


"""

import requests
from bs4 import BeautifulSoup
import csv

req = requests.get("https://worldpopulationreview.com/country-rankings/big-mac-index-by-country")
html= req.text
# print(html)
soup = BeautifulSoup(html)

# tp-table-body
data = []
table = soup.find("table", {"class": "tp-table-body"})
tbody = table.find("tbody")
trs = tbody.findAll("tr")

for tr in trs:
    country = tr.find("th").text
    bigMacIndex = tr.find("td").text
    print(country, bigMacIndex)
    data.append([country, bigMacIndex])

with open('bigMacIndex.csv', 'w', newline='') as file:
    writer = csv.writer(file)
    field = ["country", "big mac index"]
    writer.writerow(field)
    for row in data:
        writer.writerow(row)