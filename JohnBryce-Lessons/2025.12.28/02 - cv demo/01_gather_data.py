import cv2
import os

def main():
    # 1. Create a folder for the data
    if not os.path.exists('dataset'):
        os.makedirs('dataset')

    # 2. Setup Camera and Detector
    cap = cv2.VideoCapture(0)
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    print("Look at the camera. I need to take 30 photos of you.")
    print("Move your head slightly (left, right, smile, frown).")
    
    # Ask for your ID (Just use '1' for Dean)
    face_id = input('\nenter user id (number) and press <return>: ')
    
    count = 0
    while True:
        ret, frame = cap.read()
        if not ret: break
        
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.3, 5)

        for (x, y, w, h) in faces:
            # Draw a box just so you see it working
            cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)
            
            # Increment photo count
            count += 1
            
            # Save the captured image into the datasets folder
            # We save it as "User.1.4.jpg" (User.ID.Count.jpg)
            cv2.imwrite(f"dataset/User.{face_id}.{count}.jpg", gray[y:y+h, x:x+w])
            
            cv2.imshow('Gathering Data', frame)

        # Stop after 30 photos
        if count >= 30: 
            break
        
        # Small delay
        if cv2.waitKey(100) & 0xFF == ord('q'):
            break

    print("\nDone! Data gathered.")
    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()