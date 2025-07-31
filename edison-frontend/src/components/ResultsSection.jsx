// src/components/ResultsSection.jsx
import { useState } from 'react';
import jsPDF from 'jspdf';
import { HeartPulse } from 'lucide-react'; 
import { ClusterCard } from './ClusterCard'; 

const cardColors = ['purple', 'indigo', 'pink', 'teal', 'violet'];

export const ResultsSection = ({ data, onReset }) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const validClusters = data?.clusters?.filter(c => c.members.length > 0) || [];

  const handleDownloadPDF = () => {
    if (!data || validClusters.length === 0) return;

    setIsGeneratingPDF(true);

    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      let yPosition = 20;

      // --- TÍTULO PRINCIPAL ---
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text("Radiografía de tu Clase", 105, yPosition, { align: 'center' });
      yPosition += 15;

      // --- RENDERIZADO INTELIGENTE DE CLUSTERS ---
      validClusters.forEach((cluster, index) => {
        // Salto de página si no hay espacio
        if (yPosition > 250) { 
          doc.addPage();
          yPosition = 20;
        }

        // Título del Cluster
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(cluster.feedback_data?.title || 'Grupo', 15, yPosition);
        yPosition += 10;

        // Lista de Estudiantes
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        cluster.members.forEach(student => {
          doc.text(`• ${student.split('.')[0]}`, 20, yPosition);
          yPosition += 6;
        });
        yPosition += 8;

        // Análisis Edison
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text("Análisis Edison", 15, yPosition);
        yPosition += 7;
        
        // Parseo y renderizado del análisis estructurado
        const analysisRaw = cluster.feedback_data?.analysis || '';
        const analysisParts = analysisRaw.split('**').filter(part => part.trim() !== '');

        analysisParts.forEach((part, i) => {
          if (i % 2 === 0) { // Es un encabezado
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text(part.replace(':', '').trim(), 18, yPosition);
            yPosition += 5;
          } else { // Es el contenido
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            const content = part.replace('-', '').trim();
            const lines = doc.splitTextToSize(content, 170); // Ancho de línea
            doc.text(lines, 22, yPosition);
            yPosition += (lines.length * 5) + 5;
          }
        });
        yPosition += 10; // Espacio extra entre tarjetas
      });

      doc.save("radiografia_de_clase_edison.pdf");

    } catch (error) {
      console.error("Error al generar el PDF:", error);
      alert("Hubo un error al generar el PDF. Por favor, intenta de nuevo.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };
  if (validClusters.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No se encontraron resultados para mostrar.</p>
      </div>
    );
  }


  return (
    // Contenedor principal que ocupa toda la pantalla
    <main className="bg-gray-100 min-h-screen w-full p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto"> {/* Contenedor para centrar el contenido */}
        
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-x-3">
            <HeartPulse className="h-10 w-10 text-purple-600" />
            <h2 className="text-4xl font-extrabold tracking-tight text-purple-700 sm:text-5xl">
              Radiografía de tu Clase
            </h2>
          </div>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">
            Estos son los grupos de estudiantes identificados según su estilo de escritura.
          </p>
        </div>

        {/* La grilla ahora funcionará correctamente dentro de este layout */}
        <div id="results-container" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" >
          {validClusters.map((cluster, index) => (
            <ClusterCard
              key={cluster.cluster_id}
              cluster={cluster}
              color={cardColors[index % cardColors.length]}
            />
          ))}
        </div>

      <div className="text-center mt-20 flex justify-center gap-x-4">
        <button
          onClick={onReset}
          className="rounded-lg bg-purple-600 px-8 py-3 text-base font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:bg-purple-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 cursor-pointer"
        >
          Analizar Nuevo Archivo
        </button>
        <button
          id="download-button"
          onClick={handleDownloadPDF}
          
          disabled={isGeneratingPDF}
          
          className="rounded-lg bg-green-600 px-8 py-3 text-base font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 cursor-pointer disabled:bg-gray-400 disabled:scale-100"
        >
          {/* 3. AÑADE EL TEXTO CONDICIONAL */}
          {isGeneratingPDF ? 'Generando PDF...' : 'Descargar PDF'}
        </button>
      </div>
    </div>
      </main>
  );
};

  