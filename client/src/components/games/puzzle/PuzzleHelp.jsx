import React, { useState, useEffect } from 'react';

const PuzzleHelp = ({ originalImage, showHelp }) => {

    const [countdown, setCountdown] = useState(10);
    
    useEffect(() => {
        let timer;
        if (showHelp) {
            // Iniciar la cuenta regresiva desde 10
            setCountdown(10);
            
            // Actualizar cada segundo
            timer = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        
        return () => {
            clearInterval(timer);
        };
    }, [showHelp]);

    return (
        <div 
            className={`relative w-full h-full flex items-center justify-center bg-blue-100 bg-opacity-5 rounded-lg overflow-hidden transition-all duration-500 ease-in-out ${
                showHelp ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
        >
            <img
                src={originalImage}
                alt="Imagen original de referencia"
                className="max-w-[90%] max-h-[90%] object-contain"
                aria-hidden={!showHelp}
            />
            {showHelp && (
                <div className="absolute bottom-0 left-0 right-0 bg-blue-100 bg-opacity-70 text-blue-950 text-center py-2 px-1 text-sm md:text-base">
                    Esta imagen desaparecerá automáticamente en <span className="font-bold">{countdown}</span> segundos
                </div>
            )}
        </div>
    );
};

export default PuzzleHelp;