// src/pages/games/sequence/SequenceEnd.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { sessionService } from '../../../services/sessionService';
import { statsService } from '../../../services/statsService';
import { useAuth } from '@/context/AuthContext';

const SequenceEnd = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { stats, config, patientId } = location.state || {};
    const [loading, setLoading] = useState(false);
    const [observations, setObservations] = useState('');
    const { user } = useAuth();

    // Cálculos adicionales para estadísticas
    const accuracy = stats ? Math.round((stats.successCount / (stats.successCount + stats.failedCount)) * 100) : 0;
    const timeInMinutes = stats ? Math.floor(stats.totalTime / 60) : 0;
    const successesPerMinute = stats ? (stats.successCount / (stats.totalTime / 60)).toFixed(1) : 0;
    const errorsPerMinute = stats ? (stats.failedCount / (stats.totalTime / 60)).toFixed(1) : 0;

    const handleFinishSession = async () => {
        setLoading(true);
        try {
            
        // Verificar que el usuario esté autenticado y exista el paciente
            if (!user?.id) {
                throw new Error('No se pudo encontrar el ID del terapeuta. Por favor inicie sesión nuevamente.');
            }

            if (!patientId) {
                throw new Error('No se pudo encontrar el ID del paciente.');
            }
    
            await sessionService.createSession({
                id_paciente: patientId, // ID del paciente
                id_juego: 3, // ID del juego de rompecabezas
                id_terapeuta: user.id//localStorage.getItem('userId') // Asumiendo que guardas el ID del terapeuta en localStorage
            });

            const id_sesion = await sessionService.getLastSession(patientId);
                  await statsService.registerStats({
                    id_sesion: id_sesion.id_sesion,
                    tiempo_transcurrido: stats.totalTime,
                    num_errores: stats.failedMoves,
                    num_aciertos: stats.successMoves,
                    num_pausas: stats.pauseCount || 0,
                    num_ayudas: stats.helpCount || 0,
                    completado: stats.completed
                  });

            navigate('/new-session');
        } catch (error) {
            console.error('Error al guardar la sesión:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePlayAgain = () => {
        navigate('/games/sequence/config', { 
            state: { patientId } 
        });
    };

    return (
        <div className="h-[calc(100vh-10rem)] flex flex-col bg-gray-50">
            {/* Header */}
            <div className="bg-[#00398A] text-white py-2 px-6">
                <h1 className="text-xl font-semibold">Resultados de la Secuencia Numérica</h1>
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
                                <span className="text-gray-600">Rango de números:</span>
                                <span className="bg-blue-100 px-3 py-1 rounded">
                                    {config.startRange} - {config.endRange}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Números a ocultar:</span>
                                <span className="bg-blue-100 px-3 py-1 rounded">
                                    {config.numbersToHide}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Modo de juego:</span>
                                <span className="bg-blue-100 px-3 py-1 rounded capitalize">
                                    {config.gameMode}
                                </span>
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
                        <StatItem 
                            label="Tiempo transcurrido" 
                            value={`${timeInMinutes}min`} 
                        />
                        <StatItem 
                            label="Número de errores" 
                            value={stats?.failedCount || 0} 
                        />
                        <StatItem 
                            label="Número de aciertos" 
                            value={stats?.successCount || 0} 
                        />
                        <StatItem 
                            label="Número de pausas" 
                            value={stats?.totalPauses || 0} 
                        />
                        <StatItem 
                            label="Número de ayudas" 
                            value={stats?.helpCount || 0} 
                        />
                        {config.gameMode === 'memoria' && (
                            <StatItem 
                                label="Veces mostrados números" 
                                value={stats?.memoryShows || 0} 
                            />
                        )}
                        <StatItem 
                            label="Aciertos por minuto" 
                            value={`${successesPerMinute} aciertos/min`} 
                        />
                        <StatItem 
                            label="Errores por minuto" 
                            value={`${errorsPerMinute} errores/min`} 
                        />
                        <StatItem 
                            label="Precisión" 
                            value={`${accuracy}%`} 
                        />
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

export default SequenceEnd;