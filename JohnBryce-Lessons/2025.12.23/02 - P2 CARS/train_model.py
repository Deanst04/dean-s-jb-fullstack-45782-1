import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_absolute_error
from sklearn.preprocessing import LabelEncoder
import joblib
import os

# Feature mappings for reference - Updated with more brands
BRANDS = {
    0: 'Toyota', 1: 'Honda', 2: 'Ford', 3: 'Chevrolet', 4: 'BMW',
    5: 'Mercedes', 6: 'Audi', 7: 'Volkswagen', 8: 'Hyundai', 9: 'Kia',
    10: 'Nissan', 11: 'Mazda', 12: 'Subaru', 13: 'Tesla', 14: 'Lexus',
    15: 'Volvo'
}

FUEL_TYPES = {0: 'Petrol', 1: 'Diesel', 2: 'Hybrid', 3: 'Electric'}
TRANSMISSIONS = {0: 'Manual', 1: 'Automatic'}
BODY_TYPES = {0: 'Hatchback', 1: 'Sedan', 2: 'SUV', 3: 'Crossover', 4: 'Coupe', 5: 'Truck', 6: 'Wagon'}
COLORS = {0: 'White', 1: 'Black', 2: 'Silver', 3: 'Gray', 4: 'Blue', 5: 'Red', 6: 'Green', 7: 'Brown', 8: 'Orange'}


def train_and_save_model():
    """
    Trains a regression model on car data and saves it.
    Returns the R² score.
    """
    # Get paths relative to this file
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    cars_file = os.path.join(BASE_DIR, "cars.csv")
    model_path = os.path.join(BASE_DIR, "car_price_model.joblib")
    
    # Load data
    cars_dt = pd.read_csv(cars_file)
    
    # Encode the 'model' column (car model names) as it's a string
    label_encoder = LabelEncoder()
    cars_dt['model_encoded'] = label_encoder.fit_transform(cars_dt['model'])
    
    # Save the label encoder for later use
    encoder_path = os.path.join(BASE_DIR, "model_encoder.joblib")
    joblib.dump(label_encoder, encoder_path)
    
    # Prepare features (X) and target (Y)
    # Features: brand, model_encoded, year, hand, mileage, engine_size, fuel_type, transmission, body_type, color
    feature_columns = ['brand', 'model_encoded', 'year', 'hand', 'mileage', 'engine_size', 'fuel_type', 'transmission', 'body_type', 'color']
    X = cars_dt[feature_columns]
    Y = cars_dt['price']
    
    # Split data
    X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.2, random_state=42)
    
    # Train model - RandomForestRegressor is great for price prediction
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, Y_train)
    
    # Save model
    joblib.dump(model, model_path)
    
    # Calculate metrics
    predictions = model.predict(X_test)
    r2 = r2_score(Y_test, predictions)
    mae = mean_absolute_error(Y_test, predictions)
    
    print(f"✅ Model retrained!")
    print(f"   R² Score: {r2:.4f}")
    print(f"   Mean Absolute Error: ${mae:,.0f}")
    print(f"   Number of car models in encoder: {len(label_encoder.classes_)}")
    
    return r2


# This allows the file to still run standalone
if __name__ == '__main__':
    train_and_save_model()
