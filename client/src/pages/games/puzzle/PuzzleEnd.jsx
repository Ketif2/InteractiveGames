// src/pages/games/puzzle/PuzzleEnd.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { puzzleService } from '../../../services/puzzleService';

const PuzzleEnd = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { stats, config, configId, patientId } = location.state || {};

    const [observations, setObservations] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    };

    const handlePlayAgain = () => {
        navigate(`/games/puzzle/config?patient=${patientId}`);
    };

    const handleFinishSession = async () => {
        setLoading(true);
        setError('');

        try {
            await puzzleService.saveStats(configId, {
                ...stats,
                observations
            });
            navigate(`/games/${patientId}`);
        } catch (error) {
            setError('Error al guardar las estadísticas. Por favor, intente nuevamente.');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00398A]"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-[#00398A] mb-6">
                    Resumen del Juego
                </h2>

                {error && (
                    <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
                        {error}
                    </div>
                )}

                <div className="space-y-6">
                    {/* Estadísticas */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-lg mb-3">Estadísticas</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-600">Intentos exitosos</p>
                                <p className="font-medium">{stats.successMoves}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Intentos fallidos</p>
                                <p className="font-medium">{stats.failedMoves}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Ayudas utilizadas</p>
                                <p className="font-medium">{stats.helpCount}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Tiempo total</p>
                                <p className="font-medium">{formatTime(stats.totalTime)}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Tiempo en pausas</p>
                                <p className="font-medium">{formatTime(stats.totalPauses)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Configuración */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-lg mb-3">Configuración</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-600">Dificultad</p>
                                <p className="font-medium">{config.difficulty}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Tamaño del rompecabezas</p>
                                <p className="font-medium">{config.gridSize}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Rompecabezas armados</p>
                                <p className="font-medium">{config.puzzleCount}</p>
                            </div>
                        </div>
                    </div>

                    {/* Observaciones */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Observaciones del terapeuta
                        </label>
                        <textarea
                            rows={4}
                            value={observations}
                            onChange={(e) => setObservations(e.target.value)}
                            className="w-full p-2 border rounded-md focus:ring-[#00398A] focus:border-[#00398A]"
                            placeholder="Ingrese sus observaciones aquí..."
                        />
                    </div>

                    {/* Botones */}
                    <div className="flex justify-between pt-6">
                        <button
                            onClick={handlePlayAgain}
                            className="px-4 py-2 bg-[#00A8E3] text-white rounded hover:bg-[#0096cc] transition-colors"
                            disabled={loading}
                        >
                            Volver a jugar
                        </button>
                        <button
                            onClick={handleFinishSession}
                            className="px-4 py-2 bg-[#00398A] text-white rounded hover:bg-[#002d6f] transition-colors"
                            disabled={loading}
                        >
                            Terminar sesión
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PuzzleEnd;