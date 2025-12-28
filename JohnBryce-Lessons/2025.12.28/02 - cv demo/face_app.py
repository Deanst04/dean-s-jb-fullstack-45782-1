import cv2

def main():
    # 1. Load the pre-trained Haar Cascade classifier for face detection
    # We use the path explicitly from cv2.data to avoid "file not found" errors
    face_cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
    face_cascade = cv2.CascadeClassifier(face_cascade_path)

    # 2. Initialize the webcam
    # '0' is usually the default camera. If you have multiple, try 1 or 2.
    cap = cv2.VideoCapture(0)

    # Check if camera opened successfully
    if not cap.isOpened():
        print("Error: Could not open webcam.")
        return

    print("App started! Press 'q' to quit.")

    while True:
        # 3. Read a frame from the camera
        ret, frame = cap.read()
        if not ret:
            print("Error: Failed to grab frame.")
            break

        # 4. Convert the frame to grayscale
        # Face detection works faster and more accurately on grayscale images
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # 5. Detect faces
        # scaleFactor=1.1: Reduces image size by 10% each pass (helps find faces of different sizes)
        # minNeighbors=5: Higher values = less false positives but might miss some faces
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

        # 6. Draw a rectangle around each detected face
        for (x, y, w, h) in faces:
            # (x, y) is top-left corner, (w, h) are width and height
            # Color is (Blue, Green, Red) -> (0, 255, 0) is Green
            # Thickness is 2
            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
            
            # Optional: Add a label
            cv2.putText(frame, "Face", (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

        # 7. Display the resulting frame
        cv2.imshow('Face Detection App', frame)

        # 8. Quit when 'q' key is pressed
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # 9. Clean up
    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()