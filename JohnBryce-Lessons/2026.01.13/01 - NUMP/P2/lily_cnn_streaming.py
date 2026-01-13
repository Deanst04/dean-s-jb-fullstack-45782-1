"""
Lily Flower CNN Classifier - Streaming Version
===============================================
A Convolutional Neural Network that learns to identify Lily flowers
using streamed data from Hugging Face datasets.

No local dataset storage - images are streamed on-the-fly.

IMPORTANT: Uses balanced sampling to ensure lilies appear in training batches,
since lily classes are rare (~8% of the dataset).
"""

import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import transforms
from datasets import load_dataset
import random


# ============================================================
# CONFIGURATION
# ============================================================

# All lily-related label IDs in oxford_flowers102 dataset
# Found via diagnostic probe of the dataset
LILY_LABEL_IDS = {5, 17, 19, 20, 42, 72, 78, 89, 101}
# 5: tiger lily, 17: peruvian lily, 19: giant white arum lily,
# 20: fire lily, 42: sword lily, 72: water lily,
# 78: toad lily, 89: canna lily, 101: blackberry lily

# Image size for our network
IMAGE_SIZE = 64

# Training settings
BATCH_SIZE = 32
NUM_EPOCHS = 5
LEARNING_RATE = 0.001

# Limit samples per epoch for reasonable training time
TRAIN_SAMPLES_PER_EPOCH = 2000
VAL_SAMPLES = 500

# Target lily ratio in each batch (25% lilies)
# This ensures the model sees enough lily examples to learn
TARGET_LILY_RATIO = 0.25

# Class weights for imbalanced data
# Lily is ~8% of data, so we weight it higher to prevent
# the model from just predicting "not lily" for everything
LILY_WEIGHT = 10.0  # Weight for class 1 (lily)
OTHER_WEIGHT = 1.0  # Weight for class 0 (other flowers)


# ============================================================
# IMAGE TRANSFORMS
# ============================================================

# Define how to transform images from the stream
transform = transforms.Compose([
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),  # Resize to fixed size
    transforms.ToTensor(),                         # Convert to tensor (0-1)
    transforms.Normalize(                          # Normalize for training
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])


# ============================================================
# DATASET STREAMING
# ============================================================

def load_streaming_dataset():
    """
    Load the oxford_flowers102 dataset using Hugging Face streaming.

    Streaming means:
    - Images are fetched on-demand from the internet
    - No local storage required
    - Memory efficient for large datasets

    Returns:
        train_stream: Iterator for training data
        val_stream: Iterator for validation data
    """
    print("Connecting to Hugging Face streaming dataset...")
    print("Dataset: nelorth/oxford-flowers")
    print("No local storage - images streamed on-the-fly")
    print()

    # Load dataset with streaming enabled
    # NOTE: trust_remote_code removed for compatibility
    dataset = load_dataset(
        "nelorth/oxford-flowers",
        streaming=True
    )

    # Get train and validation splits
    train_stream = dataset["train"]
    val_stream = dataset["test"]  # Use test split for validation

    print(f"Training samples per epoch: {TRAIN_SAMPLES_PER_EPOCH}")
    print(f"Validation samples: {VAL_SAMPLES}")
    print(f"Target lily ratio per batch: {TARGET_LILY_RATIO:.0%}")
    print(f"Lily label IDs: {sorted(LILY_LABEL_IDS)}")
    print()

    return train_stream, val_stream


def process_sample(sample):
    """
    Process a single sample from the stream.

    Converts the image to tensor and label to binary (lily/not lily).

    Args:
        sample: Dictionary with 'image' and 'label' keys

    Returns:
        image_tensor: Transformed image tensor
        binary_label: 1 for lily, 0 for other flowers
    """
    # Get the image (PIL Image)
    image = sample["image"]

    # Convert to RGB if needed (some images might be grayscale)
    if image.mode != "RGB":
        image = image.convert("RGB")

    # Apply transforms
    image_tensor = transform(image)

    # Convert label to binary: ANY lily type → 1, others → 0
    original_label = sample["label"]
    binary_label = 1 if original_label in LILY_LABEL_IDS else 0

    return image_tensor, binary_label


