import cv2
import numpy as np
import os

# --- PART 1: THE AUTHENTICATION LAYER ---
def login_with_face():
    """
    Scans the camera feed. 
    Returns the User ID (int) if verification passes, or None if failed/quit.
    """
    # 1. Check if the 'brain' exists
    if not os.path.exists('trainer.yml'):
        print("[ERROR] 'trainer.yml' not found. Please run the training script first!")
        return None

    # 2. Load the recognizer and the trained data
    recognizer = cv2.face.LBPHFaceRecognizer_create()
    recognizer.read('trainer.yml')
    
    # 3. Load the face detector (Haar Cascade)
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    
    cap = cv2.VideoCapture(0)
    
    # GUI Font settings
    font = cv2.FONT_HERSHEY_SIMPLEX
    
    print("\n[SYSTEM] Camera starting... Looking for User 1 (Dean)...")
    print("[SYSTEM] Press 'q' to cancel login.\n")

    # DEBOUNCING VARS: We need 10 consecutive matches to trust the result
    consecutive_matches = 0
    REQUIRED_MATCHES = 15  # Increased to 15 for extra security
    
    authenticated_user = None

    while True:
        ret, frame = cap.read()
        if not ret: break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.2, minNeighbors=5)

        for(x, y, w, h) in faces:
            cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
            
            # Predict: Who is this?
            # id = User ID (1, 2, etc.)
            # confidence = Distance (0 is perfect match, 100 is bad match)
            id, confidence = recognizer.predict(gray[y:y+h, x:x+w])

            # Logic: If confidence is less than 55, it's a solid match
            if confidence < 55:
                # Check for Dean (ID 1)
                if id == 1:
                    consecutive_matches += 1
                    name = "Dean"
                    # Visual feedback: Show a loading bar effect
                    match_text = f"Verifying: {consecutive_matches}/{REQUIRED_MATCHES}"
                    color = (0, 255, 0) # Green
                else:
                    consecutive_matches = 0
                    name = "Unknown"
                    match_text = "Access Denied"
                    color = (0, 0, 255)
            else:
                consecutive_matches = 0
                name = "Unknown"
                match_text = "Scanning..."
                color = (0, 0, 255) # Red
            
            # Draw the text on screen
            cv2.putText(frame, str(name), (x+5, y-5), font, 1, color, 2)
            cv2.putText(frame, str(match_text), (x+5, y+h+25), font, 0.7, color, 1)

        cv2.imshow('Biometric Login', frame)

        # SUCCESS CHECK
        if consecutive_matches >= REQUIRED_MATCHES:
            authenticated_user = 1
            print("[SYSTEM] Identity Verified: Dean")
            break # Exit the loop

        # Quit with 'q'
        if cv2.waitKey(10) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()
    return authenticated_user

# --- PART 2: THE APPLICATION LAYER (Pure OpenCV GUI) ---
def launch_dashboard():
    """
    Renders a 'Secret Dashboard' using pure OpenCV (NumPy arrays).
    This prevents the macOS Tkinter/Cocoa crash.
    """
    print("[SYSTEM] Loading Dashboard...")
    
    # 1. Create a black canvas (Height=400, Width=600, 3 Color Channels)
    # This is effectively a 600x400 pixel image filled with zeros (black)
    dashboard = np.zeros((400, 600, 3), dtype="uint8")

    # 2. Add 'Hacker' style green text
    # cv2.putText(img, text, (x,y), font, scale, color, thickness)
    cv2.putText(dashboard, "ACCESS GRANTED", (130, 150), cv2.FONT_HERSHEY_SIMPLEX, 1.5, (0, 255, 0), 3)
    
    cv2.putText(dashboard, "Welcome back, Dean.", (180, 200), cv2.FONT_HERSHEY_PLAIN, 1.5, (200, 200, 200), 1)
    
    cv2.putText(dashboard, "CONFIDENTIAL DATA:", (50, 280), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 1)
    cv2.putText(dashboard, "- Project Listify: 80% Complete", (50, 310), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
    cv2.putText(dashboard, "- Next Mission: Learn React", (50, 330), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)

    cv2.putText(dashboard, "Press 'q' to Logout", (200, 380), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (100, 100, 100), 1)

    # 3. Draw a border
    cv2.rectangle(dashboard, (20, 20), (580, 380), (0, 255, 0), 1)

    # 4. Show the window
    while True:
        cv2.imshow("SECRET DASHBOARD", dashboard)
        if cv2.waitKey(0) & 0xFF == ord('q'):
            break
            
    cv2.destroyAllWindows()
    print("[SYSTEM] Logged out.")

# --- PART 3: MAIN ORCHESTRATION ---
if __name__ == "__main__":
    # Step 1: Attempt Login
    user_id = login_with_face()
    
    # Step 2: If successful, Open Dashboard
    if user_id == 1:
        launch_dashboard()
    else:
        print("[SYSTEM] Login Cancelled or Failed.")