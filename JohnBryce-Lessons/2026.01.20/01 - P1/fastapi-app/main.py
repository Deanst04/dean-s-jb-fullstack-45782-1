from fastapi import FastAPI
import socket

app = FastAPI()

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/")
def root():
    return {
        "service": "FastAPI",
        "hostname": socket.gethostname(),
        "message": "Hello from FastAPI!"
    }