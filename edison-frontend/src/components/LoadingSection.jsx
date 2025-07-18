// src/components/LoadingSection.jsx
import { useEffect, useState, useMemo } from 'react';
import { BrainCircuit } from 'lucide-react';

export const LoadingSection = () => {
    const loadingPhrases = useMemo(() => [
        "Calibrando los algoritmos...",
        "Digitalizando y leyendo los ensayos...",
        "Identificando patrones de escritura...",
        "Consultando a la IA generativa para los insights...",
        "Construyendo la radiografía de la clase...",
        "Casi listo, puliendo los últimos detalles..."
    ], []);

    const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
    const [progress, setProgress] = useState(10);

    useEffect(() => {
        // Temporizador para cambiar la frase
        const phraseTimer = setInterval(() => {
            setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % loadingPhrases.length);
        }, 2500);

        // --- TEMPORIZADOR DE PROGRESO CORREGIDO ---
        // Este es el temporizador que faltaba y que hace que la barra se mueva.
        const progressTimer = setInterval(() => {
            setProgress((prevProgress) => {
                if (prevProgress >= 95) return 95;
                return prevProgress + 5;
            });
        }, 1000);
        // --- FIN DE LA CORRECCIÓN ---

        return () => {
            clearInterval(phraseTimer);
            clearInterval(progressTimer); // También limpiamos el nuevo temporizador
        };
    }, [loadingPhrases]);

    return (
        <div className="w-full max-w-md mx-auto text-center animate-in fade-in duration-500">
            {/* --- COLOR DEL ICONO CORREGIDO --- */}
            {/* Usamos un color morado directamente con Tailwind para asegurar la consistencia */}
            <BrainCircuit className="mx-auto h-16 w-16 text-purple-600 mb-6 animate-pulse" />
            
            <h2 className="text-2xl font-bold text-foreground mb-3 font-headline">Analizando...</h2>
            
            <p className="text-muted-foreground mb-8 min-h-[40px] flex items-center justify-center">
                {loadingPhrases[currentPhraseIndex]}
            </p>
            
            <div className="w-full bg-secondary rounded-full h-2.5">
                <div 
                    // Usamos un color morado para la barra de progreso también
                    className="bg-purple-600 h-2.5 rounded-full transition-all duration-500 ease-linear" 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
    );
};