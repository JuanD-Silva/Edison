// src/components/ResultsSection.jsx
import { ClusterCard } from './ClusterCard'; // Importamos el nuevo componente
import { HeartPulse } from 'lucide-react'; 

const cardColors = ['purple', 'indigo', 'pink', 'teal', 'violet'];

export const ResultsSection = ({ data, onReset }) => {
  const validClusters = data?.clusters?.filter(c => c.members.length > 0) || [];

  if (validClusters.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No se encontraron resultados para mostrar.</p>
      </div>
    );
  }

  return (
<div className="w-full min-h-screen animate-in fade-in duration-500 px-4 sm:px-6 lg:px-8 py-12 flex flex-col">      {/* Encabezado con logo y color actualizado */}
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-x-4">
           <HeartPulse className="h-10 w-10 text-purple-600" />
           <h2 className="text-4xl font-extrabold tracking-tight text-purple-700 sm:text-5xl">
             Radiografía de tu Clase
           </h2>
        </div>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">
          Estos son los grupos de estudiantes identificados según su estilo de escritura.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {validClusters.map((cluster, index) => (
          <ClusterCard
            key={cluster.cluster_id}
            cluster={cluster}
            color={cardColors[index % cardColors.length]}
          />
        ))}
      </div>

      <div className="text-center mt-20">
        <button
          onClick={onReset}
          className="rounded-lg bg-purple-600 px-8 py-3 text-base font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:bg-purple-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
        >
          Analizar Nuevo Archivo
        </button>
      </div>
    </div>
  );
};
  