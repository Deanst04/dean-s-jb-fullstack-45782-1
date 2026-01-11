"""
Finger Counter GUI Application
==============================

A PySide6-based desktop application for real-time finger counting using
computer vision (OpenCV + MediaPipe).

Requirements:
    pip install PySide6 opencv-python mediapipe pyttsx3

    Or install from requirements.txt:
    pip install -r requirements.txt

How to run:
    python finger_counter_gui.py

Architecture:
    - CameraWorker (QThread): Handles camera capture & MediaPipe processing
    - TTSManager: Handles text-to-speech with state tracking
    - MainWindow (QMainWindow): UI rendering & user interaction

Features:
    - Live camera preview in GUI window
    - Real-time finger count display (0-5)
    - Optional TTS that announces count changes
    - Mirror mode toggle (default: ON)
    - Clean resource management on exit
"""

import sys
from typing import Optional

import cv2
import mediapipe as mp
import numpy as np
import pyttsx3
from PySide6.QtCore import Qt, QThread, Signal, Slot, QSize
from PySide6.QtGui import QImage, QPixmap, QCloseEvent, QPalette, QColor, QFont
from PySide6.QtWidgets import (
    QApplication,
    QCheckBox,
    QFrame,
    QHBoxLayout,
    QLabel,
    QMainWindow,
    QPushButton,
    QSizePolicy,
    QVBoxLayout,
    QWidget,
)


# =============================================================================
# CONSTANTS
# =============================================================================

# Camera settings
DEFAULT_CAMERA_INDEX = 0
FRAME_WIDTH = 1280
FRAME_HEIGHT = 720

# MediaPipe detection thresholds
DETECTION_CONFIDENCE = 0.7
TRACKING_CONFIDENCE = 0.5
MAX_HANDS = 1

# UI Constants
WINDOW_TITLE = "Finger Counter"
MIN_WINDOW_WIDTH = 900
MIN_WINDOW_HEIGHT = 700

# Theme Colors (cohesive dark theme palette)
class Colors:
    """Centralized color definitions for consistent theming."""
    BACKGROUND = "#1e1e1e"
    SURFACE = "#2d2d2d"
    SURFACE_LIGHT = "#3d3d3d"
    BORDER = "#404040"

    TEXT_PRIMARY = "#ffffff"
    TEXT_SECONDARY = "#b0b0b0"
    TEXT_MUTED = "#808080"

    ACCENT_PRIMARY = "#4a9eff"      # Blue - for active/selected states
    ACCENT_SUCCESS = "#4ade80"      # Green - for finger count
    ACCENT_DANGER = "#ef4444"       # Red - for quit button
    ACCENT_DANGER_HOVER = "#f87171"

    PREVIEW_BACKGROUND = "#0d0d0d"  # Near-black for camera preview


# =============================================================================
# HAND LANDMARKS (from original implementation - DO NOT MODIFY)
# =============================================================================

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


# =============================================================================
# FINGER COUNTING LOGIC (from original implementation - DO NOT MODIFY)
# =============================================================================

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


# =============================================================================
# TTS MANAGER
# =============================================================================

class TTSManager:
    """
    Manages text-to-speech functionality with state tracking.

    This class encapsulates pyttsx3 and tracks the last spoken count
    to prevent repeated announcements of the same number.

    Design decisions:
        - TTS engine is initialized lazily on first speech request
        - Uses a separate state variable to track what was last spoken
        - Does NOT speak on initialization (no startup sound)
    """

    def __init__(self):
        self._engine: Optional[pyttsx3.Engine] = None
        self._last_spoken_count: Optional[int] = None
        self._enabled = False

    def _ensure_engine(self) -> pyttsx3.Engine:
        """Lazily initialize the TTS engine on first use."""
        if self._engine is None:
            self._engine = pyttsx3.init()
            self._engine.setProperty('rate', 150)  # Moderate speaking speed
        return self._engine

    @property
    def enabled(self) -> bool:
        return self._enabled

    @enabled.setter
    def enabled(self, value: bool) -> None:
        self._enabled = value
        # Reset last spoken count when disabling to ensure fresh announcement
        # when re-enabling while showing the same count
        if not value:
            self._last_spoken_count = None

    def speak_count(self, count: int) -> None:
        """
        Speak the finger count if enabled and count has changed.

        Args:
            count: The current finger count (0-5)
        """
        if not self._enabled:
            return

        # Only speak if the count has changed from what was last spoken
        if count == self._last_spoken_count:
            return

        self._last_spoken_count = count
        engine = self._ensure_engine()

        engine.say(str(count))
        # runAndWait blocks briefly but is acceptable for single words
        engine.runAndWait()

    def cleanup(self) -> None:
        """Clean up TTS resources."""
        if self._engine is not None:
            self._engine.stop()
            self._engine = None


