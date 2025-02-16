// src/pages/games/puzzle/PuzzleEnd.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PuzzleEnd = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { patientId, sessionId } = location.state || {};
    const [loading, setLoading] = useState(false);
    const [observations, setObservations] = useState('');

    // Mock data - reemplazar con datos reales del backend
    const mockStats = {
        timeElapsed: '5min',
        errors: 6,
        successes: 16,
        pauses: 2,
        successesPerMinute: 3.2,
        errorsPerMinute: 1.2,
        accuracy: 72.2
    };

    const mockConfig = {
        difficulty: 'Difícil',
        pieces: 16
    };

    const handleFinishSession = async () => {
        setLoading(true);
        try {
            // TODO: Descomentar cuando se implemente el backend
            /*
            await puzzleService.saveSession({
                patientId,
                sessionId,
                stats: mockStats,
                config: mockConfig,
                observations,
                status: 'Hecho'
            });
            */
            
            navigate('/new-session');
        } catch (error) {
            console.error('Error al guardar la sesión:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePlayAgain = () => {
        navigate('/games/puzzle/config', { 
            state: { patientId } 
        });
    };

    return (
        <div className="h-[calc(100vh-10rem)] flex flex-col bg-gray-50">
            {/* Header */}
            <div className="bg-[#00398A] text-white py-2 px-6">
                <h1 className="text-xl font-semibold">Resultados del Rompecabezas</h1>
            </div>

            {/* Contenido principal */}
            <div className="flex-1 p-4 grid grid-cols-2 gap-4 min-h-0">
                {/* Columna izquierda */}
                <div className="flex flex-col gap-4 h-full">
                    {/* Configuración */}
                    <section className="bg-white rounded-lg shadow p-4">
                        <h2 className="text-lg font-semibold text-[#00398A] mb-2">
                            Configuración Sesión
                        </h2>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Dificultad:</span>
                                <span className="bg-blue-100 px-3 py-1 rounded">{mockConfig.difficulty}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Número de piezas:</span>
                                <span className="bg-blue-100 px-3 py-1 rounded">{mockConfig.pieces}</span>
                            </div>
                        </div>
                    </section>

                    {/* Observaciones */}
                    <section className="bg-white rounded-lg shadow p-4 flex-1">
                        <h2 className="text-lg font-semibold text-[#00398A] mb-2">
                            Observaciones
                        </h2>
                        <textarea
                            value={observations}
                            onChange={(e) => setObservations(e.target.value)}
                            className="w-full h-[calc(100%-8rem)] p-3 border rounded-lg resize-none"
                            placeholder="Ingrese sus observaciones aquí..."
                        />
                    </section>
                </div>

                {/* Columna derecha - Estadísticas */}
                <div className="bg-white rounded-lg shadow p-4 flex flex-col h-full">
                    <h2 className="text-lg font-semibold text-[#00398A] mb-4">
                        Estadísticas
                    </h2>
                    <div className="space-y-3 flex-1">
                        <StatItem label="Tiempo transcurrido" value={`${mockStats.timeElapsed}`} />
                        <StatItem label="Número de errores" value={mockStats.errors} />
                        <StatItem label="Número de aciertos" value={mockStats.successes} />
                        <StatItem label="Número de pausas" value={mockStats.pauses} />
                        <StatItem label="Aciertos por minuto" value={`${mockStats.successesPerMinute} aciertos/min`} />
                        <StatItem label="Errores por minuto" value={`${mockStats.errorsPerMinute} errores/min`} />
                        <StatItem label="Precisión en las tareas" value={`${mockStats.accuracy}%`} />
                    </div>
                </div>
            </div>

            {/* Botones */}
            <div className="p-4 bg-white border-t flex justify-center gap-4 mt-auto">
                <button
                    onClick={handleFinishSession}
                    disabled={loading}
                    className="px-6 py-2 bg-[#00398A] text-white rounded-lg hover:bg-[#002d6f] transition-colors disabled:opacity-50"
                >
                    {loading ? 'Guardando...' : 'Terminar Sesión'}
                </button>
                <button
                    onClick={handlePlayAgain}
                    disabled={loading}
                    className="px-6 py-2 bg-[#00A8E3] text-white rounded-lg hover:bg-[#0096cc] transition-colors disabled:opacity-50"
                >
                    Repetir Sesión
                </button>
            </div>
        </div>
    );
};

const StatItem = ({ label, value }) => (
    <div className="flex justify-between items-center py-1.5">
        <span className="text-gray-600">{label}:</span>
        <span className="font-medium">{value}</span>
    </div>
);

export default PuzzleEnd;