from fastapi import FastAPI

app = FastAPI(title="Docker Fundamentals Python Endpoint")


@app.get("/")
def get_status() -> dict[str, str]:
    """Return fundamental status JSON response."""
    return {"status": "OK", "message": "Hello World"}

