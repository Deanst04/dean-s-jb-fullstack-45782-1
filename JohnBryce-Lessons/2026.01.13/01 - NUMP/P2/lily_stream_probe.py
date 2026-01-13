"""
Lily Stream Probe
=================
A diagnostic script to explore the Hugging Face dataset
"nelorth/oxford-flowers" and understand how Lily flowers are labeled.

This script does NOT train any model.
It only inspects and reports on the dataset structure.
"""

from datasets import load_dataset
from collections import Counter


# ============================================================
# CONFIGURATION
# ============================================================

DATASET_NAME = "nelorth/oxford-flowers"
SAMPLES_TO_SCAN = 2000


# ============================================================
# KNOWN FLOWER NAMES (Oxford Flowers 102)
# ============================================================

# The Oxford Flowers 102 dataset has these flower names
# Index corresponds to label ID (0-101)
FLOWER_NAMES = [
    "pink primrose", "hard-leaved pocket orchid", "canterbury bells",
    "sweet pea", "english marigold", "tiger lily", "moon orchid",
    "bird of paradise", "monkshood", "globe thistle", "snapdragon",
    "colt's foot", "king protea", "spear thistle", "yellow iris",
    "globe-flower", "purple coneflower", "peruvian lily", "balloon flower",
    "giant white arum lily", "fire lily", "pincushion flower", "fritillary",
    "red ginger", "grape hyacinth", "corn poppy", "prince of wales feathers",
    "stemless gentian", "artichoke", "sweet william", "carnation",
    "garden phlox", "love in the mist", "mexican aster", "alpine sea holly",
    "ruby-lipped cattleya", "cape flower", "great masterwort", "siam tulip",
    "lenten rose", "barbeton daisy", "daffodil", "sword lily", "poinsettia",
    "bolero deep blue", "wallflower", "marigold", "buttercup", "oxeye daisy",
    "common dandelion", "petunia", "wild pansy", "primula", "sunflower",
    "pelargonium", "bishop of llandaff", "gaura", "geranium", "orange dahlia",
    "pink-yellow dahlia", "cautleya spicata", "japanese anemone",
    "black-eyed susan", "silverbush", "californian poppy", "osteospermum",
    "spring crocus", "bearded iris", "windflower", "tree poppy", "gazania",
    "azalea", "water lily", "rose", "thorn apple", "morning glory",
    "passion flower", "lotus", "toad lily", "anthurium", "frangipani",
    "clematis", "hibiscus", "columbine", "desert-rose", "tree mallow",
    "magnolia", "cyclamen", "watercress", "canna lily", "hippeastrum",
    "bee balm", "ball moss", "foxglove", "bougainvillea", "camellia",
    "mallow", "mexican petunia", "bromelia", "blanket flower", "trumpet creeper",
    "blackberry lily"
]


def inspect_dataset_structure():
    """
    Connect to the dataset and inspect its structure.

    Prints:
    - Available splits
    - Sample keys (fields in each sample)
    - Dataset features/info if available
    """
    print("=" * 60)
    print("DATASET STRUCTURE INSPECTION")
    print("=" * 60)
    print()

    print(f"Connecting to: {DATASET_NAME}")
    print("Using streaming mode (no local download)")
    print()

    # Load with streaming
    dataset = load_dataset(
        DATASET_NAME,
        streaming=True,
        trust_remote_code=True
    )

    # Print available splits
    print("Available splits:")
    for split_name in dataset.keys():
        print(f"  - {split_name}")
    print()

    # Get one sample to inspect keys
    train_stream = dataset["train"]
    sample = next(iter(train_stream))

    print("Sample keys (fields):")
    for key in sample.keys():
        value = sample[key]
        value_type = type(value).__name__
        print(f"  - {key}: {value_type}")
    print()

    # Check if there are feature names/label names
    print("Checking for label information...")
    if hasattr(train_stream, 'features'):
        print(f"  Features: {train_stream.features}")
    else:
        print("  No features metadata available in streaming mode")
    print()

    return dataset


def scan_labels(dataset):
    """
    Scan samples and count label occurrences.

    Args:
        dataset: The streaming dataset

    Returns:
        label_counts: Counter with label frequencies
    """
    print("=" * 60)
    print("LABEL SCANNING")
    print("=" * 60)
    print()

    print(f"Scanning first {SAMPLES_TO_SCAN} samples...")
    print()

    train_stream = dataset["train"]
    label_counts = Counter()

    count = 0
    for sample in train_stream:
        if count >= SAMPLES_TO_SCAN:
            break

        label = sample["label"]
        label_counts[label] += 1
        count += 1

        # Progress indicator
        if count % 500 == 0:
            print(f"  Scanned {count} samples...")

    print(f"  Completed scanning {count} samples")
    print()

    # Print label distribution
    print("Label distribution (top 20):")
    print("-" * 40)
    for label_id, freq in label_counts.most_common(20):
        name = FLOWER_NAMES[label_id] if label_id < len(FLOWER_NAMES) else "unknown"
        print(f"  Label {label_id:3d}: {freq:4d} samples - {name}")
    print()

    return label_counts


