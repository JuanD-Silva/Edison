# app/core/pipeline.py

import os
import shutil
import tempfile
import zipfile
import io
from fastapi import UploadFile, HTTPException
from typing import Dict, Any
import json

from .text_extractor import extract_text_from_digital_files, extract_text_from_pdfs_with_ocr
from .analyzer import analyze_texts, perform_clustering
from app.services.llm_feedback import generar_feedback_para_cluster

async def process_zip_file(file: UploadFile) -> Dict:
    temp_dir_path = None
    try:
        temp_dir_path = tempfile.mkdtemp()
        zip_content = await file.read()

        classification = {"digital_files": [], "pdf_files": [], "ignored_files": []}
        # ... (código de descompresión y clasificación sin cambios) ...
        with zipfile.ZipFile(io.BytesIO(zip_content)) as zf:
            zf.extractall(temp_dir_path)
            for item in zf.infolist():
                if item.is_dir(): continue
                file_path = os.path.join(temp_dir_path, item.filename)
                filename = item.filename
                if filename.startswith('__MACOSX') or filename.endswith('.DS_Store'):
                    classification["ignored_files"].append(filename)
                elif filename.lower().endswith(('.docx', '.txt')):
                    classification["digital_files"].append(file_path)
                elif filename.lower().endswith('.pdf'):
                    classification["pdf_files"].append(file_path)
                else:
                    classification["ignored_files"].append(filename)
        
        all_extracted_texts = {**extract_text_from_digital_files(classification["digital_files"]), **extract_text_from_pdfs_with_ocr(classification["pdf_files"])}

        analysis_vectors = analyze_texts(all_extracted_texts)
        clusters = perform_clustering(analysis_vectors, num_clusters=3)

        # --- VERIFICA ESTA SECCIÓN ---
        # Este bucle es el punto clave. Nos aseguramos de que el resultado
        # del LLM se guarde en una clave llamada exactamente "feedback_data".
        for cluster in clusters:
            if cluster['members']:
                cluster['feedback_data'] = generar_feedback_para_cluster(cluster, all_extracted_texts)
            # --- INICIO DE LA CÁMARA DE INSPECCIÓN 2 ---
        print("\n--- OBJETO CLUSTERS FINAL ANTES DE ENVIAR AL FRONTEND ---")
    # Usamos json.dumps para que se vea bonito y claro en la terminal
        print(json.dumps(clusters, indent=2, ensure_ascii=False))
        print("---------------------------------------------------------")
    # --- FIN DE LA CÁMARA DE INSPECCIÓN 2 ---
        final_results = {
            "classification_summary": {f: len(v) for f, v in classification.items()},
            "clusters": clusters
        }
        
        print("¡Análisis, clustering y feedback con LLM completados!")
        return final_results

    except Exception as e:
        print(f"ERROR CRÍTICO EN EL PIPELINE: {e}")
        raise HTTPException(status_code=500, detail=f"Error interno al procesar el archivo: {e}")

    finally:
        if temp_dir_path and os.path.exists(temp_dir_path):
            shutil.rmtree(temp_dir_path)
            print(f"Directorio temporal {temp_dir_path} eliminado exitosamente.")