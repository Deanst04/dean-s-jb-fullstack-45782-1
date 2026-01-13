import numpy as np
import streamlit as st

# ============================================================
# GAME LOGIC
# ============================================================

def create_board():
    """Create an empty 3x3 board as a flat array of 9 cells."""
    return np.zeros(9, dtype=int)


def print_board(board):
    """Print the board in a readable format."""
    symbols = {1: "X", -1: "O", 0: "."}
    print("\n")
    for row in range(3):
        row_str = ""
        for col in range(3):
            cell = board[row * 3 + col]
            row_str += f" {symbols[cell]} "
        print(row_str)
        if row < 2:
            print("-----------")
    print("\n")


def check_winner(board):
    """
    Check if there's a winner.
    Returns: 1 if X wins, -1 if O wins, 0 if no winner yet.
    """
    # All possible winning lines (rows, columns, diagonals)
    win_lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],  # rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8],  # columns
        [0, 4, 8], [2, 4, 6]              # diagonals
    ]

    for line in win_lines:
        total = board[line[0]] + board[line[1]] + board[line[2]]
        if total == 3:
            return 1   # X wins
        if total == -3:
            return -1  # O wins

    return 0  # No winner


def check_draw(board):
    """Check if the game is a draw (no empty cells and no winner)."""
    return check_winner(board) == 0 and np.all(board != 0)


def get_valid_moves(board):
    """Return indices of empty cells (valid moves)."""
    return np.where(board == 0)[0]


def is_game_over(board):
    """Check if the game has ended."""
    return check_winner(board) != 0 or check_draw(board)


# ============================================================
# NEURAL NETWORK (Simple NumPy Implementation)
# ============================================================

class SimpleNeuralNetwork:
    """
    A very simple neural network with one hidden layer.
    Input: 9 neurons (board state)
    Hidden: 18 neurons
    Output: 9 neurons (score for each cell)
    """

    def __init__(self):
        # Initialize weights with small random values
        # Layer 1: input (9) -> hidden (18)
        self.weights1 = np.random.randn(9, 18) * 0.5
        self.bias1 = np.zeros(18)

        # Layer 2: hidden (18) -> output (9)
        self.weights2 = np.random.randn(18, 9) * 0.5
        self.bias2 = np.zeros(9)

        self.learning_rate = 0.1

    def sigmoid(self, x):
        """Sigmoid activation function."""
        return 1 / (1 + np.exp(-np.clip(x, -500, 500)))

    def sigmoid_derivative(self, x):
        """Derivative of sigmoid for backpropagation."""
        return x * (1 - x)

    def forward(self, board):
        """
        Forward pass: compute output scores for each cell.
        Returns scores between 0 and 1.
        """
        # Hidden layer
        self.hidden_input = np.dot(board, self.weights1) + self.bias1
        self.hidden_output = self.sigmoid(self.hidden_input)

        # Output layer
        self.output_input = np.dot(self.hidden_output, self.weights2) + self.bias2
        self.output = self.sigmoid(self.output_input)

        return self.output

    def train(self, board, target):
        """
        Train the network on a single example.
        board: the input board state
        target: the desired output (what move was good/bad)
        """
        # Forward pass
        output = self.forward(board)

        # Calculate error
        output_error = target - output

        # Backpropagation
        # Output layer gradient
        output_delta = output_error * self.sigmoid_derivative(output)

        # Hidden layer error and gradient
        hidden_error = np.dot(output_delta, self.weights2.T)
        hidden_delta = hidden_error * self.sigmoid_derivative(self.hidden_output)

        # Update weights and biases
        self.weights2 += self.learning_rate * np.outer(self.hidden_output, output_delta)
        self.bias2 += self.learning_rate * output_delta
        self.weights1 += self.learning_rate * np.outer(board, hidden_delta)
        self.bias1 += self.learning_rate * hidden_delta


# ============================================================
# AI DECISION MAKING
# ============================================================

def ai_choose_move(network, board, player=1):
    """
    Use the neural network to choose the best valid move.
    player: 1 for X (AI), -1 for O
    """
    # Get network scores for all cells
    scores = network.forward(board * player)

    # Get valid moves (empty cells)
    valid_moves = get_valid_moves(board)

    if len(valid_moves) == 0:
        return None

    # Find the valid move with the highest score
    best_move = valid_moves[0]
    best_score = scores[valid_moves[0]]

    for move in valid_moves:
        if scores[move] > best_score:
            best_score = scores[move]
            best_move = move

    return best_move


def random_move(board):
    """Choose a random valid move."""
    valid_moves = get_valid_moves(board)
    if len(valid_moves) == 0:
        return None
    return np.random.choice(valid_moves)


# ============================================================
# TRAINING
# ============================================================

