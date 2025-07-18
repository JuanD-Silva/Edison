// src/App.jsx
import { useState } from 'react';
import { UploadSection } from './components/UploadSection';
import { LoadingSection } from './components/LoadingSection';
import { ResultsSection } from './components/ResultsSection';

function App() {
  const [view, setView] = useState('upload');
  const [resultsData, setResultsData] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalysis = async (file) => {
    setView('loading');
    setError(null);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/upload-zip/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ocurrió un error en el servidor.');
      }

      const data = await response.json();
      setResultsData(data.pipeline_results);
      setView('results');
    } catch (err) {
      setError(err.message);
      setView('upload');
    }
  };

  const handleReset = () => {
    setView('upload');
    setResultsData(null);
    setError(null);
  };

  const renderContent = () => {
    switch (view) {
      case 'loading':
        return <LoadingSection />;
      case 'results':
        return <ResultsSection data={resultsData} onReset={handleReset} />;
      case 'upload':
      default:
        return <UploadSection onStartAnalysis={handleAnalysis} error={error} />;
    }
  };

  return (
<main className="bg-gray-100 flex min-h-screen flex-col items-center justify-center p-4">
    <div className="container max-w-2xl w-full"> {/* Añadimos un contenedor con un ancho máximo */}
    {renderContent()}
  </div>
</main>
  );
}

export default App;