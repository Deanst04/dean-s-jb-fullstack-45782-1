# import cv2

# for i in range(6):
#     cap = cv2.VideoCapture(i)
#     print(f"Camera {i}: {'OK' if cap.isOpened() else 'NO'}")
#     cap.release()


import cv2

INDEX_TO_TEST = 0

cap = cv2.VideoCapture(INDEX_TO_TEST)
ret, frame = cap.read()

print("Opened:", ret)

if ret:
    cv2.imshow(f"Camera {INDEX_TO_TEST}", frame)
    cv2.waitKey(0)

cap.release()
cv2.destroyAllWindows()