import torch
from torchvision import models, transforms
from PIL import Image
import gradio as gr

# ============================================================
# IMAGENET CLASS LABELS (Flower-related subset + common classes)
# ============================================================

# Full ImageNet labels for the 1000 classes
# We'll load these from torchvision's pretrained weights
IMAGENET_LABELS = models.ResNet18_Weights.DEFAULT.meta["categories"]

# Flower-related class indices in ImageNet
# These are the indices that correspond to flower classes
FLOWER_CLASSES = {
    985: "daisy",
    986: "yellow lady's slipper",
    987: "corn",
    988: "acorn",
    989: "hip",
    990: "buckeye",
    991: "coral fungus",
    992: "agaric",
    993: "gyromitra",
    994: "stinkhorn",
    995: "earthstar",
    996: "hen-of-the-woods",
    997: "bolete",
    998: "ear",
    999: "toilet tissue",
}

# Classes that could be considered "Lilac-like" (purple/violet flowers)
LILAC_LIKE_KEYWORDS = ["lilac", "violet", "lavender", "purple", "orchid", "iris"]


# ============================================================
# MODEL SETUP
# ============================================================

def load_model():
    """Load pretrained ResNet18 with ImageNet weights."""
    print("Loading pretrained ResNet18 model...")

    # Load model with pretrained ImageNet weights
    model = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)

    # Set to evaluation mode (no training)
    model.eval()

    print("Model loaded successfully!")
    return model


def get_transform():
    """Create image preprocessing pipeline for ImageNet models."""
    transform = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(
            mean=[0.485, 0.456, 0.406],
            std=[0.229, 0.224, 0.225]
        )
    ])
    return transform


# ============================================================
# PREDICTION
# ============================================================

def predict_flower(image, model, transform):
    """
    Run inference on an image and return predictions.
    Returns the top predicted class and confidence.
    """
    if image is None:
        return "No image provided", 0.0, "Please upload an image"

    # Convert to PIL Image if needed
    if not isinstance(image, Image.Image):
        image = Image.fromarray(image)

    # Ensure RGB mode
    image = image.convert("RGB")

    # Preprocess the image
    input_tensor = transform(image)
    input_batch = input_tensor.unsqueeze(0)  # Add batch dimension

    # Run inference
    with torch.no_grad():
        outputs = model(input_batch)
        probabilities = torch.softmax(outputs, dim=1)

    # Get top 5 predictions
    top5_prob, top5_idx = torch.topk(probabilities, 5)

    # Get the top prediction
    top_idx = top5_idx[0][0].item()
    top_prob = top5_prob[0][0].item() * 100
    top_class = IMAGENET_LABELS[top_idx]

    # Check if it looks like a lilac
    is_lilac_like = any(
        keyword in top_class.lower()
        for keyword in LILAC_LIKE_KEYWORDS
    )

    # Build detailed results
    details = "Top 5 Predictions:\n"
    for i in range(5):
        idx = top5_idx[0][i].item()
        prob = top5_prob[0][i].item() * 100
        class_name = IMAGENET_LABELS[idx]
        details += f"  {i+1}. {class_name}: {prob:.1f}%\n"

    # Determine lilac status
    if is_lilac_like:
        lilac_status = "This appears to be a LILAC or similar flower!"
    else:
        lilac_status = "This does NOT appear to be a Lilac flower."

    return top_class, top_prob, f"{lilac_status}\n\n{details}"


# ============================================================
# GRADIO INTERFACE
# ============================================================

def create_interface(model, transform):
    """Create and return the Gradio interface."""

    def predict(image):
        """Wrapper function for Gradio."""
        if image is None:
            return "N/A", "0%", "Please upload an image to classify."

        class_name, confidence, details = predict_flower(image, model, transform)

        return class_name, f"{confidence:.1f}%", details

    # Create the Gradio interface
    interface = gr.Interface(
        fn=predict,
        inputs=gr.Image(type="pil", label="Upload a Flower Image"),
        outputs=[
            gr.Textbox(label="Predicted Class"),
            gr.Textbox(label="Confidence"),
            gr.Textbox(label="Details", lines=8)
        ],
        title="Lilac Flower Identifier",
        description=(
            "Upload an image of a flower to classify it using AI.\n\n"
            "This demo uses a pretrained ResNet18 model trained on ImageNet.\n"
            "It will identify the flower type and tell you if it looks like a Lilac."
        ),
        examples=[]
    )

    return interface


# ============================================================
# MAIN PROGRAM
# ============================================================

def main():
    print("\n" + "=" * 60)
    print("   LILAC FLOWER IDENTIFIER")
    print("   Powered by Pretrained ResNet18")
    print("=" * 60 + "\n")

    # Load the pretrained model
    model = load_model()

    # Get the image transform
    transform = get_transform()

    # Create and launch the Gradio interface
    print("\nStarting Gradio interface...")
    interface = create_interface(model, transform)

    # Launch the web app
    interface.launch(
        share=False,
        show_error=True,
        theme=gr.themes.Soft()
    )


if __name__ == "__main__":
    main()
