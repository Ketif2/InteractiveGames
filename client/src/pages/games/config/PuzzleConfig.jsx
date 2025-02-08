import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { puzzleService } from '../../../services/puzzleService';

const PuzzleConfig = () => {
    const navigate = useNavigate();

    const [config, setConfig] = useState({
        difficulty: 'medium',
        gridSize: '4x4',
        puzzleCount: 1
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleConfigChange = (e) => {
        const { name, value } = e.target;
        setConfig(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleBack = () => {
        navigate('/games/1'); // ID temporal
    };

    const handlePlay = async () => {
        setLoading(true);
        setError('');

        try {
            // Por ahora solo pasamos la configuración directamente
            navigate('/games/puzzle/play', {
                state: {
                    config,
                    // Estos valores serán importantes cuando se implemente la BD
                    configId: 1,    // Temporal
                    sessionId: 1,   // Temporal
                    patientId: 1    // Temporal
                }
            });
        } catch (error) {
            setError('Error al iniciar el juego. Por favor, intente nuevamente.');
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
                    Configuración del Rompecabezas
                </h2>

                {error && (
                    <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
                        {error}
                    </div>
                )}

                <div className="space-y-6">
                    {/* Dificultad */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Dificultad
                        </label>
                        <select
                            name="difficulty"
                            value={config.difficulty}
                            onChange={handleConfigChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-[#00398A] focus:ring focus:ring-[#00398A] focus:ring-opacity-50"
                        >
                            <option value="medium">Media</option>
                            <option value="hard">Difícil</option>
                            <option value="random">Aleatorio</option>
                        </select>
                    </div>

                    {/* Tamaño del Grid */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Tamaño del Rompecabezas
                        </label>
                        <select
                            name="gridSize"
                            value={config.gridSize}
                            onChange={handleConfigChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-[#00398A] focus:ring focus:ring-[#00398A] focus:ring-opacity-50"
                        >
                            <option value="4x4">4 x 4</option>
                            <option value="5x5">5 x 5</option>
                            <option value="6x6">6 x 6</option>
                        </select>
                    </div>

                    {/* Cantidad de Rompecabezas */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Número de Rompecabezas
                        </label>
                        <select
                            name="puzzleCount"
                            value={config.puzzleCount}
                            onChange={handleConfigChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-[#00398A] focus:ring focus:ring-[#00398A] focus:ring-opacity-50"
                        >
                            <option value={1}>1 Rompecabezas</option>
                            <option value={2}>2 Rompecabezas</option>
                        </select>
                    </div>

                    {/* Botones */}
                    <div className="flex justify-between pt-6">
                        <button
                            onClick={handleBack}
                            className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors"
                            disabled={loading}
                        >
                            Regresar
                        </button>
                        <button
                            onClick={handlePlay}
                            className="px-4 py-2 bg-[#00398A] text-white rounded hover:bg-[#002d6f] transition-colors"
                            disabled={loading}
                        >
                            Jugar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PuzzleConfig;