import cv2
import numpy as np
import os
import webbrowser
import json

# --- CONFIGURATION ---
DATA_PATH = "dataset"
TRAINER_FILE = "trainer.yml"
NAMES_FILE = "names.json"  # <--- NEW: Stores ID -> Name mapping
CASCADE_PATH = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"

# Ensure dataset folder exists
if not os.path.exists(DATA_PATH):
    os.makedirs(DATA_PATH)

# ==========================================
# HELPER: MANAGE NAMES DATABASE
# ==========================================
def load_names():
    """Loads the dictionary of {ID: Name} from a JSON file."""
    if not os.path.exists(NAMES_FILE):
        return {}
    with open(NAMES_FILE, 'r') as f:
        # JSON keys are always strings, so we convert them back to ints
        data = json.load(f)
        return {int(k): v for k, v in data.items()}

def save_name(user_id, user_name):
    """Saves a new user to the JSON file."""
    names = load_names()
    names[user_id] = user_name
    with open(NAMES_FILE, 'w') as f:
        json.dump(names, f, indent=4)

def get_next_id():
    """Finds the next available ID based on existing users."""
    names = load_names()
    if not names:
        return 1
    # Find the highest ID and add 1
    return max(names.keys()) + 1

# ==========================================
# MODULE 1: REGISTER NEW USER
# ==========================================
def register_user():
    print("\n--- REGISTRATION PHASE ---")
    
    # 1. Ask for Name (Human Readable)
    user_name = input("Enter your Name: ").strip()
    if not user_name:
        print("Name cannot be empty.")
        return False # Failed

    # 2. Auto-Generate ID
    user_id = get_next_id()
    print(f"System assigned ID #{user_id} to '{user_name}'.")

    # 3. Save mapping immediately
    save_name(user_id, user_name)

    print("Look at the camera. I will take 30 photos.")
    
    cap = cv2.VideoCapture(0)
    face_cascade = cv2.CascadeClassifier(CASCADE_PATH)
    
    count = 0
    while True:
        ret, frame = cap.read()
        if not ret: break
        
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.3, 5)

        for (x, y, w, h) in faces:
            cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)
            count += 1
            
            # Save image: User.ID.Count.jpg
            file_name = f"{DATA_PATH}/User.{user_id}.{count}.jpg"
            cv2.imwrite(file_name, gray[y:y+h, x:x+w])
            
            cv2.putText(frame, f"Captured: {count}/30", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

        cv2.imshow('Registration', frame)
        
        if count >= 30:
            break
        if cv2.waitKey(10) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()
    
    print("Photos saved. Training model...")
    train_model()
    return True # Success

# ==========================================
# MODULE 2: TRAIN MODEL
# ==========================================
def train_model():
    recognizer = cv2.face.LBPHFaceRecognizer_create()
    detector = cv2.CascadeClassifier(CASCADE_PATH)

    image_paths = [os.path.join(DATA_PATH, f) for f in os.listdir(DATA_PATH) if f.endswith(".jpg")]
    
    if len(image_paths) == 0:
        print("[ERROR] No data found. Register a user first.")
        return

    face_samples = []
    ids = []
    
    for image_path in image_paths:
        PIL_img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
        img_numpy = np.array(PIL_img, 'uint8')
        
        # Parse ID from filename
        id = int(os.path.split(image_path)[-1].split(".")[1])
        
        faces = detector.detectMultiScale(img_numpy)
        for (x, y, w, h) in faces:
            face_samples.append(img_numpy[y:y+h, x:x+w])
            ids.append(id)

    recognizer.train(face_samples, np.array(ids))
    recognizer.write(TRAINER_FILE)
    print(f"[SUCCESS] Model trained! Saved to {TRAINER_FILE}")

# ==========================================
# MODULE 3: LOGIN (BIOMETRIC AUTH)
# ==========================================
def login():
    if not os.path.exists(TRAINER_FILE):
        print("[ERROR] Model not found. Please Register first.")
        return False

    # Load names so we can display "Verifying: Dean" instead of "Verifying: 1"
    names = load_names()

    print("\n--- SECURE LOGIN ---")
    
    recognizer = cv2.face.LBPHFaceRecognizer_create()
    recognizer.read(TRAINER_FILE)
    face_cascade = cv2.CascadeClassifier(CASCADE_PATH)
    
    cap = cv2.VideoCapture(0)
    
    consecutive_matches = 0
    REQUIRED_MATCHES = 15
    auth_success = False
    detected_name = "Unknown"
    
    while True:
        ret, frame = cap.read()
        if not ret: break
        
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.2, 5)

        for(x, y, w, h) in faces:
            cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
            id_num, confidence = recognizer.predict(gray[y:y+h, x:x+w])

            if confidence < 55:
                consecutive_matches += 1
                # Lookup the name from our dictionary
                detected_name = names.get(id_num, "Unknown")
                
                color = (0, 255, 0)
                msg = f"{detected_name}: {consecutive_matches}/{REQUIRED_MATCHES}"
            else:
                consecutive_matches = 0
                color = (0, 0, 255)
                msg = "Unknown"

            cv2.putText(frame, msg, (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 2)
        
        cv2.imshow('Login', frame)
        
        if consecutive_matches >= REQUIRED_MATCHES:
            auth_success = True
            break
            
        if cv2.waitKey(10) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()
    
    if auth_success:
        launch_dashboard(detected_name) # Pass the actual name!
        return True # Success
    else:
        print("Login Failed.")
        return False # Failed

# ==========================================
# MODULE 4: THE REACT BRIDGE
# ==========================================
def launch_dashboard(user_name):
    """
    Closes the camera and opens the React Frontend in the browser.
    """
    print(f"Authentication Successful! Welcome, {user_name}.")
    
    # Pass the DYNAMIC name to the React App
    react_app_url = f"http://localhost:5173/?user={user_name}"
    
    webbrowser.open(react_app_url)

# ==========================================
# MAIN MENU (AUTO-EXIT)
# ==========================================
def main_menu():
    while True:
        print("\n" + "="*30)
        print("   FACE RECOGNITION SYSTEM")
        print("="*30)
        print("1. Register New User")
        print("2. Login")
        print("3. Exit")
        
        choice = input("Select Option (1-3): ")
        
        if choice == '1':
            success = register_user()
            if success:
                print("Registration Complete. Exiting System.")
                break # AUTO EXIT
        elif choice == '2':
            success = login()
            if success:
                print("Login Complete. Exiting System.")
                break # AUTO EXIT
        elif choice == '3':
            print("Exiting...")
            break
        else:
            print("Invalid option.")

if __name__ == "__main__":
    main_menu()