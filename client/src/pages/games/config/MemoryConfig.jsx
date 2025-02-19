import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const MemoryConfig = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { patientId } = location.state || {};

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [config, setConfig] = useState({
        difficulty: 'fácil',     // fácil: 5 objetos separados, medio/difícil: 7 objetos
        gameMode: 'normal',      // normal o memoria
        showObjectName: true     // mostrar u ocultar nombres
    });

    const handleConfigChange = (e) => {
        const { name, value } = e.target;
        setConfig(prev => ({
            ...prev,
            [name]: value === 'true' ? true : 
                    value === 'false' ? false : value
        }));
    };

    const handleBack = () => {
        navigate('/games/' + patientId);
    };

    const handlePlay = () => {
        setLoading(true);
        try {
            navigate('/games/memory/play', {
                state: {
                    config,
                    patientId
                }
            });
        } catch (error) {
            setError('Error al iniciar el juego. Por favor, intente nuevamente.');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-[#00398A] mb-6">
                    Configuración del Juego de Ordenar por Peso
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
                            Dificultad del Juego
                        </label>
                        <select
                            name="difficulty"
                            value={config.difficulty}
                            onChange={handleConfigChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 
                                     focus:border-[#00398A] focus:ring focus:ring-[#00398A] focus:ring-opacity-50"
                        >
                            <option value="fácil">Fácil (5 objetos muy diferentes)</option>
                            <option value="medio">Medio (7 objetos con diferencias moderadas)</option>
                            <option value="difícil">Difícil (7 objetos similares)</option>
                        </select>
                        <p className="text-sm text-gray-500 mt-1">
                            {config.difficulty === 'fácil' ? 
                                'Los objetos tendrán pesos muy diferentes entre sí' :
                             config.difficulty === 'medio' ? 
                                'Los objetos tendrán diferencias moderadas de peso' :
                                'Los objetos tendrán pesos muy similares entre sí'}
                        </p>
                    </div>

                    {/* Modo de juego */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Modo de Juego
                        </label>
                        <select
                            name="gameMode"
                            value={config.gameMode}
                            onChange={handleConfigChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 
                                     focus:border-[#00398A] focus:ring focus:ring-[#00398A] focus:ring-opacity-50"
                        >
                            <option value="normal">Normal</option>
                            <option value="memoria">Memoria</option>
                        </select>
                        <p className="text-sm text-gray-500 mt-1">
                            {config.gameMode === 'normal' ? 
                                'Los objetos permanecerán visibles durante todo el juego' :
                                'Los objetos se mostrarán brevemente y luego deberás recordar su orden'}
                        </p>
                    </div>

                    {/* Mostrar nombres */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Mostrar Nombres de Objetos
                        </label>
                        <select
                            name="showObjectName"
                            value={config.showObjectName}
                            onChange={handleConfigChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 
                                     focus:border-[#00398A] focus:ring focus:ring-[#00398A] focus:ring-opacity-50"
                        >
                            <option value={true}>Sí</option>
                            <option value={false}>No</option>
                        </select>
                    </div>

                    {/* Botones */}
                    <div className="flex justify-between pt-6">
                        <button
                            onClick={handleBack}
                            className="px-6 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors"
                            disabled={loading}
                        >
                            Regresar
                        </button>
                        <button
                            onClick={handlePlay}
                            className="px-6 py-2 bg-[#00398A] text-white rounded hover:bg-[#002d6f] transition-colors"
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

export default MemoryConfig;