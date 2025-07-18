// src/components/UploadSection.jsx
import { useState } from 'react';
import { UploadCloud, FileText, Loader2, BrainCircuit } from 'lucide-react';

// Primero, instala lucide-react: npm install lucide-react
export const UploadSection = ({ onStartAnalysis, error }) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const currentFile = e.target.files[0];
      if (currentFile.name.endsWith('.zip')) {
        setFile(currentFile);
      } else {
        alert("Archivo no válido. Por favor, selecciona un archivo .ZIP");
        e.target.value = '';
        setFile(null);
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith('.zip')) {
        setFile(droppedFile);
      } else {
        alert("Archivo no válido. Por favor, selecciona un archivo .ZIP");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      setIsLoading(true);
      onStartAnalysis(file);
    }
  };
  
  const dragProps = {
    onDragEnter: (e) => { e.preventDefault(); setIsDragging(true); },
    onDragOver: (e) => { e.preventDefault(); setIsDragging(true); },
    onDragLeave: (e) => { e.preventDefault(); setIsDragging(false); },
    onDrop: handleDrop,
  };

  return (
<div className="w-full max-w-4xl  mx-auto bg-white rounded-xl shadow-md p-8 text-center transition-all duration-300 hover:shadow-2xl">
      
      <BrainCircuit className="mx-auto h-12 w-12 text-purple-600 mb-4" />
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Analizador de Ensayos Edison</h1>
      <p className="text-gray-500 mb-6">
        Sube un archivo .zip con los trabajos de tus estudiantes y la IA los agrupará por temas y te dará un análisis detallado.
      </p>
      
      <form onSubmit={handleSubmit}>
        {file && (
            <div className="text-left font-semibold text-gray-700 mb-4 bg-gray-50 p-3 rounded-lg">
                Archivo seleccionado: {file.name}
            </div>
        )}

        {/* --- INICIO DE LA CORRECCIÓN --- */}
        <div 
          className="border-dashed border-2 border-gray-300 rounded-lg bg-white transition-all duration-300"
          // Aplicamos el resaltado aquí, en el contenedor
          style={isDragging ? { boxShadow: '0 0 25px rgba(139, 92, 246, 0.4)' } : {}}
        >
          <label 
            htmlFor="zipFile" 
            {...dragProps}
            // Las clases de hover y transición se aplican aquí
            className={`flex flex-col items-center justify-center p-10 cursor-pointer rounded-lg transition-colors duration-300 ${isDragging ? "bg-purple-50" : "hover:bg-gray-100"}`}
          >
            <input type="file" id="zipFile" name="zipFile" accept=".zip" required className="hidden" onChange={handleFileChange} />
            <UploadCloud className="h-10 w-10 text-purple-500 mb-3" />
            
            <span className="font-semibold text-purple-700">Arrastra y suelta o haz clic para subir</span>
            <span className="text-gray-500 mt-1 text-sm">Solo archivos .zip</span>
          </label>
        </div>
        {/* --- FIN DE LA CORRECCIÓN --- */}
        
        {error && <p className="text-red-500 mt-4">{error}</p>}

        <button 
            type="submit" 
            // 2. Botón más pequeño (py-2 px-4, text-base)
            className="mt-6 w-auto inline-flex items-center justify-center shadow-lg bg-purple-600 text-white font-semibold py-2 px-5 text-base rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:bg-gray-400 transition-all duration-300 transform hover:scale-105 disabled:scale-100 cursor-pointer" 
            disabled={!file || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="inline mr-2 h-4 w-4 animate-spin" />
              Analizando...
            </>
          ) : (
            <>
              {/* 3. Icono cambiado a BrainCircuit */}
              <BrainCircuit className="mr-2 h-5 w-5" /> 
              Analizar Trabajos
            </>
          )}
        </button>
      </form>
    </div>
  );
};