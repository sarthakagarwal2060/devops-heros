from fastapi import FastAPI

app = FastAPI(title="FastAPI Verification Service")


@app.get("/")
def get_root_status() -> dict[str, str]:
    """Root endpoint for container health verification."""
    return {"status": "OK", "message": "Hello World"}

