// src/pages/games/sequence/SequenceEnd.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// import { sequenceService } from '../../../services/sequenceService';

const SequenceEnd = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { stats, config, patientId } = location.state || {};
    
    const [observation, setObservation] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleRepeatSession = () => {
        navigate('/games/sequence/config');
    };

    const handleFinishSession = async () => {
        setIsSubmitting(true);
        try {
            // Aquí es donde guardaríamos todo en la BD
            // await sequenceService.saveSession({
            //     config,
            //     stats,
            //     patientId,
            //     observation
            // });
            
            // Por ahora solo navegamos de vuelta
            navigate('/new-session');
        } catch (error) {
            console.error('Error al guardar la sesión:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Calcular estadísticas adicionales
    const successPerMinute = (stats.successCount / (stats.totalTime / 60)).toFixed(1);
    const errorsPerMinute = (stats.failedCount / (stats.totalTime / 60)).toFixed(1);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-[#00398A] mb-6">
                    Resultados de la Secuencia Numérica
                </h1>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Configuración */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-[#00398A] mb-4">
                            Configuración Sesión
                        </h2>
                        <dl className="space-y-2">
                            <div>
                                <dt className="text-gray-600">Rango:</dt>
                                <dd>{config.startRange} - {config.endRange}</dd>
                            </div>
                            <div>
                                <dt className="text-gray-600">Números a ocultar:</dt>
                                <dd>{config.numbersToHide}</dd>
                            </div>
                            <div>
                                <dt className="text-gray-600">Modo de juego:</dt>
                                <dd className="capitalize">{config.gameMode}</dd>
                            </div>
                        </dl>
                    </div>

                    {/* Estadísticas */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-[#00398A] mb-4">
                            Estadísticas
                        </h2>
                        <dl className="space-y-2">
                            <div>
                                <dt className="text-gray-600">Tiempo transcurrido:</dt>
                                <dd>{Math.floor(stats.totalTime / 60)}min</dd>
                            </div>
                            <div>
                                <dt className="text-gray-600">Número de errores:</dt>
                                <dd>{stats.failedCount}</dd>
                            </div>
                            <div>
                                <dt className="text-gray-600">Número de aciertos:</dt>
                                <dd>{stats.successCount}</dd>
                            </div>
                            <div>
                                <dt className="text-gray-600">Número de pausas:</dt>
                                <dd>{stats.totalPauses}</dd>
                            </div>
                            <div>
                                <dt className="text-gray-600">Aciertos por minuto:</dt>
                                <dd>{successPerMinute} aciertos/min</dd>
                            </div>
                            <div>
                                <dt className="text-gray-600">Errores por minuto:</dt>
                                <dd>{errorsPerMinute} errores/min</dd>
                            </div>
                        </dl>
                    </div>
                </div>

                {/* Observaciones */}
                <div className="mt-8 bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-[#00398A] mb-4">
                        Observaciones
                    </h2>
                    <textarea
                        value={observation}
                        onChange={(e) => setObservation(e.target.value)}
                        placeholder="Ingrese sus observaciones aquí..."
                        className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-[#00398A] 
                                 focus:border-transparent resize-none"
                    />
                </div>

                {/* Botones */}
                <div className="mt-8 flex justify-end gap-4">
                    <button
                        onClick={handleRepeatSession}
                        className="px-6 py-2 bg-[#00A8E3] text-white rounded hover:bg-[#0096cc] 
                                 transition-colors disabled:opacity-50"
                        disabled={isSubmitting}
                    >
                        Repetir Sesión
                    </button>
                    <button
                        onClick={handleFinishSession}
                        className="px-6 py-2 bg-[#00398A] text-white rounded hover:bg-[#002d6f] 
                                 transition-colors disabled:opacity-50"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Guardando...' : 'Terminar Sesión'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SequenceEnd;