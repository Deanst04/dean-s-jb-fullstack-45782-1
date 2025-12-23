import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
import joblib
import os

def train_and_save_model():
    """
    Trains the model on the current CSV data and saves it.
    Returns the accuracy score.
    """
    # Get paths relative to this file
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    music_file = os.path.join(BASE_DIR, "music.csv")
    model_path = os.path.join(BASE_DIR, "our_pridction.joblib")
    
    # Load data
    music_dt = pd.read_csv(music_file)
    
    # Prepare features (X) and target (Y)
    X = music_dt.drop(columns=['genre'])
    Y = music_dt['genre']
    
    # Split data
    X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.2)
    
    # Train model
    model = DecisionTreeClassifier()
    model.fit(X_train, Y_train)
    
    # Save model
    joblib.dump(model, model_path)
    
    # Calculate accuracy
    predictions = model.predict(X_test)
    accuracy = (predictions == Y_test).mean()
    
    print(f"✅ Model retrained! Accuracy: {accuracy:.2%}")
    return accuracy


# This allows the file to still run standalone
if __name__ == '__main__':
    train_and_save_model()