# app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.api import endpoints 
app = FastAPI(title="Edison MVP")

# --- CONFIGURACIÓN DE CORS ---
origins = [
    "http://localhost:5173", # La dirección de nuestra app de React
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. "Monta" el directorio 'static' para que sea accesible desde el navegador
app.mount("/static", StaticFiles(directory="static"), name="static")

# El prefijo /api/v1 es una buena práctica para versionar nuestra API.
app.include_router(endpoints.router, prefix="/api/v1")

@app.get("/", response_class=FileResponse)
async def read_index():
    return "static/index.html"