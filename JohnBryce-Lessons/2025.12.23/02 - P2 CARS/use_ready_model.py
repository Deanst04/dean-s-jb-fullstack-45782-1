import joblib
import os

# Load the trained model and encoder
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model = joblib.load(os.path.join(BASE_DIR, 'car_price_model.joblib'))
encoder = joblib.load(os.path.join(BASE_DIR, 'model_encoder.joblib'))

# Feature mappings
BRANDS = {
    0: 'Toyota', 1: 'Hyundai', 2: 'Kia', 3: 'Mazda', 4: 'Skoda',
    5: 'Volkswagen', 6: 'Honda', 7: 'Nissan', 8: 'BMW', 9: 'Mercedes',
    10: 'Suzuki', 11: 'Mitsubishi'
}

FUEL_TYPES = {0: 'Petrol', 1: 'Diesel', 2: 'Hybrid', 3: 'Electric'}
TRANSMISSIONS = {0: 'Manual', 1: 'Automatic'}
BODY_TYPES = {0: 'Hatchback', 1: 'Sedan', 2: 'SUV', 3: 'Crossover', 4: 'Coupe'}

# Test cars
# Format: [brand, model_encoded, year, hand, mileage, engine_size, fuel_type, transmission, body_type, color]

def predict_price(brand, model_name, year, hand, mileage, engine_size, fuel_type, transmission, body_type, color):
    """Predict car price with named parameters for clarity"""
    model_encoded = encoder.transform([model_name])[0]
    features = [[brand, model_encoded, year, hand, mileage, engine_size, fuel_type, transmission, body_type, color]]
    return model.predict(features)[0]


print("🚗 Car Price Predictions - Yad2 Style")
print("=" * 60)

# Test 1: Toyota Corolla 2022 Hybrid
price = predict_price(
    brand=0,           # Toyota
    model_name='Corolla',
    year=2022,
    hand=1,            # First owner
    mileage=25000,
    engine_size=1.8,
    fuel_type=2,       # Hybrid
    transmission=1,    # Automatic
    body_type=1,       # Sedan
    color=0            # White
)
print(f"Toyota Corolla 2022 | Hybrid | 25,000km | יד 1 | אוטומט")
print(f"  → Predicted: ₪{price:,.0f}")
print()

# Test 2: BMW X3 2021
price = predict_price(
    brand=8,           # BMW
    model_name='X3',
    year=2021,
    hand=1,
    mileage=45000,
    engine_size=2.0,
    fuel_type=0,       # Petrol
    transmission=1,    # Automatic
    body_type=2,       # SUV
    color=1            # Black
)
print(f"BMW X3 2021 | Petrol | 45,000km | יד 1 | אוטומט")
print(f"  → Predicted: ₪{price:,.0f}")
print()

# Test 3: Hyundai i20 2019 (older, 2nd hand)
price = predict_price(
    brand=1,           # Hyundai
    model_name='i20',
    year=2019,
    hand=2,            # Second owner
    mileage=65000,
    engine_size=1.2,
    fuel_type=0,       # Petrol
    transmission=0,    # Manual
    body_type=0,       # Hatchback
    color=2            # Silver
)
print(f"Hyundai i20 2019 | Petrol | 65,000km | יד 2 | ידני")
print(f"  → Predicted: ₪{price:,.0f}")
print()

# Test 4: Tesla-style Electric (Kia EV6)
price = predict_price(
    brand=2,           # Kia
    model_name='EV6',
    year=2023,
    hand=1,
    mileage=15000,
    engine_size=0.0,   # Electric
    fuel_type=3,       # Electric
    transmission=1,    # Automatic
    body_type=3,       # Crossover
    color=0            # White
)
print(f"Kia EV6 2023 | Electric | 15,000km | יד 1 | אוטומט")
print(f"  → Predicted: ₪{price:,.0f}")
print()

# Test 5: Mercedes C-Class 2020
price = predict_price(
    brand=9,           # Mercedes
    model_name='C-Class',
    year=2020,
    hand=2,
    mileage=68000,
    engine_size=2.0,
    fuel_type=0,       # Petrol
    transmission=1,    # Automatic
    body_type=1,       # Sedan
    color=3            # Gray
)
print(f"Mercedes C-Class 2020 | Petrol | 68,000km | יד 2 | אוטומט")
print(f"  → Predicted: ₪{price:,.0f}")
print()

print("=" * 60)
print("✅ All available car models in the dataset:")
print(", ".join(sorted(encoder.classes_)))