def create_balanced_batches(stream_iterator, batch_size, num_samples, target_lily_ratio=0.25):
    """
    Create balanced batches from a streaming iterator.

    Uses two buffers (lily and other) to ensure each batch contains
    a minimum ratio of lily samples. This prevents the model from
    learning to always predict "not lily" due to class imbalance.

    Args:
        stream_iterator: Iterator yielding samples
        batch_size: Number of samples per batch
        num_samples: Total samples to process
        target_lily_ratio: Target fraction of lilies per batch

    Yields:
        batch_images: Tensor of shape (batch_size, 3, 64, 64)
        batch_labels: Tensor of shape (batch_size,)
    """
    # Separate buffers for lily and other samples
    lily_buffer = []
    other_buffer = []

    # How many lilies we want per batch
    lilies_per_batch = max(1, int(batch_size * target_lily_ratio))
    others_per_batch = batch_size - lilies_per_batch

    samples_yielded = 0
    stream_exhausted = False

    # First, fill the buffers with initial samples
    for sample in stream_iterator:
        image_tensor, binary_label = process_sample(sample)

        if binary_label == 1:
            lily_buffer.append((image_tensor, binary_label))
        else:
            other_buffer.append((image_tensor, binary_label))

        # Check if we can build batches
        while len(lily_buffer) >= lilies_per_batch and len(other_buffer) >= others_per_batch:
            if samples_yielded >= num_samples:
                return

            # Build a balanced batch
            batch_images = []
            batch_labels = []

            # Take lilies
            for _ in range(lilies_per_batch):
                img, lbl = lily_buffer.pop(0)
                batch_images.append(img)
                batch_labels.append(lbl)

            # Take others
            for _ in range(others_per_batch):
                img, lbl = other_buffer.pop(0)
                batch_images.append(img)
                batch_labels.append(lbl)

            # Shuffle within batch
            combined = list(zip(batch_images, batch_labels))
            random.shuffle(combined)
            batch_images, batch_labels = zip(*combined)

            yield torch.stack(batch_images), torch.tensor(batch_labels, dtype=torch.long)
            samples_yielded += batch_size

    stream_exhausted = True

    # Handle remaining samples with oversampling if needed
    while samples_yielded < num_samples:
        batch_images = []
        batch_labels = []

        # Get lilies (oversample if buffer is low but we have some)
        lily_count = 0
        if lily_buffer:
            for _ in range(lilies_per_batch):
                if lily_buffer:
                    img, lbl = lily_buffer.pop(0)
                else:
                    # Oversample: reuse a lily (put it back after use)
                    break
                batch_images.append(img)
                batch_labels.append(lbl)
                lily_count += 1

        # Fill rest with others
        others_needed = batch_size - len(batch_images)
        for _ in range(others_needed):
            if other_buffer:
                img, lbl = other_buffer.pop(0)
                batch_images.append(img)
                batch_labels.append(lbl)

        if not batch_images:
            break

        # Shuffle within batch
        combined = list(zip(batch_images, batch_labels))
        random.shuffle(combined)
        batch_images, batch_labels = zip(*combined)

        yield torch.stack(list(batch_images)), torch.tensor(list(batch_labels), dtype=torch.long)
        samples_yielded += len(batch_images)


