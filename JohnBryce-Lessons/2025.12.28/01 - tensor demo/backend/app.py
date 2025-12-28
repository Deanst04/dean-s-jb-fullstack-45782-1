import uvicorn
import shutil
import os
import tensorflow as tf
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from keras.models import load_model, Model, model_from_json
from keras.layers import Dense, GlobalAveragePooling2D
from keras.applications import MobileNetV2
from keras.optimizers import Adam
from PIL import Image, ImageOps
import numpy as np
import io

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, "keras_model.h5")
labels_path = os.path.join(BASE_DIR, "labels.txt")
TRAIN_DIR = os.path.join(BASE_DIR, "images", "training-images")

ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff', '.tif'}
ALLOWED_MIME_TYPES = {
    'image/jpeg', 'image/png', 'image/gif', 'image/webp', 
    'image/bmp', 'image/tiff', 'image/heic', 'image/heif'
}

def is_valid_image(filename: str, content_type: str | None) -> bool:
    ext = os.path.splitext(filename.lower())[1]
    if ext in ALLOWED_EXTENSIONS:
        return True
    if content_type and content_type in ALLOWED_MIME_TYPES:
        return True
    return False

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def create_base_model():
    base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    predictions = Dense(1, activation='softmax')(x)
    model = Model(inputs=base_model.input, outputs=predictions)
    model.save(model_path)
    
    if not os.path.exists(labels_path):
        with open(labels_path, "w") as f:
            f.write("0 placeholder\n")
    return model

try:
    if os.path.exists(model_path):
        model = load_model(model_path, compile=False)
        class_names = open(labels_path, "r").readlines()
    else:
        model = create_base_model()
        class_names = ["0 placeholder\n"]
except Exception:
    model = None
    class_names = []

def process_image(image_bytes):
    data = np.ndarray(shape=(1, 224, 224, 3), dtype=np.float32)
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    size = (224, 224)
    image = ImageOps.fit(image, size, Image.Resampling.LANCZOS)
    image_array = np.asarray(image)
    normalized_image_array = (image_array.astype(np.float32) / 127.5) - 1
    data[0] = normalized_image_array
    return data

def retrain_model_safely():
    global model, class_names

    tf.keras.backend.clear_session()
    
    if not os.path.exists(model_path):
        create_base_model()

    loaded_model = load_model(model_path, compile=False)
    
    model_config = loaded_model.to_json()
    model_weights = loaded_model.get_weights()
    training_model = model_from_json(model_config)
    training_model.set_weights(model_weights)

    train_ds = tf.keras.utils.image_dataset_from_directory(
        TRAIN_DIR,
        seed=123,
        image_size=(224, 224),
        batch_size=32,
        label_mode='categorical'
    )

    new_class_names = train_ds.class_names
    
    class_weights = {}
    total_images = 0
    class_counts = {}

    for i, class_name in enumerate(new_class_names):
        class_dir = os.path.join(TRAIN_DIR, class_name)
        count = len([f for f in os.listdir(class_dir) if not f.startswith('.')])
        class_counts[i] = count
        total_images += count
    
    for i, count in class_counts.items():
        if count > 0:
            raw_weight = total_images / (len(new_class_names) * count)
            class_weights[i] = min(raw_weight, 10.0) 
        else:
            class_weights[i] = 1.0

    if os.path.exists(model_path):
        backup_path = model_path + ".backup"
        try:
            shutil.copy(model_path, backup_path)
        except Exception:
            pass

    with open(labels_path, "w") as f:
        for i, name in enumerate(new_class_names):
            f.write(f"{i} {name}\n")
    
    class_names = [f"{i} {name}\n" for i, name in enumerate(new_class_names)]

    for layer in training_model.layers:
        layer.trainable = False
    
    x = training_model.layers[-2].output
    predictions = Dense(len(new_class_names), activation='softmax', name="new_final_output")(x)
    training_model = Model(inputs=training_model.input, outputs=predictions)

    training_model.compile(optimizer=Adam(learning_rate=0.00001), 
                  loss='categorical_crossentropy',
                  metrics=['accuracy'])

    training_model.fit(train_ds, epochs=20, class_weight=class_weights)

    training_model.save(model_path)
    model = training_model

@app.get("/")
async def index():
    return {"message": "Active"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        if not is_valid_image(file.filename or "", file.content_type):
            return {"error": f"Invalid image format. Supported formats: {', '.join(ALLOWED_EXTENSIONS)}"}
        
        image_data = await file.read()
        processed_data = process_image(image_data)
        
        prediction = model.predict(processed_data)
        
        if np.isnan(prediction).any():
            return {"error": "Model returned NaN. Needs reset."}

        index = np.argmax(prediction)
        
        if index >= len(class_names):
             return {"error": "Model reload required"}

        class_name = class_names[index]
        confidence_score = float(prediction[0][index])
        
        if confidence_score < 0.60:
            return {
                "class": "Unknown",
                "confidence": confidence_score,
                "raw_index": -1,
                "message": "Confidence too low"
            }

        clean_class_name = class_name.split(' ', 1)[1].strip() if ' ' in class_name else class_name.strip()

        return {
            "class": clean_class_name,
            "confidence": confidence_score,
            "raw_index": int(index)
        }
    except Exception as e:
        return {"error": str(e)}

@app.post("/train")
async def train(file: UploadFile = File(...), label: str = Form(...)):
    try:
        if not is_valid_image(file.filename or "", file.content_type):
            return {"status": "error", "message": f"Invalid image format. Supported formats: {', '.join(ALLOWED_EXTENSIONS)}"}
        
        clean_label = label.strip().title().replace(" ", "_")
        
        class_dir = os.path.join(TRAIN_DIR, clean_label)
        os.makedirs(class_dir, exist_ok=True)

        file_location = os.path.join(class_dir, file.filename)
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        retrain_model_safely()

        return {
            "status": "success",
            "message": f"Added to '{clean_label}'.",
            "classes": [c.strip() for c in class_names]
        }

    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)