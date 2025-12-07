from flask import Flask, render_template
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

products = ['banana', 'apple', 'mango']

@app.route("/")
def hello_world():
    return products