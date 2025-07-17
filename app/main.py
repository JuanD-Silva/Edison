# app/main.py

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.api import endpoints 
app = FastAPI(title="Edison MVP")

# 2. "Monta" el directorio 'static' para que sea accesible desde el navegador
app.mount("/static", StaticFiles(directory="static"), name="static")

# El prefijo /api/v1 es una buena práctica para versionar nuestra API.
app.include_router(endpoints.router, prefix="/api/v1")

@app.get("/", response_class=FileResponse)
async def read_index():
    return "static/index.html"