def create_validation_set(stream_iterator, target_lilies=50, target_others=450):
    """
    Create a validation set with guaranteed lily samples.

    Scans the stream to collect a fixed number of lily and other samples.

    Args:
        stream_iterator: Iterator yielding samples
        target_lilies: Number of lily samples to collect
        target_others: Number of other samples to collect

    Returns:
        val_images: Tensor of all validation images
        val_labels: Tensor of all validation labels
    """
    lily_images = []
    lily_labels = []
    other_images = []
    other_labels = []

    for sample in stream_iterator:
        image_tensor, binary_label = process_sample(sample)

        if binary_label == 1 and len(lily_images) < target_lilies:
            lily_images.append(image_tensor)
            lily_labels.append(binary_label)
        elif binary_label == 0 and len(other_images) < target_others:
            other_images.append(image_tensor)
            other_labels.append(binary_label)

        # Stop when we have enough
        if len(lily_images) >= target_lilies and len(other_images) >= target_others:
            break

    # Combine and shuffle
    all_images = lily_images + other_images
    all_labels = lily_labels + other_labels

    combined = list(zip(all_images, all_labels))
    random.shuffle(combined)
    all_images, all_labels = zip(*combined)

    print(f"  Validation set: {len(lily_images)} lilies + {len(other_images)} others = {len(all_images)} total")

    return torch.stack(list(all_images)), torch.tensor(list(all_labels), dtype=torch.long)


# ============================================================
# CNN MODEL
# ============================================================

class LilyCNN(nn.Module):
    """
    A simple Convolutional Neural Network for binary classification.

    Architecture:
    - Conv1: 3 → 16 channels, 3x3 kernel
    - ReLU + MaxPool (2x2)
    - Conv2: 16 → 32 channels, 3x3 kernel
    - ReLU + MaxPool (2x2)
    - Flatten
    - FC1: → 64 neurons + ReLU
    - FC2: → 2 outputs (lily / not lily)
    """

    def __init__(self):
        """Initialize the CNN layers."""
        super(LilyCNN, self).__init__()

        # First convolutional layer
        self.conv1 = nn.Conv2d(
            in_channels=3,       # RGB input
            out_channels=16,     # 16 feature maps
            kernel_size=3,       # 3x3 filter
            padding=1            # Same padding
        )

        # Second convolutional layer
        self.conv2 = nn.Conv2d(
            in_channels=16,
            out_channels=32,
            kernel_size=3,
            padding=1
        )

        # Pooling and activation
        self.pool = nn.MaxPool2d(kernel_size=2, stride=2)
        self.relu = nn.ReLU()

        # After 2 poolings: 64 → 32 → 16
        # Feature maps: 32 channels × 16 × 16 = 8192
        self.fc1 = nn.Linear(32 * 16 * 16, 64)
        self.fc2 = nn.Linear(64, 2)

    def forward(self, x):
        """
        Forward pass through the network.

        Args:
            x: Input tensor (batch, 3, 64, 64)

        Returns:
            Output logits (batch, 2)
        """
        # Block 1: Conv → ReLU → Pool
        x = self.conv1(x)      # (batch, 16, 64, 64)
        x = self.relu(x)
        x = self.pool(x)       # (batch, 16, 32, 32)

        # Block 2: Conv → ReLU → Pool
        x = self.conv2(x)      # (batch, 32, 32, 32)
        x = self.relu(x)
        x = self.pool(x)       # (batch, 32, 16, 16)

        # Flatten and fully connected
        x = x.view(x.size(0), -1)  # (batch, 8192)
        x = self.fc1(x)            # (batch, 64)
        x = self.relu(x)
        x = self.fc2(x)            # (batch, 2)

        return x


def build_model():
    """
    Create and return a new CNN model.

    Returns:
        model: LilyCNN instance
    """
    print("Building CNN model...")

    model = LilyCNN()

    # Count parameters
    total_params = sum(p.numel() for p in model.parameters())
    print(f"Model has {total_params:,} trainable parameters")
    print()

    return model


# ============================================================
# TRAINING
# ============================================================

