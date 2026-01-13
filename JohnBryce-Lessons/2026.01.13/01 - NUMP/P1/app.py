import numpy as np
# import cv2
from PIL import Image
import matplotlib.pyplot as plt

arr1 = np.full(10, 3, dtype=np.int16)
print(arr1)

arr2 = np.random.randint(0, 100, 10, dtype=np.int64)
print(arr2)

######################

img = Image.open("images/4k-image.jpg")
image = np.array(img)
print(image)

# for step in range(1, 6):
#     resized_image = image[::step, ::step, :]
#     print(f"step = {step}, shape = {resized_image.shape}")
#     output_path = f"/Users/deanstark/git/dean-s-jb-fullstack-45782-1/JohnBryce-Lessons/2026.01.13/01 - NUMP/images/resized_image_{step}.jpg"
#     output_path = cv2.imwrite(output_path, resized_image)

######################

mirror_image = image[:, ::-1, :]
Image.fromarray(mirror_image).save("images/mirror.jpg")

plt.figure(figsize=(10, 5))

plt.subplot(1, 2, 1)
plt.title("Original")
plt.imshow(image)
plt.axis("off")

plt.subplot(1, 2, 2)
plt.title("Mirror")
plt.imshow(mirror_image)
plt.axis("off")

plt.show()

######################

# Weekly Weather Table
days = np.array(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"])
temperatures = np.random.randint(15, 36, size=7)

# Print weather table
print("=" * 25)
print("   Weekly Weather Table")
print("=" * 25)
print(f"{'Day':<10} {'Temp (°C)':<10}")
print("-" * 25)
for day, temp in zip(days, temperatures):
    print(f"{day:<10} {temp:<10}")
print("=" * 25)

# Display graph
plt.figure(figsize=(10, 6))
plt.bar(days, temperatures, color="skyblue", edgecolor="navy")
plt.title("Weekly Weather - Temperature per Day")
plt.xlabel("Day")
plt.ylabel("Temperature (°C)")
for i, temp in enumerate(temperatures):
    plt.text(i, temp + 0.5, str(temp), ha="center")
plt.ylim(0, max(temperatures) + 5)
plt.grid(axis="y", linestyle="--", alpha=0.7)
plt.show()
