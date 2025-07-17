# app/core/analyzer.py

import spacy
import numpy as np
from sklearn.cluster import KMeans
from typing import Dict, List, Any
import os

# Cargamos el modelo de español de spaCy. Es ligero y eficiente.
# Lo cargamos una vez aquí para que no se recargue en cada llamada.
try:
    nlp = spacy.load("es_core_news_sm")
except OSError:
    print("Descargando el modelo de spaCy 'es_core_news_sm'...")
    from spacy.cli import download
    download("es_core_news_sm")
    nlp = spacy.load("es_core_news_sm")


def analyze_texts(texts_data: Dict[str, str]) -> Dict[str, Dict[str, float]]:
    """
    Analiza cada texto para extraer un vector de características numéricas.
    """
    analysis_vectors = {}
    for path, text in texts_data.items():
        # Procesamos el texto con spaCy
        doc = nlp(text)
        
        # --- Métrica 1: Riqueza Léxica (Type-Token Ratio) ---
        # Contamos tokens que no son puntuación ni espacios en blanco.
        tokens = [token for token in doc if not token.is_punct and not token.is_space]
        if not tokens:
            # Si el texto está vacío o solo tiene ruido, asignamos un vector nulo.
            analysis_vectors[path] = {"ttr": 0, "avg_sent_len": 0}
            continue

        # Para ser más precisos, contamos "lemas" (la raíz de la palabra) únicos.
        unique_lemmas = set(token.lemma_.lower() for token in tokens)
        ttr = len(unique_lemmas) / len(tokens) if tokens else 0

        # --- Métrica 2: Complejidad (Longitud Media de Oración) ---
        sentences = list(doc.sents)
        avg_sent_len = len(tokens) / len(sentences) if sentences else 0
        
        # Guardamos el "ADN" numérico de este texto.
        analysis_vectors[path] = {
            "ttr": round(ttr, 4), 
            "avg_sent_len": round(avg_sent_len, 2)
        }
    
    return analysis_vectors


def perform_clustering(vectors: Dict[str, Dict[str, float]], num_clusters: int = 3) -> List[Dict[str, Any]]:
    if not vectors or len(vectors) < num_clusters:
        print("No hay suficientes documentos para realizar el clustering.")
        return [{"cluster_id": 0, "members": list(vectors.keys()), "centroid": {"ttr": 0, "avg_sent_len": 0}}]

    file_paths = list(vectors.keys())
    data_matrix = np.array([[v["ttr"], v["avg_sent_len"]] for v in vectors.values()])
    
    kmeans = KMeans(n_clusters=num_clusters, random_state=42, n_init='auto')
    cluster_labels = kmeans.fit_predict(data_matrix)
    
    # Obtenemos los centroides que calculó el algoritmo
    cluster_centers = kmeans.cluster_centers_

    # Organizamos los resultados, añadiendo el centroide a cada cluster
    clustered_results = []
    for i in range(num_clusters):
        members_in_cluster = [os.path.basename(file_paths[j]) for j, label in enumerate(cluster_labels) if label == i]
        
        # Solo añadimos el cluster si tiene miembros
        if members_in_cluster:
            centroid = cluster_centers[i]
            clustered_results.append({
                "cluster_id": i,
                "members": members_in_cluster,
                "centroid": {
                    "ttr": round(centroid[0], 4),
                    "avg_sent_len": round(centroid[1], 2)
                }
            })
            
    return clustered_results