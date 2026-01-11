"""
Finger Counter Application
==========================

A real-time finger counting application using computer vision.

Requirements:
    pip install opencv-python mediapipe

How to run:
    python finger_counter.py

Controls:
    - Press 'q' to quit the application
    - Press 'm' to toggle mirror mode (default: on)
"""

import cv2
import mediapipe as mp
from typing import Optional


# MediaPipe Hand Landmark indices
# Each finger has 4 landmarks: MCP (base), PIP, DIP, and TIP
# We use TIP and PIP to determine if a finger is raised
class HandLandmarks:
    """Constants for MediaPipe hand landmark indices."""
    WRIST = 0

    # Thumb landmarks
    THUMB_CMC = 1
    THUMB_MCP = 2
    THUMB_IP = 3
    THUMB_TIP = 4

    # Index finger landmarks
    INDEX_MCP = 5
    INDEX_PIP = 6
    INDEX_DIP = 7
    INDEX_TIP = 8

    # Middle finger landmarks
    MIDDLE_MCP = 9
    MIDDLE_PIP = 10
    MIDDLE_DIP = 11
    MIDDLE_TIP = 12

    # Ring finger landmarks
    RING_MCP = 13
    RING_PIP = 14
    RING_DIP = 15
    RING_TIP = 16

    # Pinky finger landmarks
    PINKY_MCP = 17
    PINKY_PIP = 18
    PINKY_DIP = 19
    PINKY_TIP = 20


def initialize_hand_detector(
    max_hands: int = 1,
    detection_confidence: float = 0.7,
    tracking_confidence: float = 0.5
) -> tuple:
    """
    Initialize the MediaPipe Hands detector.

    Args:
        max_hands: Maximum number of hands to detect
        detection_confidence: Minimum confidence for hand detection
        tracking_confidence: Minimum confidence for hand tracking

    Returns:
        Tuple of (hands detector, drawing utilities, drawing styles)
    """
    mp_hands = mp.solutions.hands
    mp_drawing = mp.solutions.drawing_utils
    mp_drawing_styles = mp.solutions.drawing_styles

    hands = mp_hands.Hands(
        static_image_mode=False,  # Video mode for better performance
        max_num_hands=max_hands,
        min_detection_confidence=detection_confidence,
        min_tracking_confidence=tracking_confidence
    )

    return hands, mp_drawing, mp_drawing_styles, mp_hands


def count_raised_fingers(hand_landmarks, handedness: str) -> int:
    """
    Count the number of raised fingers on a detected hand.

    The finger counting logic works as follows:

    For fingers (index, middle, ring, pinky):
        - A finger is considered "raised" if its TIP is above its PIP joint
        - In image coordinates, "above" means a SMALLER y-value
        - So: if tip.y < pip.y, the finger is raised

    For the thumb:
        - The thumb moves sideways, not up/down like other fingers
        - We compare the TIP x-position to the IP joint x-position
        - For a RIGHT hand: thumb is raised if tip.x < ip.x (tip is to the left)
        - For a LEFT hand: thumb is raised if tip.x > ip.x (tip is to the right)
        - This accounts for the natural sideways extension of the thumb

    Args:
        hand_landmarks: MediaPipe hand landmarks object
        handedness: "Left" or "Right" indicating which hand

    Returns:
        Number of raised fingers (0-5)
    """
    landmarks = hand_landmarks.landmark
    finger_count = 0

    # ---------------------------------------------------------------------
    # THUMB DETECTION
    # ---------------------------------------------------------------------
    # The thumb extends sideways, so we check x-coordinates instead of y
    # We compare the thumb tip position to the thumb IP (interphalangeal) joint
    thumb_tip = landmarks[HandLandmarks.THUMB_TIP]
    thumb_ip = landmarks[HandLandmarks.THUMB_IP]

    # For right hand: thumb extends to the left (smaller x when raised)
    # For left hand: thumb extends to the right (larger x when raised)
    # Note: In a mirrored view, this logic may appear inverted
    if handedness == "Right":
        # Right hand: thumb tip should be to the LEFT of IP joint when extended
        if thumb_tip.x < thumb_ip.x:
            finger_count += 1
    else:
        # Left hand: thumb tip should be to the RIGHT of IP joint when extended
        if thumb_tip.x > thumb_ip.x:
            finger_count += 1

    # ---------------------------------------------------------------------
    # FINGER DETECTION (Index, Middle, Ring, Pinky)
    # ---------------------------------------------------------------------
    # For each finger, we check if the TIP is above the PIP joint
    # "Above" in image coordinates means a smaller y-value
    #
    # Finger anatomy reminder:
    #   MCP (Metacarpophalangeal) - base knuckle
    #   PIP (Proximal Interphalangeal) - middle knuckle
    #   DIP (Distal Interphalangeal) - knuckle near tip
    #   TIP - fingertip
    #
    # When a finger is extended/raised, the tip is above the PIP joint
    # When a finger is curled/closed, the tip is below the PIP joint

    finger_tips = [
        HandLandmarks.INDEX_TIP,
        HandLandmarks.MIDDLE_TIP,
        HandLandmarks.RING_TIP,
        HandLandmarks.PINKY_TIP
    ]

    finger_pips = [
        HandLandmarks.INDEX_PIP,
        HandLandmarks.MIDDLE_PIP,
        HandLandmarks.RING_PIP,
        HandLandmarks.PINKY_PIP
    ]

    for tip_idx, pip_idx in zip(finger_tips, finger_pips):
        tip = landmarks[tip_idx]
        pip = landmarks[pip_idx]

        # If the tip is above the PIP (smaller y-value), finger is raised
        if tip.y < pip.y:
            finger_count += 1

    return finger_count


