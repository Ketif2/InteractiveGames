import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SequenceConfig = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { patientId } = location.state || {};

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [config, setConfig] = useState({
        startRange: 1,
        endRange: 100,
        numbersToHide: 5,
        gameMode: 'normal',
        timeInterval: 30
    });

    const handleConfigChange = (e) => {
        const { name, value } = e.target;
        
        setConfig(prev => {
            const newConfig = { ...prev, [name]: value };
            
            // Si el modo de juego cambia, ajustamos el intervalo de tiempo según el modo
            if (name === 'gameMode') {
                if (value === 'revuelto') {
                    newConfig.timeInterval = 30; // Valor por defecto para modo revuelto
                } else if (value === 'desvanecimiento') {
                    newConfig.timeInterval = 10; // Valor por defecto para modo desvanecimiento
                }
            }

            // Convertir valores numéricos
            if (['startRange', 'endRange', 'numbersToHide', 'timeInterval'].includes(name)) {
                newConfig[name] = parseInt(value);
            }

            return newConfig;
        });
    };

    const validateConfig = () => {
        if (config.startRange >= config.endRange) {
            setError('El rango inicial debe ser menor que el rango final');
            return false;
        }

        const rangeSize = config.endRange - config.startRange + 1;
        if (config.numbersToHide >= rangeSize) {
            setError('La cantidad de números a ocultar debe ser menor que el rango total');
            return false;
        }

        if (config.numbersToHide < 1) {
            setError('Debe ocultar al menos un número');
            return false;
        }

        return true;
    };

    const handleBack = () => {
        navigate('/games/' + patientId);
    };

    const handlePlay = () => {
        if (!validateConfig()) return;

        setLoading(true);
        try {
            navigate('/games/sequence/play', {
                state: {
                    config: {
                        startRange: config.startRange,
                        endRange: config.endRange,
                        numbersToHide: config.numbersToHide,
                        gameMode: config.gameMode,
                        timeInterval: config.timeInterval
                    },
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
        <div className="container mx-auto px-4 py-1">
                        <nav className="flex items-center py-2 px-4" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                    <li className="inline-flex items-center">
                    <button
                        onClick={() => navigate('/new-session')}
                        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#00398A]"
                    >
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                        </svg>
                        Nueva sesión
                    </button>
                    </li>
                    <li>
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                        </svg>
                        <button
                        onClick={() => navigate('/games/' + patientId)}
                        className="ml-1 text-sm font-medium text-gray-500 hover:text-[#00398A] md:ml-2"
                        >
                        Seleccionar juego
                        </button>
                    </div>
                    </li>
                    <li aria-current="page">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                        </svg>
                        <span className="ml-1 text-sm font-medium text-gray-700 md:ml-2">Configuración</span>
                    </div>
                    </li>
                </ol>
            </nav>
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-[#00398A] mb-6">
                    Configuración del Juego de Secuencia
                </h2>

                {error && (
                    <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
                        {error}
                    </div>
                )}

                <div className="space-y-6">
                    {/* Configuración de rangos */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Inicio del Rango
                            </label>
                            <input
                                title='Inicio del rango'
                                type="number"
                                name="startRange"
                                value={config.startRange}
                                onChange={handleConfigChange}
                                min="1"
                                max="999"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 
                                         focus:border-[#00398A] focus:ring focus:ring-[#00398A] focus:ring-opacity-50"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Fin del Rango
                            </label>
                            <input
                                title='Fin del rango'
                                type="number"
                                name="endRange"
                                value={config.endRange}
                                onChange={handleConfigChange}
                                min="1"
                                max="999"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 
                                         focus:border-[#00398A] focus:ring focus:ring-[#00398A] focus:ring-opacity-50"
                            />
                        </div>
                    </div>

                    {/* Números a ocultar */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Números a Ocultar
                        </label>
                        <select
                            title='Números a ocultar'
                            name="numbersToHide"
                            value={config.numbersToHide}
                            onChange={handleConfigChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 
                                     focus:border-[#00398A] focus:ring focus:ring-[#00398A] focus:ring-opacity-50"
                        >
                            {[...Array(10)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {i + 1} {i === 0 ? 'número' : 'números'}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Modo de juego */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Modo de Juego
                        </label>
                        <select
                            title='Modo de juego'
                            name="gameMode"
                            value={config.gameMode}
                            onChange={handleConfigChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 
                                     focus:border-[#00398A] focus:ring focus:ring-[#00398A] focus:ring-opacity-50"
                        >
                            <option value="normal">Normal</option>
                            <option value="desvanecimiento">Desvanecimiento</option>
                            <option value="revuelto">Revuelto</option>
                        </select>
                    </div>

                    {/* Intervalo de tiempo para modos específicos */}
                    {(config.gameMode === 'desvanecimiento' || config.gameMode === 'revuelto') && (
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Intervalo de Tiempo (segundos)
                            </label>
                            <select
                                title='Intervalo de tiempo'
                                name="timeInterval"
                                value={config.timeInterval}
                                onChange={handleConfigChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 
                                         focus:border-[#00398A] focus:ring focus:ring-[#00398A] focus:ring-opacity-50"
                            >
                                {config.gameMode === 'revuelto' ? (
                                    <>
                                        <option value="20">20 segundos</option>
                                        <option value="30">30 segundos</option>
                                        <option value="60">60 segundos</option>
                                    </>
                                ) : (
                                    <>
                                        <option value="5">5 segundos</option>
                                        <option value="10">10 segundos</option>
                                        <option value="15">15 segundos</option>
                                    </>
                                )}
                            </select>
                        </div>
                    )}

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

export default SequenceConfig;