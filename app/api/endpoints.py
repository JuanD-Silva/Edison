# app/api/endpoints.py

from fastapi import APIRouter, UploadFile, File, HTTPException
from app.core.pipeline import process_zip_file 

router = APIRouter()

@router.post("/upload-zip/")
async def upload_zip_file(file: UploadFile = File(...)):
    """
    Endpoint principal que recibe el ZIP, lo procesa a través del pipeline
    completo y devuelve los resultados finales.
    """
    if file.content_type not in ["application/zip", "application/x-zip-compressed"]:
        raise HTTPException(status_code=400, detail="El archivo debe ser un .ZIP")

    try:
        # Llamamos a nuestro pipeline, que ahora hace todo el trabajo pesado.
        pipeline_results = await process_zip_file(file)
    except Exception as e:
        # Si algo en el pipeline falla, el error se captura y se devuelve.
        # Gracias a nuestro bloque try/except/finally en pipeline.py, esto es muy robusto.
        raise HTTPException(status_code=500, detail=f"Error al procesar el archivo ZIP: {e}")

    # La estructura de respuesta final y correcta.
    # El frontend espera una clave principal "pipeline_results".
    return {
        "filename": file.filename,
        "message": "Archivo ZIP procesado y analizado exitosamente.",
        "pipeline_results": pipeline_results
    }