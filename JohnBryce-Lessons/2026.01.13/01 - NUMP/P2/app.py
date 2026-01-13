"""
Lily Flower Classifier - FastAPI Backend
=========================================
REST API for classifying flower images as Lily or Not Lily
using a trained CNN model.

Run with:
    uvicorn app:app --reload
"""

import io
from pathlib import Path

import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import transforms
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from PIL import Image


# ============================================================
# CONFIGURATION
# ============================================================

MODEL_PATH = Path("lily_model.pth")
IMAGE_SIZE = 64

# Prediction thresholds
HIGH_CONFIDENCE_THRESHOLD = 0.8
MEDIUM_CONFIDENCE_THRESHOLD = 0.5


# ============================================================
# CNN MODEL DEFINITION
# ============================================================

class LilyCNN(nn.Module):
    """
    CNN architecture for Lily flower classification.
    Must match the architecture used during training.
    """

    def __init__(self):
        super(LilyCNN, self).__init__()

        self.conv1 = nn.Conv2d(
            in_channels=3,
            out_channels=16,
            kernel_size=3,
            padding=1
        )

        self.conv2 = nn.Conv2d(
            in_channels=16,
            out_channels=32,
            kernel_size=3,
            padding=1
        )

        self.pool = nn.MaxPool2d(kernel_size=2, stride=2)
        self.relu = nn.ReLU()

        self.fc1 = nn.Linear(32 * 16 * 16, 64)
        self.fc2 = nn.Linear(64, 2)

    def forward(self, x):
        x = self.conv1(x)
        x = self.relu(x)
        x = self.pool(x)

        x = self.conv2(x)
        x = self.relu(x)
        x = self.pool(x)

        x = x.view(x.size(0), -1)
        x = self.fc1(x)
        x = self.relu(x)
        x = self.fc2(x)

        return x


# ============================================================
# IMAGE PREPROCESSING
# ============================================================

# Transform pipeline matching training preprocessing
preprocess_transform = transforms.Compose([
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])


def preprocess_image(image_bytes: bytes) -> torch.Tensor:
    """
    Preprocess an image for model inference.

    Args:
        image_bytes: Raw image bytes from upload

    Returns:
        Tensor of shape (1, 3, 64, 64) ready for model
    """
    # Load image from bytes
    image = Image.open(io.BytesIO(image_bytes))

    # Convert to RGB (handles grayscale, RGBA, etc.)
    if image.mode != "RGB":
        image = image.convert("RGB")

    # Apply transforms
    tensor = preprocess_transform(image)

    # Add batch dimension
    tensor = tensor.unsqueeze(0)

    return tensor


# ============================================================
# MODEL LOADING
# ============================================================

def load_model() -> LilyCNN:
    """
    Load the trained CNN model from disk.

    Returns:
        LilyCNN model in evaluation mode
    """
    model = LilyCNN()

    if MODEL_PATH.exists():
        # Load trained weights
        state_dict = torch.load(MODEL_PATH, map_location=torch.device('cpu'))
        model.load_state_dict(state_dict)
        print(f"Loaded model weights from {MODEL_PATH}")
    else:
        print(f"WARNING: Model file not found at {MODEL_PATH}")
        print("Using untrained model - predictions will be random!")

    # Set to evaluation mode (disables dropout, etc.)
    model.eval()

    return model


# ============================================================
# PREDICTION
# ============================================================

def predict(model: LilyCNN, image_tensor: torch.Tensor) -> dict:
    """
    Run inference on a preprocessed image.

    Args:
        model: Trained LilyCNN model
        image_tensor: Preprocessed image tensor

    Returns:
        Dictionary with prediction, confidence, and note
    """
    with torch.no_grad():
        # Forward pass
        outputs = model(image_tensor)

        # Apply softmax to get probabilities
        probabilities = F.softmax(outputs, dim=1)

        # Extract lily probability (class 1)
        lily_prob = probabilities[0, 1].item()
        confidence = lily_prob * 100

        # Determine prediction based on thresholds
        if lily_prob >= HIGH_CONFIDENCE_THRESHOLD:
            prediction = "Lily"
            note = "High confidence detection"
        elif lily_prob >= MEDIUM_CONFIDENCE_THRESHOLD:
            prediction = "Possibly Lily"
            note = "Medium confidence - consider manual review"
        else:
            prediction = "Not Lily"
            not_lily_confidence = (1 - lily_prob) * 100
            note = f"Likely another flower type ({not_lily_confidence:.1f}% confidence)"
            confidence = not_lily_confidence

    return {
        "prediction": prediction,
        "confidence": round(confidence, 2),
        "note": note
    }


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="Lily Flower Classifier API",
    description="Classify flower images as Lily or Not Lily using a CNN model",
    version="1.0.0"
)

# Load model at startup
model = load_model()


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "service": "Lily Flower Classifier",
        "status": "running",
        "model_loaded": MODEL_PATH.exists()
    }


@app.post("/predict")
async def predict_endpoint(image: UploadFile = File(...)):
    """
    Classify an uploaded image as Lily or Not Lily.

    Args:
        image: Uploaded image file (JPG or PNG)

    Returns:
        JSON with prediction, confidence score, and note
    """
    # Validate file type
    allowed_types = {"image/jpeg", "image/png", "image/jpg"}
    if image.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type: {image.content_type}. Allowed: JPG, PNG"
        )

    # Validate file extension
    filename = image.filename or ""
    allowed_extensions = {".jpg", ".jpeg", ".png"}
    file_ext = Path(filename).suffix.lower()
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file extension: {file_ext}. Allowed: .jpg, .jpeg, .png"
        )

    try:
        # Read image bytes
        image_bytes = await image.read()

        # Preprocess image
        image_tensor = preprocess_image(image_bytes)

        # Run prediction
        result = predict(model, image_tensor)

        return JSONResponse(content=result)

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error processing image: {str(e)}"
        )


@app.get("/health")
async def health_check():
    """Detailed health check with model status."""
    return {
        "status": "healthy",
        "model_file": str(MODEL_PATH),
        "model_exists": MODEL_PATH.exists(),
        "image_size": IMAGE_SIZE,
        "thresholds": {
            "high_confidence": HIGH_CONFIDENCE_THRESHOLD,
            "medium_confidence": MEDIUM_CONFIDENCE_THRESHOLD
        }
    }
