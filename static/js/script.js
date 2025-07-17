// static/js/script.js

document.addEventListener('DOMContentLoaded', () => {
    const uploadSection = document.getElementById('upload-section');
    const loadingSection = document.getElementById('loading-section');
    const resultsSection = document.getElementById('results-section');
    const uploadForm = document.getElementById('upload-form');
    const zipFileInput = document.getElementById('zip-file-input');
    const resultsContainer = document.getElementById('results-container');
    const resetButton = document.getElementById('reset-button');

    const clusterInsights = {
        CONCISE: {
            name: "Grupo de Escritores Concisos y Directos",
            analysis: "Estos ensayos tienden a usar oraciones más cortas y un lenguaje directo. Su fortaleza es la claridad, pero se beneficiarían de añadir más detalles y variedad léxica para enriquecer sus argumentos."
        },
        DEVELOPED: {
            name: "Grupo de Escritores Fluidos y Desarrollados",
            analysis: "Estos estudiantes demuestran un uso de vocabulario rico y construyen oraciones complejas. Muestran un buen dominio del tema y están listos para desafíos mayores, como analizar textos más avanzados."
        },
        DEVELOPING: {
            name: "Grupo de Escritores en Desarrollo",
            analysis: "Este grupo muestra un estilo mixto. Pueden escribir textos largos pero con vocabulario repetitivo, o viceversa. Un buen siguiente paso sería trabajar en la conexión de ideas y en la expansión de su rango de palabras."
        }
    };

    uploadForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const file = zipFileInput.files[0];
        if (!file) {
            alert('Por favor, selecciona un archivo .ZIP');
            return;
        }
        uploadSection.classList.add('hidden');
        loadingSection.classList.remove('hidden');
        resultsSection.classList.add('hidden');
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await fetch('/api/v1/upload-zip/', {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Ocurrió un error en el servidor.');
            }
            const data = await response.json();
                    // --- INICIO DE LA CÁMARA DE INSPECCIÓN 3 ---
        console.log("--- DATOS COMPLETOS RECIBIDOS DEL BACKEND ---");
        // Usamos JSON.stringify para ver el objeto completo
        console.log(JSON.stringify(data, null, 2));
        console.log("-------------------------------------------");
        // --- FIN DE LA CÁMARA DE INSPECCIÓN 3 ---
            renderResults(data.pipeline_results.clusters);
            loadingSection.classList.add('hidden');
            resultsSection.classList.remove('hidden');
        } catch (error) {
            alert(`Error: ${error.message}`);
            resetView();
        }
    });

    resetButton.addEventListener('click', resetView);

    function getInsightForCluster(cluster) {
        const { ttr, avg_sent_len } = cluster.centroid;

        // Lógica de decisión basada en umbrales. Estos se pueden ajustar.
        if (avg_sent_len < 13) {
            return clusterInsights.CONCISE;
        } else if (ttr > 0.60 && avg_sent_len > 18) {
            return clusterInsights.DEVELOPED;
        } else {
            return clusterInsights.DEVELOPING;
        }
    }

    function renderResults(clusters) {
        resultsContainer.innerHTML = '';
        if (!clusters || clusters.length === 0) {
            resultsContainer.innerHTML = '<p>No se pudieron generar los grupos.</p>';
            return;
        }
        
        clusters.forEach(cluster => {
            if (cluster.members.length === 0) return;

            // ¡Ahora el nombre y el análisis vienen directamente del backend!
            const title = cluster.feedback_data.title || "Grupo sin Título";
            const analysisText = cluster.feedback_data.analysis || "El análisis para este grupo no está disponible.";
            const studentCount = cluster.members.length;

            const card = document.createElement('div');
            card.className = 'cluster-card';

            card.innerHTML = `
                <h3>${title} (${studentCount} estudiante(s))</h3>
                <ul>
                    ${cluster.members.map(student => `<li>${student.split('.')[0]}</li>`).join('')}
                </ul>
                <h4>Análisis Edison:</h4>
                <p>${analysisText}</p> 
            `;
            resultsContainer.appendChild(card);
        });
    }

    function resetView() {
        uploadSection.classList.remove('hidden');
        loadingSection.classList.add('hidden');
        resultsSection.classList.add('hidden');
        uploadForm.reset();
    }
});