def draw_finger_count(frame, count: int, position: tuple = (50, 100)) -> None:
    """
    Draw the finger count on the frame with a background for visibility.

    Args:
        frame: OpenCV image frame
        count: Number of fingers to display
        position: (x, y) position for the text
    """
    text = f"Fingers: {count}"
    font = cv2.FONT_HERSHEY_SIMPLEX
    font_scale = 2
    thickness = 3

    # Get text size for background rectangle
    (text_width, text_height), baseline = cv2.getTextSize(
        text, font, font_scale, thickness
    )

    # Draw semi-transparent background
    x, y = position
    padding = 15
    cv2.rectangle(
        frame,
        (x - padding, y - text_height - padding),
        (x + text_width + padding, y + baseline + padding),
        (0, 0, 0),  # Black background
        -1  # Filled rectangle
    )

    # Draw the text
    cv2.putText(
        frame,
        text,
        position,
        font,
        font_scale,
        (0, 255, 0),  # Green color
        thickness,
        cv2.LINE_AA
    )


def draw_hand_landmarks(
    frame,
    hand_landmarks,
    mp_drawing,
    mp_drawing_styles,
    mp_hands
) -> None:
    """
    Draw hand landmarks and connections on the frame.

    Args:
        frame: OpenCV image frame
        hand_landmarks: MediaPipe hand landmarks
        mp_drawing: MediaPipe drawing utilities
        mp_drawing_styles: MediaPipe drawing styles
        mp_hands: MediaPipe hands module
    """
    mp_drawing.draw_landmarks(
        frame,
        hand_landmarks,
        mp_hands.HAND_CONNECTIONS,
        mp_drawing_styles.get_default_hand_landmarks_style(),
        mp_drawing_styles.get_default_hand_connections_style()
    )


def draw_instructions(frame, mirror_mode: bool) -> None:
    """Draw usage instructions on the frame."""
    instructions = [
        "Press 'q' to quit",
        f"Press 'm' to toggle mirror (currently: {'ON' if mirror_mode else 'OFF'})"
    ]

    y_offset = frame.shape[0] - 60
    for instruction in instructions:
        cv2.putText(
            frame,
            instruction,
            (10, y_offset),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            (255, 255, 255),
            1,
            cv2.LINE_AA
        )
        y_offset += 25


def main():
    """Main function to run the finger counting application."""
    # Initialize webcam
    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("Error: Could not open webcam")
        return

    # Set camera resolution (optional, may improve performance)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

    # Initialize hand detector
    hands, mp_drawing, mp_drawing_styles, mp_hands = initialize_hand_detector()

    # Mirror mode makes the display more intuitive (like looking in a mirror)
    mirror_mode = True

    print("Finger Counter Started!")
    print("- Show your hand to the camera")
    print("- Press 'q' to quit")
    print("- Press 'm' to toggle mirror mode")

    while True:
        # Read frame from webcam
        success, frame = cap.read()

        if not success:
            print("Error: Failed to read from webcam")
            break

        # Mirror the frame if mirror mode is enabled
        if mirror_mode:
            frame = cv2.flip(frame, 1)

        # Convert BGR (OpenCV) to RGB (MediaPipe)
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # Process the frame for hand detection
        # Mark frame as not writeable to improve performance
        rgb_frame.flags.writeable = False
        results = hands.process(rgb_frame)
        rgb_frame.flags.writeable = True

        # Default finger count when no hand is detected
        finger_count = 0

        # If hands are detected, process them
        if results.multi_hand_landmarks and results.multi_handedness:
            for hand_landmarks, handedness_info in zip(
                results.multi_hand_landmarks,
                results.multi_handedness
            ):
                # Get handedness (Left or Right)
                # Note: MediaPipe reports handedness as if looking at the hand
                # In mirror mode, left/right may appear swapped visually
                handedness = handedness_info.classification[0].label

                # In mirror mode, the handedness label is inverted
                # (what looks like right hand is actually left and vice versa)
                if mirror_mode:
                    handedness = "Left" if handedness == "Right" else "Right"

                # Count raised fingers
                finger_count = count_raised_fingers(hand_landmarks, handedness)

                # Draw hand landmarks on the frame
                draw_hand_landmarks(
                    frame,
                    hand_landmarks,
                    mp_drawing,
                    mp_drawing_styles,
                    mp_hands
                )

        # Draw the finger count overlay
        draw_finger_count(frame, finger_count)

        # Draw instructions
        draw_instructions(frame, mirror_mode)

        # Display the frame
        cv2.imshow("Finger Counter", frame)

        # Handle keyboard input
        key = cv2.waitKey(1) & 0xFF

        if key == ord('q'):
            print("Quitting...")
            break
        elif key == ord('m'):
            mirror_mode = not mirror_mode
            print(f"Mirror mode: {'ON' if mirror_mode else 'OFF'}")

    # Cleanup
    hands.close()
    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
