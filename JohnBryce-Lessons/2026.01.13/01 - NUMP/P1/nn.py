import numpy as np

# =========================
# Data (XOR)
# =========================
X = np.array([
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1]
])

y = np.array([[0], [1], [1], [0]])

# =========================
# Activation function
# =========================
def sigmoid(x):
    return 1 / (1 + np.exp(-x))

def sigmoid_derivative(x):
    return x * (1 - x)

# =========================
# Initialize weights
# =========================
np.random.seed(42)

W1 = np.random.rand(2, 2)   # input → hidden
b1 = np.zeros((1, 2))

W2 = np.random.rand(2, 1)   # hidden → output
b2 = np.zeros((1, 1))

# =========================
# Training
# =========================
learning_rate = 0.1
epochs = 10000

for _ in range(epochs):
    # Forward pass
    hidden = sigmoid(np.dot(X, W1) + b1)
    output = sigmoid(np.dot(hidden, W2) + b2)

    # Error
    error = y - output

    # Backpropagation
    d_output = error * sigmoid_derivative(output)
    d_hidden = d_output.dot(W2.T) * sigmoid_derivative(hidden)

    # Update weights
    W2 += hidden.T.dot(d_output) * learning_rate
    b2 += np.sum(d_output, axis=0, keepdims=True) * learning_rate
    W1 += X.T.dot(d_hidden) * learning_rate
    b1 += np.sum(d_hidden, axis=0, keepdims=True) * learning_rate

# =========================
# Results
# =========================
print("Predictions after training:")
print(np.round(output, 3))