def compute_metrics(predictions, labels):
    """
    Compute classification metrics for binary classification.

    Args:
        predictions: Tensor of predicted classes
        labels: Tensor of true labels

    Returns:
        dict with accuracy, lily_recall, lily_precision, etc.
    """
    # True positives: predicted lily AND actual lily
    tp = ((predictions == 1) & (labels == 1)).sum().item()
    # False positives: predicted lily BUT actual other
    fp = ((predictions == 1) & (labels == 0)).sum().item()
    # False negatives: predicted other BUT actual lily
    fn = ((predictions == 0) & (labels == 1)).sum().item()
    # True negatives: predicted other AND actual other
    tn = ((predictions == 0) & (labels == 0)).sum().item()

    total = tp + fp + fn + tn
    accuracy = 100 * (tp + tn) / total if total > 0 else 0

    # Recall: of all actual lilies, how many did we find?
    lily_total = tp + fn
    lily_recall = 100 * tp / lily_total if lily_total > 0 else 0

    # Precision: of all predicted lilies, how many were correct?
    lily_predicted = tp + fp
    lily_precision = 100 * tp / lily_predicted if lily_predicted > 0 else 0

    return {
        "accuracy": accuracy,
        "lily_recall": lily_recall,
        "lily_precision": lily_precision,
        "tp": tp,
        "fp": fp,
        "fn": fn,
        "tn": tn,
        "lily_total": lily_total
    }


def train_model(model, train_stream, val_stream):
    """
    Train the CNN using streamed data with balanced sampling.

    Each epoch:
    1. Stream training samples with balanced lily/other ratio
    2. Forward pass → weighted loss → backward pass → update weights
    3. Validate on a balanced validation set

    Args:
        model: The CNN model
        train_stream: Hugging Face streaming dataset (train)
        val_stream: Hugging Face streaming dataset (validation)

    Returns:
        model: Trained model
    """
    print("Starting training with balanced streaming data...")
    print("=" * 60)

    # Weighted loss function to handle class imbalance
    # Higher weight for lily class forces model to pay attention to lilies
    # Without this, the model would just predict "not lily" for everything
    # and still get ~92% accuracy (since only ~8% are lilies)
    class_weights = torch.tensor([OTHER_WEIGHT, LILY_WEIGHT])
    criterion = nn.CrossEntropyLoss(weight=class_weights)
    print(f"Using weighted loss: Other={OTHER_WEIGHT}, Lily={LILY_WEIGHT}")

    optimizer = optim.Adam(model.parameters(), lr=LEARNING_RATE)

    # Build validation set once (with guaranteed lilies)
    print("Building balanced validation set...")
    val_iter = iter(val_stream)
    val_images, val_labels = create_validation_set(val_iter, target_lilies=50, target_others=450)
    print()

    for epoch in range(NUM_EPOCHS):
        # ---- TRAINING PHASE ----
        model.train()
        running_loss = 0.0
        all_predictions = []
        all_labels = []
        num_batches = 0

        # Create fresh iterator for each epoch with shuffle
        train_iter = iter(train_stream.shuffle(seed=epoch, buffer_size=1000))

        print(f"Epoch {epoch + 1}/{NUM_EPOCHS} - Streaming balanced training data...")

        for batch_images, batch_labels in create_balanced_batches(
            train_iter, BATCH_SIZE, TRAIN_SAMPLES_PER_EPOCH, TARGET_LILY_RATIO
        ):
            # Zero gradients
            optimizer.zero_grad()

            # Forward pass
            outputs = model(batch_images)

            # Compute weighted loss
            loss = criterion(outputs, batch_labels)

            # Backward pass
            loss.backward()

            # Update weights
            optimizer.step()

            # Track metrics
            running_loss += loss.item()
            _, predicted = torch.max(outputs, 1)
            all_predictions.extend(predicted.tolist())
            all_labels.extend(batch_labels.tolist())
            num_batches += 1

        # Calculate training metrics
        train_loss = running_loss / num_batches if num_batches > 0 else 0
        train_preds = torch.tensor(all_predictions)
        train_lbls = torch.tensor(all_labels)
        train_metrics = compute_metrics(train_preds, train_lbls)

        # ---- VALIDATION PHASE ----
        model.eval()
        print(f"         - Evaluating on validation set...")

        with torch.no_grad():
            outputs = model(val_images)
            _, predicted = torch.max(outputs, 1)
            val_metrics = compute_metrics(predicted, val_labels)

        # Print epoch summary
        print(f"  Training Loss: {train_loss:.4f}")
        print(f"  Training - Acc: {train_metrics['accuracy']:.1f}% | "
              f"Lily Recall: {train_metrics['lily_recall']:.1f}% | "
              f"Lily Precision: {train_metrics['lily_precision']:.1f}%")
        print(f"  Validation - Acc: {val_metrics['accuracy']:.1f}% | "
              f"Lily Recall: {val_metrics['tp']}/{val_metrics['lily_total']} ({val_metrics['lily_recall']:.1f}%) | "
              f"Lily Precision: {val_metrics['lily_precision']:.1f}%")

        # Warning if no lilies in validation
        if val_metrics['lily_total'] == 0:
            print("  ⚠ WARNING: No lily samples in validation set!")

        print()

    print("=" * 60)
    print("Training complete!")
    print()

    return model, (val_images, val_labels)


