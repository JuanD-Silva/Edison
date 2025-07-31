# app/api/export.py
from fastapi import APIRouter, Body, HTTPException
from fastapi.responses import Response
from weasyprint import HTML, CSS
from pathlib import Path

router = APIRouter()

@router.post("/pdf")
async def export_pdf(html_content: str = Body(..., embed=True)):
    """
    Recibe contenido HTML, le adjunta el CSS local compilado y lo convierte en un PDF.
    """
    try:
        # Creamos un documento HTML básico que servirá de contenedor
        full_html = f"""
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
        </head>
        <body>
            {html_content}
        </body>
        </html>
        """
        
        html = HTML(string=full_html)
        
        # Leemos nuestro archivo CSS compilado desde el backend
        css_path = Path(__file__).parent.parent / "static/css/main.css"
        stylesheet = CSS(filename=css_path)
        
        # Creamos el documento PDF, aplicando la hoja de estilos
        pdf_bytes = html.write_pdf(stylesheets=[stylesheet])

        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=radiografia_de_clase_edison.pdf"}
        )
    except Exception as e:
        print(f"Error al generar el PDF en el backend: {e}")
        raise HTTPException(status_code=500, detail=f"Error interno al generar el PDF: {e}")