# =============================================================================
# CAMERA WORKER (QThread)
# =============================================================================

class CameraWorker(QThread):
    """
    Background thread for camera capture and MediaPipe hand detection.

    This worker runs in a separate thread to prevent blocking the UI.
    It emits signals for frame updates and finger count changes.

    Signals:
        frame_ready (QImage): Emitted when a new frame is ready for display
        finger_count_changed (int): Emitted when a new finger count is detected

    Why QThread instead of threading.Thread:
        - Native Qt signal/slot mechanism for thread-safe UI updates
        - Automatic cleanup integration with Qt event loop
        - Cleaner resource management with Qt's parent-child relationship
    """

    # Signals for communicating with the main thread
    frame_ready = Signal(QImage)
    finger_count_changed = Signal(int)

    def __init__(self, camera_index: int = DEFAULT_CAMERA_INDEX, parent=None):
        super().__init__(parent)
        self._camera_index = camera_index
        self._running = False
        self._mirror_mode = True

        # MediaPipe components (initialized in run() to stay in worker thread)
        self._hands = None
        self._mp_drawing = None
        self._mp_drawing_styles = None
        self._mp_hands = None

        # Camera capture object
        self._cap: Optional[cv2.VideoCapture] = None

    @property
    def mirror_mode(self) -> bool:
        return self._mirror_mode

    @mirror_mode.setter
    def mirror_mode(self, value: bool) -> None:
        self._mirror_mode = value

    def _initialize_mediapipe(self) -> None:
        """
        Initialize MediaPipe Hands detector.

        IMPORTANT: Uses mp.solutions.hands (NOT mediapipe.tasks)
        This is a critical constraint - do not switch to tasks API.
        """
        self._mp_hands = mp.solutions.hands
        self._mp_drawing = mp.solutions.drawing_utils
        self._mp_drawing_styles = mp.solutions.drawing_styles

        self._hands = self._mp_hands.Hands(
            static_image_mode=False,  # Video mode for better performance
            max_num_hands=MAX_HANDS,
            min_detection_confidence=DETECTION_CONFIDENCE,
            min_tracking_confidence=TRACKING_CONFIDENCE
        )

    def _draw_hand_landmarks(self, frame, hand_landmarks) -> None:
        """Draw hand landmarks and connections on the frame."""
        self._mp_drawing.draw_landmarks(
            frame,
            hand_landmarks,
            self._mp_hands.HAND_CONNECTIONS,
            self._mp_drawing_styles.get_default_hand_landmarks_style(),
            self._mp_drawing_styles.get_default_hand_connections_style()
        )

    def _convert_frame_to_qimage(self, frame: np.ndarray) -> QImage:
        """
        Convert OpenCV BGR frame to QImage for Qt display.

        OpenCV uses BGR color order, while Qt expects RGB.
        """
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        height, width, channels = rgb_frame.shape
        bytes_per_line = channels * width

        # Create QImage from numpy array; .copy() ensures Qt owns the data
        return QImage(
            rgb_frame.data,
            width,
            height,
            bytes_per_line,
            QImage.Format.Format_RGB888
        ).copy()

    def run(self) -> None:
        """
        Main worker loop - runs in separate thread.

        Captures frames, processes with MediaPipe, and emits signals.
        """
        self._running = True

        # Initialize camera
        self._cap = cv2.VideoCapture(self._camera_index)

        if not self._cap.isOpened():
            print(f"Error: Could not open camera {self._camera_index}")
            return

        # Set camera resolution for optimal quality/performance balance
        self._cap.set(cv2.CAP_PROP_FRAME_WIDTH, FRAME_WIDTH)
        self._cap.set(cv2.CAP_PROP_FRAME_HEIGHT, FRAME_HEIGHT)

        # Initialize MediaPipe (must be in worker thread)
        self._initialize_mediapipe()

        # Track previous finger count to only emit on changes
        previous_count: Optional[int] = None

        while self._running:
            success, frame = self._cap.read()

            if not success:
                continue

            # Apply mirror mode if enabled (more intuitive for users)
            if self._mirror_mode:
                frame = cv2.flip(frame, 1)

            # Convert to RGB for MediaPipe processing
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

            # Setting writeable=False improves MediaPipe performance
            rgb_frame.flags.writeable = False
            results = self._hands.process(rgb_frame)
            rgb_frame.flags.writeable = True

            # Default to 0 when no hand is detected
            finger_count = 0

            # Process detected hands
            if results.multi_hand_landmarks and results.multi_handedness:
                for hand_landmarks, handedness_info in zip(
                    results.multi_hand_landmarks,
                    results.multi_handedness
                ):
                    handedness = handedness_info.classification[0].label

                    # In mirror mode, handedness label is inverted
                    if self._mirror_mode:
                        handedness = "Left" if handedness == "Right" else "Right"

                    # Count fingers using the original logic (DO NOT MODIFY)
                    finger_count = count_raised_fingers(hand_landmarks, handedness)

                    # Draw landmarks overlay on the frame
                    self._draw_hand_landmarks(frame, hand_landmarks)

            # Emit finger count only when it changes (reduces signal noise)
            if finger_count != previous_count:
                self.finger_count_changed.emit(finger_count)
                previous_count = finger_count

            # Convert and emit frame for display
            qimage = self._convert_frame_to_qimage(frame)
            self.frame_ready.emit(qimage)

            # ~30 FPS to balance smoothness and CPU usage
            self.msleep(33)

        self._cleanup()

    def stop(self) -> None:
        """Signal the worker to stop processing."""
        self._running = False

    def _cleanup(self) -> None:
        """Release camera and MediaPipe resources."""
        if self._hands is not None:
            self._hands.close()
            self._hands = None

        if self._cap is not None:
            self._cap.release()
            self._cap = None


