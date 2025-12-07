from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

products = [
    {"name": "banana", "price": 3.5},
    {"name": "apple", "price": 4.0},
    {"name": "mango", "price": 7.0}
]

@app.route("/")
def get_products():
    return products