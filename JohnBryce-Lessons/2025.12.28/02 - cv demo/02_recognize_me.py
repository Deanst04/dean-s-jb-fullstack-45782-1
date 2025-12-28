import cv2
import numpy as np
import os

def train_model():
    # Initialize the recognizer and detector
    recognizer = cv2.face.LBPHFaceRecognizer_create()
    detector = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

    # Get all the file paths in the dataset folder
    imagePaths = [os.path.join("dataset", f) for f in os.listdir("dataset") if f.endswith(".jpg")]
    
    faceSamples = []
    ids = []

    print("Training the model... please wait...")

    for imagePath in imagePaths:
        # Convert image to grayscale (just in case)
        PIL_img = cv2.imread(imagePath, cv2.IMREAD_GRAYSCALE)
        img_numpy = np.array(PIL_img, 'uint8')

        # Extract the User ID from the image name "User.1.4.jpg"
        id = int(os.path.split(imagePath)[-1].split(".")[1])
        
        # Detect the face inside the training image to be sure
        faces = detector.detectMultiScale(img_numpy)
        
        for (x, y, w, h) in faces:
            faceSamples.append(img_numpy[y:y+h, x:x+w])
            ids.append(id)

    # Train the recognizer with the data
    recognizer.train(faceSamples, np.array(ids))
    
    # Save the model
    recognizer.write('trainer.yml')
    print(f"Model trained! {len(np.unique(ids))} face(s) learned.")
    return recognizer

def start_recognition(recognizer):
    # Load the trained model
    recognizer.read('trainer.yml')
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    
    font = cv2.FONT_HERSHEY_SIMPLEX
    
    # Map IDs to Names: ID 1 is "Dean", ID 2 is "Someone Else", etc.
    names = ['None', 'Dean', 'User2', 'User3'] 

    cap = cv2.VideoCapture(0)
    cap.set(3, 640) # Width
    cap.set(4, 480) # Height

    minW = 0.1 * cap.get(3)
    minH = 0.1 * cap.get(4)

    print("Starting camera... Press 'q' to quit.")

    while True:
        ret, frame = cap.read()
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        faces = face_cascade.detectMultiScale(
            gray,
            scaleFactor=1.2,
            minNeighbors=5,
            minSize=(int(minW), int(minH)),
        )

        for(x, y, w, h) in faces:
            cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
            
            # Predict who is in the box
            # id = Who it thinks it is
            # confidence = How WRONG it thinks it is (0 is perfect match, 100 is bad match)
            id, confidence = recognizer.predict(gray[y:y+h, x:x+w])

            # If confidence is less than 100, "0" is a perfect match 
            if (confidence < 100):
                name = names[id]
                conf_text = f"  {round(100 - confidence)}%"
            else:
                name = "Unknown"
                conf_text = f"  {round(100 - confidence)}%"
            
            cv2.putText(frame, str(name), (x+5, y-5), font, 1, (255, 255, 255), 2)
            cv2.putText(frame, str(conf_text), (x+5, y+h-5), font, 1, (255, 255, 0), 1)  

        cv2.imshow('camera', frame) 

        if cv2.waitKey(10) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    # If the trainer file doesn't exist, train first.
    if not os.path.exists("trainer.yml"):
        my_recognizer = train_model()
    else:
        # If it exists, load it
        my_recognizer = cv2.face.LBPHFaceRecognizer_create()
    
    # Run the camera
    start_recognition(my_recognizer)