# =============================================================================
# MAIN WINDOW
# =============================================================================

class MainWindow(QMainWindow):
    """
    Main application window with camera preview and controls.

    Layout Structure:
        ┌─────────────────────────────────────────────────┐
        │                                                 │
        │           Camera Preview (dominant)             │
        │                                                 │
        ├─────────────────────────────────────────────────┤
        │  ┌─────────┐                                    │
        │  │    0    │   Fingers Detected                 │
        │  └─────────┘                                    │
        ├─────────────────────────────────────────────────┤
        │  [Mirror: ON]     [x] Speak Count     [ Quit ]  │
        └─────────────────────────────────────────────────┘

    Uses Qt layouts for proper resizing behavior.
    """

    def __init__(self):
        super().__init__()

        self._tts_manager = TTSManager()
        self._camera_worker: Optional[CameraWorker] = None

        self._setup_ui()
        self._apply_dark_theme()
        self._setup_camera_worker()

    def _apply_dark_theme(self) -> None:
        """
        Apply a cohesive dark theme using QPalette.

        Using QPalette ensures consistent styling across all widgets
        without needing extensive per-widget stylesheets.
        """
        palette = QPalette()

        # Window and base colors
        palette.setColor(QPalette.ColorRole.Window, QColor(Colors.BACKGROUND))
        palette.setColor(QPalette.ColorRole.WindowText, QColor(Colors.TEXT_PRIMARY))
        palette.setColor(QPalette.ColorRole.Base, QColor(Colors.SURFACE))
        palette.setColor(QPalette.ColorRole.AlternateBase, QColor(Colors.SURFACE_LIGHT))

        # Text colors
        palette.setColor(QPalette.ColorRole.Text, QColor(Colors.TEXT_PRIMARY))
        palette.setColor(QPalette.ColorRole.BrightText, QColor(Colors.TEXT_PRIMARY))
        palette.setColor(QPalette.ColorRole.PlaceholderText, QColor(Colors.TEXT_MUTED))

        # Button colors
        palette.setColor(QPalette.ColorRole.Button, QColor(Colors.SURFACE))
        palette.setColor(QPalette.ColorRole.ButtonText, QColor(Colors.TEXT_PRIMARY))

        # Highlight colors
        palette.setColor(QPalette.ColorRole.Highlight, QColor(Colors.ACCENT_PRIMARY))
        palette.setColor(QPalette.ColorRole.HighlightedText, QColor(Colors.TEXT_PRIMARY))

        # Link colors
        palette.setColor(QPalette.ColorRole.Link, QColor(Colors.ACCENT_PRIMARY))

        QApplication.instance().setPalette(palette)

    def _setup_ui(self) -> None:
        """Initialize the user interface with proper visual hierarchy."""
        self.setWindowTitle(WINDOW_TITLE)
        self.setMinimumSize(MIN_WINDOW_WIDTH, MIN_WINDOW_HEIGHT)

        # Central widget with main vertical layout
        central_widget = QWidget()
        self.setCentralWidget(central_widget)

        main_layout = QVBoxLayout(central_widget)
        main_layout.setContentsMargins(16, 16, 16, 16)  # Consistent outer padding
        main_layout.setSpacing(12)

        # --- Camera Preview (visually dominant) ---
        self._preview_label = self._create_preview_widget()
        main_layout.addWidget(self._preview_label, stretch=1)  # stretch=1 makes it expand

        # --- Finger Count Display ---
        count_widget = self._create_count_display()
        main_layout.addWidget(count_widget)

        # --- Control Bar ---
        control_bar = self._create_control_bar()
        main_layout.addLayout(control_bar)

    def _create_preview_widget(self) -> QLabel:
        """
        Create the camera preview widget.

        Uses a QLabel with specific styling to create a defined preview area
        that maintains visual prominence.
        """
        preview = QLabel()
        preview.setAlignment(Qt.AlignmentFlag.AlignCenter)
        preview.setMinimumSize(640, 480)

        # Allow the preview to expand but maintain aspect ratio content
        preview.setSizePolicy(
            QSizePolicy.Policy.Expanding,
            QSizePolicy.Policy.Expanding
        )

        # Dark background with subtle border to define the preview area
        preview.setStyleSheet(f"""
            QLabel {{
                background-color: {Colors.PREVIEW_BACKGROUND};
                border: 2px solid {Colors.BORDER};
                border-radius: 8px;
            }}
        """)

        # Placeholder text shown before camera starts
        preview.setText("Starting camera...")
        preview.setFont(QFont("sans-serif", 14))

        return preview

    def _create_count_display(self) -> QWidget:
        """
        Create the finger count display section.

        Features a large, prominent number with a descriptive label
        for clear visual hierarchy.
        """
        container = QWidget()
        layout = QHBoxLayout(container)
        layout.setContentsMargins(8, 8, 8, 8)
        layout.setSpacing(16)

        # Large finger count number - the primary information
        self._count_label = QLabel("0")
        self._count_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self._count_label.setFixedSize(80, 80)
        self._count_label.setStyleSheet(f"""
            QLabel {{
                font-size: 48px;
                font-weight: bold;
                color: {Colors.ACCENT_SUCCESS};
                background-color: {Colors.SURFACE};
                border: 2px solid {Colors.BORDER};
                border-radius: 12px;
            }}
        """)
        layout.addWidget(self._count_label)

        # Descriptive label
        description_label = QLabel("Fingers\nDetected")
        description_label.setStyleSheet(f"""
            QLabel {{
                font-size: 16px;
                color: {Colors.TEXT_SECONDARY};
                font-weight: 500;
            }}
        """)
        layout.addWidget(description_label)

        layout.addStretch()  # Push content to the left

        return container

    def _create_control_bar(self) -> QHBoxLayout:
        """
        Create the bottom control bar with mirror toggle, sound option, and quit.

        Controls are logically grouped: view settings on left, exit on right.
        """
        layout = QHBoxLayout()
        layout.setSpacing(12)

        # --- Mirror Mode Toggle ---
        self._mirror_button = QPushButton()
        self._mirror_button.setCheckable(True)
        self._mirror_button.setChecked(True)
        self._mirror_button.clicked.connect(self._on_mirror_toggled)
        self._mirror_button.setToolTip(
            "Mirror mode makes the preview act like a mirror.\n"
            "Turn OFF to see the raw camera view."
        )
        self._update_mirror_button_text()  # Set initial text
        self._mirror_button.setStyleSheet(f"""
            QPushButton {{
                font-size: 13px;
                font-weight: 500;
                padding: 10px 20px;
                border-radius: 6px;
                background-color: {Colors.SURFACE};
                border: 1px solid {Colors.BORDER};
            }}
            QPushButton:hover {{
                background-color: {Colors.SURFACE_LIGHT};
            }}
            QPushButton:checked {{
                background-color: {Colors.ACCENT_PRIMARY};
                border-color: {Colors.ACCENT_PRIMARY};
            }}
            QPushButton:checked:hover {{
                background-color: #5aabff;
            }}
        """)
        layout.addWidget(self._mirror_button)

        # --- Sound Toggle Checkbox ---
        self._sound_checkbox = QCheckBox("Speak Count")
        self._sound_checkbox.setChecked(False)  # Sound OFF by default (no autoplay)
        self._sound_checkbox.stateChanged.connect(self._on_sound_toggled)
        self._sound_checkbox.setToolTip(
            "When enabled, the app will announce the finger count\n"
            "each time it changes (uses text-to-speech)."
        )
        self._sound_checkbox.setStyleSheet(f"""
            QCheckBox {{
                font-size: 13px;
                padding: 8px 12px;
                spacing: 8px;
            }}
            QCheckBox::indicator {{
                width: 18px;
                height: 18px;
                border-radius: 4px;
                border: 2px solid {Colors.BORDER};
                background-color: {Colors.SURFACE};
            }}
            QCheckBox::indicator:checked {{
                background-color: {Colors.ACCENT_PRIMARY};
                border-color: {Colors.ACCENT_PRIMARY};
            }}
            QCheckBox::indicator:hover {{
                border-color: {Colors.TEXT_SECONDARY};
            }}
        """)
        layout.addWidget(self._sound_checkbox)

        layout.addStretch()  # Push quit button to the right

        # --- Quit Button ---
        quit_button = QPushButton("Quit")
        quit_button.clicked.connect(self.close)
        quit_button.setToolTip("Close the application")
        quit_button.setStyleSheet(f"""
            QPushButton {{
                font-size: 13px;
                font-weight: 500;
                padding: 10px 24px;
                border-radius: 6px;
                background-color: {Colors.ACCENT_DANGER};
                color: {Colors.TEXT_PRIMARY};
                border: none;
            }}
            QPushButton:hover {{
                background-color: {Colors.ACCENT_DANGER_HOVER};
            }}
            QPushButton:pressed {{
                background-color: #dc2626;
            }}
        """)
        layout.addWidget(quit_button)

        return layout

    def _update_mirror_button_text(self) -> None:
        """Update mirror button text to clearly show current state."""
        is_on = self._mirror_button.isChecked()
        # Using visual indicator (checkmark/cross) for immediate clarity
        self._mirror_button.setText(f"Mirror: {'ON' if is_on else 'OFF'}")

    def _setup_camera_worker(self) -> None:
        """Initialize and start the camera worker thread."""
        self._camera_worker = CameraWorker(camera_index=DEFAULT_CAMERA_INDEX)

        # Connect signals to slots
        self._camera_worker.frame_ready.connect(self._on_frame_ready)
        self._camera_worker.finger_count_changed.connect(self._on_finger_count_changed)

        # Start the worker thread
        self._camera_worker.start()

    @Slot(QImage)
    def _on_frame_ready(self, image: QImage) -> None:
        """
        Handle new frame from camera worker.

        Scales the image to fit the preview label while maintaining aspect ratio.
        """
        pixmap = QPixmap.fromImage(image)

        # Scale to fit while keeping aspect ratio for natural appearance
        scaled_pixmap = pixmap.scaled(
            self._preview_label.size(),
            Qt.AspectRatioMode.KeepAspectRatio,
            Qt.TransformationMode.SmoothTransformation
        )
        self._preview_label.setPixmap(scaled_pixmap)

    @Slot(int)
    def _on_finger_count_changed(self, count: int) -> None:
        """
        Handle finger count updates from camera worker.

        Updates the UI label and triggers TTS if enabled.
        """
        self._count_label.setText(str(count))

        # TTS will only speak if enabled AND count changed
        # (TTSManager handles the change detection internally)
        self._tts_manager.speak_count(count)

    @Slot()
    def _on_sound_toggled(self) -> None:
        """Handle sound checkbox state changes."""
        self._tts_manager.enabled = self._sound_checkbox.isChecked()

    @Slot()
    def _on_mirror_toggled(self) -> None:
        """Handle mirror mode button clicks."""
        self._update_mirror_button_text()

        if self._camera_worker:
            self._camera_worker.mirror_mode = self._mirror_button.isChecked()

    def closeEvent(self, event: QCloseEvent) -> None:
        """
        Handle window close event.

        Ensures proper cleanup of camera worker and TTS resources.
        This is critical to prevent resource leaks and camera lockup.
        """
        # Stop camera worker gracefully
        if self._camera_worker is not None:
            self._camera_worker.stop()
            # Wait for thread to finish (with timeout to prevent hanging)
            if not self._camera_worker.wait(3000):  # 3 second timeout
                print("Warning: Camera worker did not stop cleanly")
                self._camera_worker.terminate()

        # Cleanup TTS resources
        self._tts_manager.cleanup()

        event.accept()


# =============================================================================
# APPLICATION ENTRY POINT
# =============================================================================

def main():
    """Application entry point."""
    app = QApplication(sys.argv)

    # Fusion style provides a consistent cross-platform look
    app.setStyle("Fusion")

    # Set application font for consistency
    font = app.font()
    font.setFamily("Segoe UI, SF Pro Display, Helvetica Neue, sans-serif")
    app.setFont(font)

    window = MainWindow()
    window.show()

    sys.exit(app.exec())


if __name__ == "__main__":
    main()
