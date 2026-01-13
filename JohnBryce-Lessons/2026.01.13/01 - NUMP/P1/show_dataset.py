import torch
from torchvision import datasets, transforms
import matplotlib.pyplot as plt

# Transform: convert image to tensor
transform = transforms.ToTensor()

# Load CIFAR10 dataset (color images)
dataset = datasets.CIFAR10(
    root="./data",
    train=True,
    download=True,
    transform=transform
)

# Display multiple images
fig, axes = plt.subplots(2, 5, figsize=(12, 5))

for i, ax in enumerate(axes.flat):
    image, label = dataset[i]

    # Convert from [C, H, W] to [H, W, C] for matplotlib
    img = image.permute(1, 2, 0)

    ax.imshow(img)
    ax.set_title(f"Label: {label}")
    ax.axis("off")

plt.suptitle("CIFAR10 Sample Images", fontsize=16)
plt.show()