import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const MemoryGame = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { config, configId, patientId } = location.state || {};

    const handleFinishGame = () => {
        navigate('/games/memory/end', {
            state: {
                configId,
                patientId,
                stats: {
                    // Aquí irán las estadísticas del juego
                }
            }
        });
    };

    return (
        <div className="fixed inset-0 bg-gray-100">
            {/* Barra superior con tiempo y controles */}
            <div className="absolute top-0 left-0 right-0 bg-[#00398A] text-white p-4 flex justify-between items-center">
                <div>Tiempo: 00:00</div>
                <div className="flex gap-4">
                    <button className="bg-[#00A8E3] px-4 py-2 rounded">Pausa</button>
                    <button 
                        onClick={handleFinishGame}
                        className="bg-red-500 px-4 py-2 rounded"
                    >
                        Terminar
                    </button>
                </div>
            </div>

            {/* Área del juego */}
            <div className="absolute inset-0 mt-16 p-4 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-[#00398A] mb-4">
                        Ordena
                    </h2>
                    <p className="text-gray-600">
                        Aquí irá el juego de ordenamiento
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MemoryGame;