def train_network(network, num_games=1000):
    """
    Train the neural network by playing games against a random opponent.
    The AI learns from wins and losses.
    """
    print(f"Training for {num_games} games...")

    wins = 0
    losses = 0
    draws = 0

    for game_num in range(num_games):
        board = create_board()

        # Store game history for learning
        ai_moves = []  # List of (board_state, move) tuples

        current_player = 1  # X starts

        while not is_game_over(board):
            if current_player == 1:
                # AI's turn (X)
                move = ai_choose_move(network, board, player=1)
                if move is not None:
                    ai_moves.append((board.copy(), move))
                    board[move] = 1
            else:
                # Random opponent's turn (O)
                move = random_move(board)
                if move is not None:
                    board[move] = -1

            current_player *= -1  # Switch player

        # Game ended - determine result
        winner = check_winner(board)

        if winner == 1:
            wins += 1
            reward = 1.0  # Good outcome
        elif winner == -1:
            losses += 1
            reward = 0.0  # Bad outcome
        else:
            draws += 1
            reward = 0.5  # Neutral outcome

        # Train on all moves from this game
        for board_state, move in ai_moves:
            # Create target: encourage the move if we won, discourage if we lost
            target = network.forward(board_state).copy()
            target[move] = reward
            network.train(board_state, target)

        # Print progress every 100 games
        if (game_num + 1) % 100 == 0:
            print(f"Games: {game_num + 1} | Wins: {wins} | Losses: {losses} | Draws: {draws}")

    print("\nTraining complete!")
    print(f"Final stats - Wins: {wins}, Losses: {losses}, Draws: {draws}")
    win_rate = wins / num_games * 100
    print(f"Win rate: {win_rate:.1f}%")

    return network


# ============================================================
# STREAMLIT WEB UI
# ============================================================

# Train the neural network once when app starts
@st.cache_resource
def get_trained_network():
    """Train and cache the neural network."""
    network = SimpleNeuralNetwork()
    network = train_network(network, num_games=1000)
    return network


def init_game_state():
    """Initialize or reset the game state."""
    if "board" not in st.session_state:
        st.session_state.board = create_board()
    if "game_over" not in st.session_state:
        st.session_state.game_over = False
    if "message" not in st.session_state:
        st.session_state.message = "Your turn! Click a cell to play."


def reset_game():
    """Reset the game to start a new one."""
    st.session_state.board = create_board()
    st.session_state.game_over = False
    st.session_state.message = "Your turn! Click a cell to play."


def make_move(cell_index, network):
    """Handle a cell click - human move followed by AI move."""
    board = st.session_state.board

    # Ignore clicks if game is over or cell is taken
    if st.session_state.game_over or board[cell_index] != 0:
        return

    # Human move (O = -1)
    board[cell_index] = -1

    # Check if human won or draw
    winner = check_winner(board)
    if winner == -1:
        st.session_state.game_over = True
        st.session_state.message = "🎉 You win! Congratulations!"
        return
    if check_draw(board):
        st.session_state.game_over = True
        st.session_state.message = "🤝 It's a draw!"
        return

    # AI move (X = 1)
    ai_move = ai_choose_move(network, board, player=1)
    if ai_move is not None:
        board[ai_move] = 1

    # Check if AI won or draw
    winner = check_winner(board)
    if winner == 1:
        st.session_state.game_over = True
        st.session_state.message = "🤖 AI wins! Better luck next time."
        return
    if check_draw(board):
        st.session_state.game_over = True
        st.session_state.message = "🤝 It's a draw!"
        return

    st.session_state.message = "Your turn! Click a cell to play."


def get_cell_display(value):
    """Get the display text for a cell."""
    if value == 1:
        return "X"
    elif value == -1:
        return "O"
    return ""


# ============================================================
# MAIN STREAMLIT APP
# ============================================================

# Page config
st.set_page_config(page_title="Tic-Tac-Toe AI", page_icon="🎮", layout="centered")

# Load trained network
network = get_trained_network()

# Initialize game state
init_game_state()

# Title
st.title("🎮 Tic-Tac-Toe")
st.markdown("**You are O** | **AI is X**")
st.markdown("---")

# Game message
if st.session_state.game_over:
    st.success(st.session_state.message)
else:
    st.info(st.session_state.message)

# Game board - 3x3 grid of buttons
board = st.session_state.board

# Custom CSS for larger buttons
st.markdown("""
<style>
div.stButton > button {
    font-size: 48px;
    height: 100px;
    width: 100px;
}
</style>
""", unsafe_allow_html=True)

# Create 3x3 grid
for row in range(3):
    cols = st.columns(3)
    for col in range(3):
        cell_index = row * 3 + col
        cell_value = board[cell_index]
        display = get_cell_display(cell_value)

        with cols[col]:
            # Button for each cell
            if st.button(
                display if display else " ",
                key=f"cell_{cell_index}",
                disabled=st.session_state.game_over or cell_value != 0
            ):
                make_move(cell_index, network)
                st.rerun()

st.markdown("---")

# New Game button
if st.button("🔄 New Game", type="primary"):
    reset_game()
    st.rerun()

# Footer
st.markdown("---")
st.caption("Neural Network AI trained on 1000 self-play games")
