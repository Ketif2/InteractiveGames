// src/pages/games/forest/ForestConfig.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ForestConfig = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { patientId } = location.state || {};

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [config, setConfig] = useState({
        difficulty: 'fácil',       // fácil, medio, difícil
        startingLevel: 1,          // nivel inicial (1-4)
        objectDensity: 'normal',   // baja, normal, alta (cantidad de distractores)
        rounds: 3,                 // número de rondas por sesión
        timeLimit: 60,             // tiempo límite por nivel en segundos (0 = sin límite)
    });

    const handleConfigChange = (e) => {
        const { name, value } = e.target;
        setConfig(prev => ({
            ...prev,
            [name]: name === 'startingLevel' || name === 'rounds' || name === 'timeLimit' 
                ? parseInt(value, 10) 
                : value
        }));
    };

    const handleBack = () => {
        navigate('/games/' + patientId);
    };

    const handlePlay = () => {
        setLoading(true);
        try {
            navigate('/games/forest/play', {
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
                    Configuración del Juego de Sendero en el Bosque
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
                            <option value="fácil">Fácil (Menos distractores)</option>
                            <option value="medio">Medio (Distractores moderados)</option>
                            <option value="difícil">Difícil (Muchos distractores)</option>
                        </select>
                        <p className="text-sm text-gray-500 mt-1">
                            {config.difficulty === 'fácil' ? 
                                'Menor cantidad de distractores y objetivos más diferenciables' :
                             config.difficulty === 'medio' ? 
                                'Cantidad moderada de distractores y similitud visual media' :
                                'Mayor cantidad de distractores y alta similitud visual'}
                        </p>
                    </div>
                    
                    {/* Nivel inicial */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Nivel
                        </label>
                        <select
                            name="startingLevel"
                            value={config.startingLevel}
                            onChange={handleConfigChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 
                                     focus:border-[#00398A] focus:ring focus:ring-[#00398A] focus:ring-opacity-50"
                        >
                            <option value={1}>Nivel 1 - Reconocimiento simple</option>
                            <option value={2}>Nivel 2 - Reconocimiento múltiple</option>
                            <option value={3}>Nivel 3 - Secuencias</option>
                            <option value={4}>Nivel 4 - Patrones</option>
                        </select>
                        <p className="text-sm text-gray-500 mt-1">
                            {config.startingLevel === 1 ? 
                                'El paciente deberá identificar un solo tipo de objeto' :
                             config.startingLevel === 2 ? 
                                'El paciente deberá identificar dos tipos diferentes de objetos' :
                             config.startingLevel === 3 ?
                                'El paciente deberá seguir una secuencia específica' :
                                'El paciente deberá seguir un patrón repetitivo'}
                        </p>
                    </div>
                    
                    {/* Densidad de objetos */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Densidad de Objetos
                        </label>
                        <select
                            name="objectDensity"
                            value={config.objectDensity}
                            onChange={handleConfigChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 
                                     focus:border-[#00398A] focus:ring focus:ring-[#00398A] focus:ring-opacity-50"
                        >
                            <option value="baja">Baja (Pocos objetos)</option>
                            <option value="normal">Normal (Cantidad moderada)</option>
                            <option value="alta">Alta (Muchos objetos)</option>
                        </select>
                        <p className="text-sm text-gray-500 mt-1">
                            Define la cantidad de objetos que aparecerán en el sendero
                        </p>
                    </div>
                    
                    {/* Número de rondas */}
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
                            {[1, 2, 3, 4, 5].map(num => (
                                <option key={num} value={num}>
                                    {num} {num === 1 ? 'ronda' : 'rondas'}
                                </option>
                            ))}
                        </select>
                        <p className="text-sm text-gray-500 mt-1">
                            Selecciona cuántas rondas tendrá la sesión de juego
                        </p>
                    </div>
                    
                    {/* Tiempo límite */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Tiempo Límite por Ronda
                        </label>
                        <select
                            name="timeLimit"
                            value={config.timeLimit}
                            onChange={handleConfigChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 
                                     focus:border-[#00398A] focus:ring focus:ring-[#00398A] focus:ring-opacity-50"
                        >
                            <option value={30}>30 segundos</option>
                            <option value={60}>1 minuto</option>
                            <option value={120}>2 minutos</option>
                            <option value={180}>3 minutos</option>
                            <option value={300}>5 minutos</option>
                        </select>
                        <p className="text-sm text-gray-500 mt-1">
                            Establece un límite de tiempo para cada ronda
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

export default ForestConfig;