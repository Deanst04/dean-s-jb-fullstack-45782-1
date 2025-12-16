import pandas as pd

df = pd.read_csv('cars.csv')

# print(df.head(10))
# print(df.info())
df.to_html("cars.html")