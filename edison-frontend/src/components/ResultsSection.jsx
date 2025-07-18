// src/components/ResultsSection.jsx
import { Users, FileText, TestTube2 } from 'lucide-react';

export const ResultsSection = ({ data, onReset }) => {
  if (!data || !data.clusters) return <p>No se encontraron resultados.</p>;

  return (
    <div className="w-full max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800">Radiografía de tu Clase</h2>
        <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
          Estos son los grupos de estudiantes identificados según su estilo de escritura.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.clusters.map((cluster) => (
          cluster.members.length > 0 && (
            <div key={cluster.cluster_id} className="shadow-lg flex flex-col hover:shadow-xl transition-shadow duration-300 border-t-4 border-blue-600 bg-white rounded-lg">
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex-1 mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{cluster.feedback_data?.title}</h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Users className="w-4 h-4 mr-1.5" />
                    <span>{cluster.members.length} Estudiante(s)</span>
                  </div>
                </div>

                <div className="mb-4">
                  <ul className="space-y-2">
                    {cluster.members.map(student => (
                      <li key={student} className="flex items-center text-sm text-gray-700">
                        <FileText className="w-4 h-4 mr-2 text-blue-600/80 shrink-0" />
                        <span className="truncate">{student.split('.')[0]}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-auto pt-4 border-t border-dashed">
                  <div className="flex items-center text-md font-semibold text-gray-900 mb-2">
                    <TestTube2 className="w-5 h-5 mr-2 text-blue-600" />
                    <h4>Análisis Edison</h4>
                  </div>
                  <p className="text-sm text-gray-600">{cluster.feedback_data?.analysis}</p>
                </div>
              </div>
            </div>
          )
        ))}
      </div>
      <div className="text-center mt-12">
        <button onClick={onReset} className="py-3 px-6 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
          Analizar Nuevo Archivo
        </button>
      </div>
    </div>
  );
};