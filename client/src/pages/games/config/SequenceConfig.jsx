import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { sequenceService } from '../../../services/sequenceService';

const SequenceConfig = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const patientId = searchParams.get('patient');

    const [config, setConfig] = useState({
        numberRange: '1-50',
        hiddenCount: '3-5',
        pattern: 'even',
        shuffleTime: 10,
        gameMode: 'normal',
        sequenceCount: 1
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
        navigate(`/games/${patientId}`);
    };

    const handlePlay = async () => {
        setLoading(true);
        setError('');

        try {
            const configResponse = await sequenceService.saveConfig({
                ...config,
                patientId
            });

            navigate('/games/sequence/play', {
                state: {
                    config,
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
                    Configuración de Secuencia Numérica
                </h2>

                {error && (
                    <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
                        {error}
                    </div>
                )}

                <div className="space-y-6">
                    {/* Rango de Números */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Rango de Números
                        </label>
                        <select
                            name="numberRange"
                            value={config.numberRange}
                            onChange={handleConfigChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-[#00398A] focus:ring focus:ring-[#00398A] focus:ring-opacity-50"
                        >
                            <option value="1-50">1-50</option>
                            <option value="100-200">100-200</option>
                            <option value="500-1000">500-1000</option>
                            <option value="1000+">1000+</option>
                        </select>
                    </div>

                    {/* Números a Ocultar */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Números a Ocultar
                        </label>
                        <select
                            name="hiddenCount"
                            value={config.hiddenCount}
                            onChange={handleConfigChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-[#00398A] focus:ring focus:ring-[#00398A] focus:ring-opacity-50"
                        >
                            <option value="3-5">3-5 números</option>
                            <option value="6-10">6-10 números</option>
                            <option value="11-15">11-15 números</option>
                            <option value="16+">16+ números</option>
                        </select>
                    </div>

                    {/* Patrón */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Patrón de Números
                        </label>
                        <select
                            name="pattern"
                            value={config.pattern}
                            onChange={handleConfigChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-[#00398A] focus:ring focus:ring-[#00398A] focus:ring-opacity-50"
                        >
                            <option value="even">Números pares</option>
                            <option value="odd">Números impares</option>
                            <option value="sequence">Secuencia + n</option>
                            <option value="position">Posición (esquinas/medios)</option>
                        </select>
                    </div>

                    {/* Modo de Juego */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Modo de Juego
                        </label>
                        <select
                            name="gameMode"
                            value={config.gameMode}
                            onChange={handleConfigChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-[#00398A] focus:ring focus:ring-[#00398A] focus:ring-opacity-50"
                        >
                            <option value="normal">Normal</option>
                            <option value="fade">Desvanecimiento</option>
                            <option value="memory">Memoria (5s)</option>
                        </select>
                    </div>

                    {/* Tiempo de Mezcla */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Tiempo de Mezcla
                        </label>
                        <select
                            name="shuffleTime"
                            value={config.shuffleTime}
                            onChange={handleConfigChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-[#00398A] focus:ring focus:ring-[#00398A] focus:ring-opacity-50"
                        >
                            <option value={10}>10 segundos</option>
                            <option value={20}>20 segundos</option>
                            <option value={30}>30 segundos</option>
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