// src/components/ClusterCard.jsx
import { Users, FileText, TestTube2, Star, Target, Lightbulb } from 'lucide-react'; 
import clsx from 'clsx';


const accentColors = {
  purple: {
    border: 'border-purple-500',
    text: 'text-purple-600',
    bg: 'bg-purple-50',
    icon: 'text-purple-500',
  },
  indigo: {
    border: 'border-indigo-500',
    text: 'text-indigo-600',
    bg: 'bg-indigo-50',
    icon: 'text-indigo-500',
  },
  pink: {
    border: 'border-pink-500',
    text: 'text-pink-600',
    bg: 'bg-pink-50',
    icon: 'text-pink-500',
  },
  teal: {
    border: 'border-teal-500',
    text: 'text-teal-600',
    bg: 'bg-teal-50',
    icon: 'text-teal-500',
  },
  violet: {
    border: 'border-violet-500',
    text: 'text-violet-600',
    bg: 'bg-violet-50',
    icon: 'text-violet-500',
  },
};

// Pequeña función para convertir el texto estructurado a HTML
const renderAnalysis = (analysisText) => {
    if (!analysisText) return <p>Análisis no disponible.</p>;

    const sectionsConfig = {
        "Fortalezas comunes de este grupo": { icon: <Star className="w-4 h-4 mr-2 text-green-500" />, order: 1 },
        "Áreas para reforzar": { icon: <Target className="w-4 h-4 mr-2 text-red-500" />, order: 2 },
        "Sugerencias para mejorar": { icon: <Lightbulb className="w-4 h-4 mr-2 text-yellow-500" />, order: 3 }
    };

    const parts = analysisText.split('**').filter(part => part.trim() !== '');
    const sections = [];
    for (let i = 0; i < parts.length; i += 2) {
        const title = parts[i]?.replace(':', '').trim();
        const content = parts[i+1]?.replace('-', '').trim();
        if (title && content && sectionsConfig[title]) {
            sections.push({ title, content, ...sectionsConfig[title] });
        }
    }
    
    if (sections.length === 0) {
        return <p className="text-sm text-gray-600">{analysisText}</p>;
    }

    sections.sort((a, b) => a.order - b.order);

    return (
        <div className="flex flex-col space-y-4">
            {sections.map((section) => (
                <div key={section.title}>
                    <div className="flex items-center text-sm font-semibold text-gray-700">
                        {section.icon}
                        <h5 className="font-bold">{section.title}</h5>
                    </div>
                    <p className="text-sm text-gray-600 pl-6">{section.content}</p>
                </div>
            ))}
        </div>
    );
};


export const ClusterCard = ({ cluster, color = 'purple' }) => {
  const colorTheme = accentColors[color] || accentColors.purple;

  return (
    <div
      className={clsx(
        'group flex flex-col h-full rounded-xl border-t-4 bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2',
        colorTheme.border
      )}
    >
      <div className="flex flex-grow flex-col p-6">
        {/* CAMBIO FINAL: Añadimos una altura mínima a este bloque para estandarizarlo */}
        <div className="mb-4 min-h-[5rem]">
          <h3 className="text-xl font-bold text-gray-800">{cluster.feedback_data?.title}</h3>
          <div className="mt-2 flex items-center text-sm font-medium text-gray-500">
            <Users className="mr-1.5 h-4 w-4" />
            <span>{cluster.members.length} Estudiante(s)</span>
          </div>
        </div>
        
        <div className={clsx("mb-4 h-[12rem] overflow-y-auto rounded-lg border p-3 pr-2", colorTheme.bg)}>
          <ul className="space-y-2">
            {cluster.members.map((student) => (
              <li key={student} className="flex items-center text-sm text-gray-700">
                <FileText className={clsx('mr-2 h-4 w-4 flex-shrink-0', colorTheme.icon)} />
                <span className="truncate" title={student.split('.')[0]}>
                  {student.split('.')[0]}
                </span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="border-t border-dashed border-gray-200 pt-4">
          <h4 className="mb-2 flex items-center text-base font-semibold text-gray-800">
            <TestTube2 className={clsx('mr-2 h-5 w-5', colorTheme.text)} />
            Análisis Edison
          </h4>
          {renderAnalysis(cluster.feedback_data?.analysis)}
        </div>
      </div>
    </div>
  );
};