# ============================================================
# EVALUATION
# ============================================================

def evaluate_model(model, val_data):
    """
    Final evaluation of the trained model.

    Computes detailed metrics including:
    - Overall accuracy
    - Lily recall (how many lilies were correctly identified)
    - Lily precision (how many lily predictions were correct)

    Args:
        model: Trained CNN model
        val_data: Tuple of (val_images, val_labels)
    """
    print("Final Evaluation on Validation Set...")
    print("=" * 60)

    val_images, val_labels = val_data
    model.eval()

    with torch.no_grad():
        outputs = model(val_images)
        _, predicted = torch.max(outputs, 1)
        metrics = compute_metrics(predicted, val_labels)

    print(f"Overall Accuracy: {metrics['accuracy']:.2f}%")
    print()
    print("Confusion Matrix:")
    print(f"  True Positives (lily→lily):     {metrics['tp']}")
    print(f"  False Positives (other→lily):   {metrics['fp']}")
    print(f"  False Negatives (lily→other):   {metrics['fn']}")
    print(f"  True Negatives (other→other):   {metrics['tn']}")
    print()
    print(f"Lily Recall: {metrics['lily_recall']:.2f}% ({metrics['tp']}/{metrics['lily_total']} lilies detected)")
    print(f"Lily Precision: {metrics['lily_precision']:.2f}%")
    print("=" * 60)
    print()

    return metrics


# ============================================================
# MAIN
# ============================================================

def main():
    """
    Main entry point.

    1. Load streaming dataset
    2. Build CNN model
    3. Train on balanced streamed data
    4. Evaluate final performance
    """
    print()
    print("=" * 60)
    print("   LILY CNN CLASSIFIER - STREAMING VERSION")
    print("   Learning from streamed image data")
    print("   With balanced sampling for rare lily classes")
    print("=" * 60)
    print()

    # Set random seed for reproducibility
    random.seed(42)
    torch.manual_seed(42)

    # Step 1: Connect to streaming dataset
    train_stream, val_stream = load_streaming_dataset()

    # Step 2: Build model
    model = build_model()

    # Step 3: Train on balanced streamed data
    model, val_data = train_model(model, train_stream, val_stream)

    # Step 4: Final evaluation
    metrics = evaluate_model(model, val_data)

    # Summary with honest assessment
    print("TRAINING COMPLETE!")
    print()

    if metrics['lily_recall'] > 0:
        print(f"The model learned to detect lily flowers!")
        print(f"  - Correctly identified {metrics['tp']} out of {metrics['lily_total']} lilies")
        print(f"  - Lily recall: {metrics['lily_recall']:.1f}%")
    else:
        print("⚠ WARNING: The model did not learn to detect lilies (recall = 0%)")
        print("  Consider: more epochs, different learning rate, or more training data")

    print()
    print("Images were streamed directly from the internet.")
    print("No local dataset storage was used.")
    print()


if __name__ == "__main__":
    main()
