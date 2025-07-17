# app/services/llm_feedback.py
import os
import re # Importamos el módulo de expresiones regulares
import google.generativeai as genai
from dotenv import load_dotenv
from typing import Dict, List, Any

# ... (código de configuración de la API sin cambios) ...

def generar_feedback_para_cluster(cluster_data: Dict[str, Any], all_texts: Dict[str, str]) -> Dict[str, str]:
    """
    Genera un título y un feedback personalizado para un cluster usando un LLM.
    """
    try:
        # Usamos el modelo que encontraste
        model = genai.GenerativeModel('models/gemini-2.5-flash') 

        centroide = cluster_data['centroid']
        miembros = cluster_data['members']
        
        textos_ejemplo = [all_texts.get(path, "Texto no encontrado.") for path in list(filter(lambda p: os.path.basename(p) in miembros, all_texts.keys()))[:2]]
        
        # --- PROMPT MEJORADO ---
        prompt = f"""
        Actúa como un experto asistente pedagógico para un profesor de secundaria. Tu tono debe ser de colega a colega.

        He analizado un grupo de {len(miembros)} ensayos de estudiantes. Sus métricas promedio son una riqueza léxica de {centroide['ttr']:.2f} y una longitud de oración de {centroide['avg_sent_len']:.1f} palabras.

        Tu tarea es generar dos cosas en este formato exacto:
        TITULO: [Escribe aquí un título descriptivo y conciso de 3 a 5 palabras para el grupo]
        ANALISIS: [Escribe aquí un párrafo de análisis de máximo 80 palabras que describa el estilo, mencione una fortaleza y ofrezca una sugerencia de mejora]

        Ejemplo de respuesta:
        TITULO: Escritores Analíticos y Detallados
        ANALISIS: Este grupo demuestra una notable capacidad para el análisis, utilizando un vocabulario preciso y construyendo argumentos sólidos. Para llevar su escritura al siguiente nivel, podrían enfocarse en mejorar la fluidez entre párrafos.
        """

        response = model.generate_content(prompt)

        
        # --- LÓGICA DE PARSEO CORREGIDA Y MÁS ROBUSTA ---
        texto_completo = response.text.strip()
        titulo = "Grupo Analizado" # Título por defecto
        analisis = "No se pudo extraer el análisis." # Análisis por defecto

        # Dividimos el texto en líneas para procesarlo mejor
        partes = texto_completo.split('ANALISIS:')
        if len(partes) == 2:
            # La primera parte contiene el título
            titulo_raw = partes[0]
            analisis = partes[1].strip()
            
            # Limpiamos el título
            titulo = titulo_raw.replace('TITULO:', '').strip()
        else:
            # Si el formato no es el esperado, devolvemos todo el texto como análisis
            analisis = texto_completo

           # --- INICIO DE LA CÁMARA DE INSPECCIÓN 1 ---
        resultado_a_devolver = {"title": titulo, "analysis": analisis}
        print("--- DICCIONARIO A DEVOLVER DESDE LLM_FEEDBACK ---")
        print(resultado_a_devolver)
        print("-----------------------------------------------")
        return resultado_a_devolver
    # --- FIN DE LA CÁMARA DE INSPECCIÓN 1 ---
    
    

    except Exception as e:
        print(f"Error al generar feedback con LLM: {e}")
        return {"title": "Error de Análisis", "analysis": "No se pudo generar el análisis detallado para este grupo."}