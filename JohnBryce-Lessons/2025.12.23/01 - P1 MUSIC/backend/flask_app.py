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

# ========== 4. Local/Custom Imports ==========
from train_model import train_and_save_model

# ========== 5. App Setup ==========
app = Flask(__name__)
CORS(app)

model_path = os.path.join(BASE_DIR, '..', 'our_pridction.joblib')
music_csv_path = os.path.join(BASE_DIR, '..', 'music.csv')
model = joblib.load(model_path)


# ========== JSON API Endpoint for React Frontend ==========
@app.route('/predict', methods=['POST'])
def predict():
    """
    JSON API endpoint for the React frontend.
    Expects: { "age": 25, "gender": 1 }
    Returns: { "genre": "Jazz", "success": true }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No JSON data received", "success": False}), 400
        
        age = data.get('age')
        gender = data.get('gender')
        
        if age is None or gender is None:
            return jsonify({"error": "Missing 'age' or 'gender' field", "success": False}), 400
        
        # Make prediction
        prediction = model.predict([[int(age), int(gender)]])
        genre_result = prediction[0]
        
        return jsonify({
            "genre": genre_result,
            "success": True
        })
        
    except Exception as e:
        return jsonify({"error": str(e), "success": False}), 500

# ========== Learn Endpoint - Add New Training Data ==========
@app.route('/learn', methods=['POST'])
def learn():
    """
    Endpoint to receive new training data from the frontend.
    Expects: { "age": 25, "gender": 1, "genre": "Jazz" }
    Returns: { "message": "Data saved!", "success": true }
    
    TODO: Implement your logic here to:
    1. Save the data to CSV
    2. Retrain the model
    3. Or store for batch processing
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No JSON data received", "success": False}), 400
        
        age = data.get('age')
        gender = data.get('gender')
        genre = data.get('genre')
        
        if age is None or gender is None or genre is None:
            return jsonify({"error": "Missing required fields", "success": False}), 400

        with open(music_csv_path, 'a', newline='') as f:
            writer = csv.writer(f)
            writer.writerow([int(age), int(gender), str(genre)])

        accuracy = train_and_save_model()

        global model
        model = joblib.load(model_path)
        
        # Log what we received (you can see this in terminal)
        print(f"📚 Learn request: Age={age}, Gender={gender}, Genre={genre}")
        
        return jsonify({
            "message": f"Data saved and model retrained! Accuracy: {accuracy:.2%}",
            "success": True
        })
        
    except Exception as e:
        return jsonify({"error": str(e), "success": False}), 500


# Health check / API info route
@app.route('/')
def index():
    return jsonify({
        "message": "Music Genre Predictor API",
        "endpoints": {
            "POST /predict": "Send { age: number, gender: number } to get genre prediction"
        },
        "status": "running"
    })


if __name__ == '__main__':
    app.run(debug=True)