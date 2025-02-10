import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { sequenceService } from '../../../services/sequenceService';

const SequenceConfig = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const patientId = searchParams.get('patient');

    const [config, setConfig] = useState({
        difficulty: 'medium',
        hideImages: false,
        sequenceCount: 1
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleConfigChange = (e) => {
        const { name, type, checked, value } = e.target;
        setConfig(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleBack = () => {
        navigate(`/games/${patientId}`);
    };

    const handlePlay = async () => {
        setLoading(true);
        setError('');

        try {
            // Obtenemos las secuencias según la dificultad seleccionada
            const sequences = await sequenceService.getSequences(config.difficulty);
            const configResponse = await sequenceService.saveConfig(1, config); // 1 es un sessionId temporal

            navigate('/games/sequence/play', {
                state: {
                    config,
                    sequences: sequences.slice(0, config.sequenceCount),
                    configId: configResponse.configId,
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
                    Configuración de Secuencia Lógica
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
                            <option value="medium">Media (6 imágenes por cadena)</option>
                            <option value="complex">Compleja (8 imágenes por cadena)</option>
                        </select>
                    </div>

                    {/* Esconder imágenes */}
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="hideImages"
                            name="hideImages"
                            checked={config.hideImages}
                            onChange={handleConfigChange}
                            className="h-4 w-4 rounded border-gray-300 text-[#00398A] focus:ring-[#00398A]"
                        />
                        <label htmlFor="hideImages" className="text-sm font-medium text-gray-700">
                            Esconder imágenes (mostrar por 3 segundos al hacer clic)
                        </label>
                    </div>

                    {/* Cantidad de Cadenas */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Número de Cadenas
                        </label>
                        <select
                            name="sequenceCount"
                            value={config.sequenceCount}
                            onChange={handleConfigChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-[#00398A] focus:ring focus:ring-[#00398A] focus:ring-opacity-50"
                        >
                            <option value={1}>1 Cadena</option>
                            <option value={2}>2 Cadenas</option>
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

export default SequenceConfig;