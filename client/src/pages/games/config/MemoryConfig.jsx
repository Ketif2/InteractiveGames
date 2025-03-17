import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { availableCategories } from '../../../data/memoryObjects';

const MemoryConfig = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { patientId } = location.state || {};

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [config, setConfig] = useState({
        difficulty: 'fácil',     // fácil: 5 objetos separados, medio/difícil: 7 objetos
        gameMode: 'normal',      // normal o memoria
        showObjectName: true,    // mostrar u ocultar nombres
        category: 'todos',       // categoría de objetos
        rounds: 3                // número de rondas (por defecto 3)
    });

    const handleConfigChange = (e) => {
        const { name, value } = e.target;
        setConfig(prev => ({
            ...prev,
            [name]: value === 'true' ? true : 
                    value === 'false' ? false : 
                    name === 'rounds' ? parseInt(value, 10) : value
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
                            <option value="fácil">Fácil (2 filas de objetos)</option>
                            <option value="medio">Medio (3 filas de objetos)</option>
                            <option value="difícil">Difícil (4 filas de objetos)</option>
                        </select>
                        <p className="text-sm text-gray-500 mt-1">
                            {config.difficulty === 'fácil' ? 
                                'Los objetos tendrán pesos muy diferentes entre sí' :
                             config.difficulty === 'medio' ? 
                                'Los objetos tendrán diferencias moderadas de peso' :
                                'Los objetos tendrán pesos muy similares entre sí'}
                        </p>
                    </div>
                    
                    {/* Categoría de objetos */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Categoría de Objetos
                        </label>
                        <select
                            name="category"
                            value={config.category}
                            onChange={handleConfigChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 
                                     focus:border-[#00398A] focus:ring focus:ring-[#00398A] focus:ring-opacity-50"
                        >
                            {availableCategories.map(category => (
                                <option key={category.value} value={category.value}>
                                    {category.label}
                                </option>
                            ))}
                        </select>
                        <p className="text-sm text-gray-500 mt-1">
                            Selecciona la categoría de objetos que quieres ordenar por peso
                        </p>
                    </div>
                    
                    {/* Número de rondas - NUEVO */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Número de Rondas
                        </label>
                        <select
                            name="rounds"
                            value={config.rounds}
                            onChange={handleConfigChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 
                                     focus:border-[#00398A] focus:ring focus:ring-[#00398A] focus:ring-opacity-50"
                        >
                            {[1, 2, 3, 4, 5, 6, 7].map(num => (
                                <option key={num} value={num}>
                                    {num} {num === 1 ? 'ronda' : 'rondas'}
                                </option>
                            ))}
                        </select>
                        <p className="text-sm text-gray-500 mt-1">
                            Selecciona cuántas rondas tendrá la sesión de juego
                        </p>
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