def detect_lily_labels():
    """
    Search through flower names to find all lily-related labels.

    Prints all labels containing 'lily' in their name.
    """
    print("=" * 60)
    print("LILY DETECTION")
    print("=" * 60)
    print()

    print("Searching for 'lily' in flower names...")
    print()

    lily_labels = []

    for idx, name in enumerate(FLOWER_NAMES):
        if "lily" in name.lower():
            lily_labels.append((idx, name))

    if lily_labels:
        print(f"Found {len(lily_labels)} lily-related labels:")
        print("-" * 50)
        for label_id, name in lily_labels:
            print(f"  Label {label_id:3d}: {name}")
        print()
    else:
        print("No lily-related labels found!")
        print()

    return lily_labels


def analyze_lily_samples(dataset, lily_labels):
    """
    Analyze lily samples in the dataset.

    Args:
        dataset: The streaming dataset
        lily_labels: List of (label_id, name) tuples for lily flowers
    """
    print("=" * 60)
    print("LILY SAMPLE ANALYSIS")
    print("=" * 60)
    print()

    lily_label_ids = {label_id for label_id, _ in lily_labels}

    print(f"Scanning for lily samples (labels: {sorted(lily_label_ids)})...")
    print()

    train_stream = dataset["train"]

    lily_counts = Counter()
    total_scanned = 0
    lily_images_info = []

    for sample in train_stream:
        if total_scanned >= SAMPLES_TO_SCAN:
            break

        label = sample["label"]
        total_scanned += 1

        if label in lily_label_ids:
            lily_counts[label] += 1

            # Collect info about first few lily images
            if len(lily_images_info) < 5:
                image = sample["image"]
                lily_images_info.append({
                    "label": label,
                    "name": FLOWER_NAMES[label] if label < len(FLOWER_NAMES) else "unknown",
                    "size": image.size,
                    "mode": image.mode
                })

    # Report findings
    print(f"Scanned {total_scanned} samples")
    print()

    total_lilies = sum(lily_counts.values())
    print(f"Total lily samples found: {total_lilies}")
    print()

    if lily_counts:
        print("Lily breakdown by type:")
        print("-" * 50)
        for label_id, count in lily_counts.most_common():
            name = FLOWER_NAMES[label_id] if label_id < len(FLOWER_NAMES) else "unknown"
            pct = 100 * count / total_scanned
            print(f"  Label {label_id:3d}: {count:4d} samples ({pct:.1f}%) - {name}")
        print()

    # Print sample image info
    if lily_images_info:
        print("Sample lily image properties:")
        print("-" * 50)
        for info in lily_images_info:
            print(f"  Label {info['label']}: {info['name']}")
            print(f"    Size: {info['size']}, Mode: {info['mode']}")
        print()


def print_recommendations(lily_labels, label_counts):
    """
    Print recommendations for building a lily classifier.

    Args:
        lily_labels: List of lily label tuples
        label_counts: Counter with label frequencies
    """
    print("=" * 60)
    print("RECOMMENDATIONS FOR LILY CLASSIFIER")
    print("=" * 60)
    print()

    lily_label_ids = [label_id for label_id, _ in lily_labels]

    print("Option 1: Single lily type")
    print("-" * 40)
    print("If you want to detect ONE specific lily type:")
    for label_id, name in lily_labels:
        count = label_counts.get(label_id, 0)
        print(f"  - Use label {label_id} for '{name}' ({count} samples in scan)")
    print()

    print("Option 2: All lily types combined")
    print("-" * 40)
    print("If you want to detect ANY lily flower:")
    print(f"  - Combine labels: {lily_label_ids}")
    print("  - Binary mapping:")
    print(f"    Lily (1): label in {lily_label_ids}")
    print("    Not Lily (0): all other labels")
    print()

    total_lilies = sum(label_counts.get(lid, 0) for lid in lily_label_ids)
    total_samples = sum(label_counts.values())

    print("Dataset balance warning:")
    print("-" * 40)
    print(f"  Lily samples: {total_lilies} ({100*total_lilies/total_samples:.1f}%)")
    print(f"  Other samples: {total_samples - total_lilies} ({100*(total_samples-total_lilies)/total_samples:.1f}%)")
    print()
    if total_lilies < total_samples * 0.1:
        print("  ⚠ Dataset is imbalanced! Consider:")
        print("    - Oversampling lily images")
        print("    - Using weighted loss function")
        print("    - Evaluating with recall/precision, not just accuracy")
    print()


def main():
    """
    Main entry point - run all diagnostic functions.
    """
    print()
    print("*" * 60)
    print("   LILY STREAM PROBE")
    print("   Dataset Diagnostic Tool")
    print("*" * 60)
    print()

    # Step 1: Inspect structure
    dataset = inspect_dataset_structure()

    # Step 2: Detect lily labels from known names
    lily_labels = detect_lily_labels()

    # Step 3: Scan and count labels
    label_counts = scan_labels(dataset)

    # Step 4: Analyze lily samples specifically
    # Need to reload dataset since we consumed the iterator
    dataset = load_dataset(
        DATASET_NAME,
        streaming=True,
        trust_remote_code=True
    )
    analyze_lily_samples(dataset, lily_labels)

    # Step 5: Print recommendations
    print_recommendations(lily_labels, label_counts)

    # Final summary
    print("=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print()
    print(f"Dataset: {DATASET_NAME}")
    print(f"Lily-related labels found: {len(lily_labels)}")
    for label_id, name in lily_labels:
        print(f"  - Label {label_id}: {name}")
    print()
    print("Use this information to correctly map labels")
    print("in your lily classifier training script.")
    print()


if __name__ == "__main__":
    main()
