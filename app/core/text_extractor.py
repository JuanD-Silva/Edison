# app/core/text_extractor.py

import docx  
from typing import List, Dict
import fitz  
from google.cloud import vision

def extract_text_from_digital_files(file_paths: List[str]) -> Dict[str, str]:
    """
    Recibe una lista de rutas a archivos digitales (.txt, .docx)
    y devuelve un diccionario que mapea cada ruta de archivo a su texto extraído.
    """
    extracted_texts = {}
    
    for path in file_paths:
        try:
            if path.lower().endswith('.txt'):
                with open(path, 'r', encoding='utf-8') as f:
                    extracted_texts[path] = f.read()
            elif path.lower().endswith('.docx'):
                document = docx.Document(path)
                full_text = "\n".join([para.text for para in document.paragraphs])
                extracted_texts[path] = full_text
        except Exception as e:
            print(f"Error leyendo el archivo {path}: {e}")
            extracted_texts[path] = f"ERROR_AL_LEER_EL_ARCHIVO: {e}"

    return extracted_texts

# --- INICIO DE LA NUEVA FUNCIÓN DE OCR ---
def extract_text_from_pdfs_with_ocr(file_paths: List[str]) -> Dict[str, str]:
    """
    Recibe una lista de rutas a archivos PDF, realiza OCR en cada página
    y devuelve un diccionario que mapea cada ruta a su texto extraído.
    """
    client = vision.ImageAnnotatorClient()
    extracted_texts = {}

    for path in file_paths:
        print(f"Iniciando OCR para el archivo: {path}")
        try:
            full_text_from_pdf = []
            # Abrimos el PDF con PyMuPDF
            doc = fitz.open(path)
            # Iteramos sobre cada página del PDF
            for page_num, page in enumerate(doc):
                # Convertimos la página a una imagen en memoria
                pix = page.get_pixmap()
                img_bytes = pix.tobytes("png")

                # Preparamos la imagen para la API de Vision
                image = vision.Image(content=img_bytes)
                # Usamos 'document_text_detection' por ser ideal para texto denso
                response = client.document_text_detection(image=image)

                if response.error.message:
                    raise Exception(f"Error en la API de Vision: {response.error.message}")

                if response.full_text_annotation:
                    full_text_from_pdf.append(response.full_text_annotation.text)

            # Unimos el texto de todas las páginas
            extracted_texts[path] = "\n\n".join(full_text_from_pdf) # Separador entre páginas
            print(f"OCR para {path} completado.")
            doc.close()
        except Exception as e:
            print(f"Error procesando OCR para el archivo {path}: {e}")
            extracted_texts[path] = f"ERROR_DURANTE_OCR: {e}"

            
    return extracted_texts