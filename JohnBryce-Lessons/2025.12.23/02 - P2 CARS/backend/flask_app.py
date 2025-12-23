# ========== 1. Standard Library ==========
import os
import sys
import csv

# ========== 2. Modify Path (BEFORE custom imports) ==========
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.join(BASE_DIR, '..'))

# ========== 3. Third-Party Packages ==========
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

# ========== 4. Local/Custom Imports ==========
from train_model import train_and_save_model, BRANDS, FUEL_TYPES, TRANSMISSIONS, BODY_TYPES, COLORS

# ========== 5. App Setup ==========
app = Flask(__name__)
CORS(app)

model_path = os.path.join(BASE_DIR, '..', 'car_price_model.joblib')
encoder_path = os.path.join(BASE_DIR, '..', 'model_encoder.joblib')
cars_csv_path = os.path.join(BASE_DIR, '..', 'cars.csv')

# Load model and encoder (will fail if model doesn't exist - run train_model.py first)
try:
    model = joblib.load(model_path)
    model_encoder = joblib.load(encoder_path)
except FileNotFoundError:
    print("⚠️ Model not found! Training initial model...")
    train_and_save_model()
    model = joblib.load(model_path)
    model_encoder = joblib.load(encoder_path)


# ========== Get Options Endpoint ==========
@app.route('/options', methods=['GET'])
def get_options():
    """
    Returns all available options for dropdowns in the frontend.
    """
    return jsonify({
        "brands": BRANDS,
        "fuel_types": FUEL_TYPES,
        "transmissions": TRANSMISSIONS,
        "body_types": BODY_TYPES,
        "colors": COLORS,
        "car_models": list(model_encoder.classes_),
        "success": True
    })


# ========== JSON API Endpoint for React Frontend ==========
@app.route('/predict', methods=['POST'])
def predict():
    """
    JSON API endpoint for the React frontend.
    Expects: { "brand": 0, "model": "Corolla", "year": 2020, "hand": 1, "mileage": 50000, 
               "engine_size": 2.0, "fuel_type": 0, "transmission": 1, "body_type": 1, "color": 0 }
    Returns: { "price": 185000, "success": true }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No JSON data received", "success": False}), 400
        
        brand = data.get('brand')
        car_model = data.get('model')
        year = data.get('year')
        hand = data.get('hand')
        mileage = data.get('mileage')
        engine_size = data.get('engine_size')
        fuel_type = data.get('fuel_type')
        transmission = data.get('transmission')
        body_type = data.get('body_type')
        color = data.get('color')
        
        # Validate all fields are present
        if None in [brand, car_model, year, hand, mileage, engine_size, fuel_type, transmission, body_type, color]:
            return jsonify({"error": "Missing required fields", "success": False}), 400
        
        # Encode the car model
        try:
            model_encoded = model_encoder.transform([car_model])[0]
        except ValueError:
            # If model not found, use a default encoding (will affect prediction accuracy)
            model_encoded = 0
        
        # Make prediction
        # Features: brand, model_encoded, year, hand, mileage, engine_size, fuel_type, transmission, body_type, color
        features = [[int(brand), model_encoded, int(year), int(hand), int(mileage), 
                    float(engine_size), int(fuel_type), int(transmission), int(body_type), int(color)]]
        prediction = model.predict(features)
        predicted_price = round(prediction[0])
        
        return jsonify({
            "price": predicted_price,
            "success": True
        })
        
    except Exception as e:
        return jsonify({"error": str(e), "success": False}), 500


# ========== Learn Endpoint - Add New Training Data ==========
@app.route('/learn', methods=['POST'])
def learn():
    """
    Endpoint to receive new training data from the frontend.
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No JSON data received", "success": False}), 400
        
        brand = data.get('brand')
        car_model = data.get('model')
        year = data.get('year')
        hand = data.get('hand')
        mileage = data.get('mileage')
        engine_size = data.get('engine_size')
        fuel_type = data.get('fuel_type')
        transmission = data.get('transmission')
        body_type = data.get('body_type')
        color = data.get('color')
        price = data.get('price')
        
        # Validate all fields are present
        if None in [brand, car_model, year, hand, mileage, engine_size, fuel_type, transmission, body_type, color, price]:
            return jsonify({"error": "Missing required fields", "success": False}), 400

        # Save to CSV
        with open(cars_csv_path, 'a', newline='') as f:
            writer = csv.writer(f)
            writer.writerow([int(brand), car_model, int(year), int(hand), int(mileage), 
                           float(engine_size), int(fuel_type), int(transmission), int(body_type), int(color), int(price)])

        # Retrain model
        r2_score = train_and_save_model()

        # Reload model and encoder
        global model, model_encoder
        model = joblib.load(model_path)
        model_encoder = joblib.load(encoder_path)
        
        # Log what we received
        brand_name = BRANDS.get(int(brand), 'Unknown')
        print(f"📚 Learn request: {brand_name} {car_model} ({year}), {mileage}km, ₪{price}")
        
        return jsonify({
            "message": f"Data saved and model retrained! R² Score: {r2_score:.4f}",
            "success": True
        })
        
    except Exception as e:
        return jsonify({"error": str(e), "success": False}), 500


# Health check / API info route
@app.route('/')
def index():
    return jsonify({
        "message": "Car Price Predictor API - Yad2 Style",
        "endpoints": {
            "GET /options": "Get all dropdown options (brands, models, etc.)",
            "POST /predict": "Send car details to get price prediction",
            "POST /learn": "Submit car data to improve the model"
        },
        "status": "running"
    })


if __name__ == '__main__':
    app.run(debug=True)
