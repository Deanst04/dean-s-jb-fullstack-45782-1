from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)
CORS(app)

seeded = False

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
app.config["SECRET_KEY"] = ''
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

class Products(db.Model):
    __tablename__ = "products"  # matches your existing table name

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(30))
    price = db.Column(db.Integer)

    def __init__(self, name, price):
        self.name = name
        self.price = price


    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "price": self.price
        }
    


@app.before_request
def seed_data():
    global seeded
    if not seeded:
        db.create_all()

    if Products.query.count() == 0:
        p1 = Products("banana", 20)
        p2 = Products("apple", 15)
        p3 = Products("cherry", 30)

        db.session.add_all([p1, p2, p3])
        db.session.commit()
    
    seeded = True


@app.route("/", methods=["GET"])
def get_products():
    products = Products.query.all()
    results = [p.to_dict() for p in products]
    return jsonify(results)


@app.route("/new", methods=["POST"])
def add_product():
    data = request.get_json()

    name = data.get("name")
    price = data.get("price")

    if not name or price is None:
        return jsonify({"error": "name and price are required"}), 400
    
    new_product = Products(name, price)

    db.session.add(new_product)
    db.session.commit()

    return jsonify(new_product.to_dict()), 201


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
    
