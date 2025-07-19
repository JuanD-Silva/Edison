// src/components/ClusterCard.jsx
import { Users, FileText, TestTube2 } from 'lucide-react';
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

export const ClusterCard = ({ cluster, color = 'purple' }) => {
  const colorTheme = accentColors[color] || accentColors.purple;

  return (
    <div
      className={clsx(
        // AQUÍ ESTÁ EL CAMBIO: Se agregó 'w-full' para que la card ocupe todo el ancho de la columna.
        'group flex flex-col w-full rounded-xl border-t-4 bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2',
        colorTheme.border
      )}
    >
      <div className="flex flex-grow flex-col p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-800">{cluster.feedback_data?.title}</h3>
          <div className="mt-2 flex items-center text-sm font-medium text-gray-500">
            <Users className="mr-1.5 h-4 w-4" />
            <span>{cluster.members.length} Estudiante(s)</span>
          </div>
        </div>
        <div className={clsx("mb-4 min-h-[12rem] overflow-y-auto rounded-lg border p-3 pr-2", colorTheme.bg)}>
          <ul className="space-y-2">
            {cluster.members.map((student) => (
              <li key={student} className="flex items-center text-sm text-gray-700">
                <FileText
                  className={clsx('mr-2 h-4 w-4 flex-shrink-0', colorTheme.icon)}
                />
                <span className="truncate" title={student.split('.')[0]}>
                  {student.split('.')[0]}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-auto border-t border-dashed border-gray-200 pt-4">
          <div className="mb-2 flex items-center text-base font-semibold text-gray-800">
            <TestTube2 className={clsx('mr-2 h-5 w-5', colorTheme.text)} />
            <h4>Análisis Edison</h4>
          </div>
          <p className="text-sm text-gray-600">{cluster.feedback_data?.analysis}</p>
        </div>
      </div>
    </div>
  );
};