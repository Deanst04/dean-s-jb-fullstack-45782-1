import joblib

model = joblib.load('our_pridction.joblib')
print(model.predict([[21,1], [23,0]]))