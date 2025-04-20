// src/pages/games/memory/MemoryEnd.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { sessionService } from '../../../services/sessionService';
import { statsService } from '../../../services/statsService';
import { useAuth } from '@/context/AuthContext';
import { memoryService } from '../../../services/memoryService';
import { availableCategories } from '../../../data/memoryObjects';

const MemoryEnd = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { stats, config, patientId } = location.state || {};
    const [loading, setLoading] = useState(false);
    const [observations, setObservations] = useState('');
    const { user } = useAuth();

    // Cálculos para estadísticas
    const timeInMinutes = stats ? Math.floor(stats.totalTime / 60) : 0;
    const timeInSeconds = stats ? stats.totalTime % 60 : 0;
    const successRate = stats && (stats.attempts > 0) 
        ? Math.round((stats.num_aciertos / (stats.attempts + 1)) * 100)
        : stats && stats.completado ? 100 : 0;
    
    // Obtener el nombre de la categoría
    const getCategoryLabel = (categoryValue) => {
        const category = availableCategories.find(cat => cat.value === categoryValue);
        return category ? category.label : 'No disponible';
    };

// Reemplaza la función handleFinishSession en MemoryEnd.jsx

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

        console.log('Creando sesión para paciente:', patientId);
        
        // 1. Crear la sesión y extraer ID
        let sessionId = null;
        try {
            const sessionResponse = await sessionService.createSession({
                id_paciente: patientId,
                id_juego: 2, // ID del juego de memoria
                id_terapeuta: user.id,
                observaciones_terapeuta: observations
            });
            
            console.log('Respuesta completa de createSession:', JSON.stringify(sessionResponse));
            
            // Intentar extraer ID de varias formas posibles
            if (sessionResponse && typeof sessionResponse === 'object') {
                if (sessionResponse.id) {
                    sessionId = sessionResponse.id;
                } else if (sessionResponse.insertId) {
                    sessionId = sessionResponse.insertId;
                } else if (sessionResponse.id_sesion) {
                    sessionId = sessionResponse.id_sesion;
                } else if (sessionResponse.data && sessionResponse.data.id) {
                    sessionId = sessionResponse.data.id;
                }
            }
            
            console.log('ID extraído de createSession:', sessionId);
        } catch (createError) {
            console.error('Error al crear sesión:', createError);
            throw new Error('Error al crear la sesión');
        }
        
        // 2. Si no obtuvimos el ID, intentar usar el último ID conocido
        if (!sessionId) {
            try {
                console.log('Intentando obtener el último ID conocido desde getAllSessions');
                const allSessionsResponse = await sessionService.getAllSessions();
                
                if (Array.isArray(allSessionsResponse) && allSessionsResponse.length > 0) {
                    // Ordenar por ID de sesión de forma descendente
                    const sortedSessions = [...allSessionsResponse].sort((a, b) => 
                        (b.id_sesion || 0) - (a.id_sesion || 0)
                    );
                    
                    const latestSession = sortedSessions[0];
                    if (latestSession && latestSession.id_sesion) {
                        sessionId = latestSession.id_sesion;
                        console.log('Usando el ID más reciente encontrado:', sessionId);
                    } else {
                        console.warn('No se encontraron sesiones con ID válido');
                    }
                } else {
                    console.warn('No se pudieron obtener sesiones o el formato es incorrecto');
                }
            } catch (error) {
                console.error('Error al intentar obtener todas las sesiones:', error);
            }
        }
        
        // 3. Si aún no tenemos ID, redirigir sin guardar más detalles
        if (!sessionId) {
            console.warn('No se pudo obtener un ID de sesión válido, redirección simple');
            navigate('/new-session', { 
                state: { 
                    success: true,
                    warning: true,
                    message: 'Sesión guardada, pero no se pudieron registrar estadísticas'
                }
            });
            return;
        }
        
        // 4. Si llegamos aquí, tenemos un ID y podemos intentar guardar estadísticas
        console.log('Registrando estadísticas con ID de sesión:', sessionId);
        
        try {
            // Registrar estadísticas
            await statsService.registerStats({
                id_sesion: sessionId,
                tiempo_transcurrido: stats.totalTime, 
                num_errores: stats.num_errores,
                num_aciertos: stats.num_aciertos,
                num_pausas: stats.totalPauses || 0,
                num_ayudas: stats.helpCount || 0,
                completado: stats.completado ? 1 : 0
            });
            
            console.log('Estadísticas registradas correctamente');

            // Formato correcto para dificultad
            const dificultadFormatted = 
                config.difficulty === 'fácil' ? 'Fácil' : 
                config.difficulty === 'medio' ? 'Medio' : 
                config.difficulty === 'difícil' ? 'Difícil' : 'Medio';
            
            // Registrar configuración
            await memoryService.registerMemoryConfig({ 
                id_sesion: sessionId,
                dificultad: dificultadFormatted,
                categoria: config.category,
                numero_rondas: stats.totalRounds
            });
            
            console.log('Configuración registrada correctamente');
            
            navigate('/new-session', { 
                state: { 
                    success: true,
                    message: 'Sesión completada y guardada correctamente'
                }
            });
        } catch (statsError) {
            console.error('Error al registrar estadísticas o configuración:', statsError);
            
            navigate('/new-session', { 
                state: { 
                    success: true,
                    warning: true,
                    message: 'Sesión guardada, pero hubo un problema al registrar estadísticas'
                }
            });
        }
    } catch (error) {
        console.error('Error al guardar la sesión:', error);
        alert('Ha ocurrido un error al guardar la sesión. Por favor, intente nuevamente.');
    } finally {
        setLoading(false);
    }
};

    const handlePlayAgain = () => {
        navigate('/games/memory/config', { 
            state: { patientId } 
        });
    };

    return (
        <div className="h-[calc(100vh-10rem)] flex flex-col bg-gray-50">
            {/* Header */}
            <div className="bg-[#00398A] text-white py-2 px-6">
                <h1 className="text-xl font-semibold">Resultados del Juego de Memoria</h1>
            </div>

            {/* Contenido principal */}
            <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-0">
                {/* Columna izquierda */}
                <div className="flex flex-col gap-4 h-full">
                    {/* Configuración */}
                    <section className="bg-white rounded-lg shadow p-4">
                        <h2 className="text-lg font-semibold text-[#00398A] mb-2">
                            Configuración Sesión
                        </h2>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Dificultad:</span>
                                <span className="bg-blue-100 px-3 py-1 rounded capitalize">
                                    {config?.difficulty || 'No disponible'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Modo de juego:</span>
                                <span className="bg-blue-100 px-3 py-1 rounded capitalize">
                                    {config?.gameMode || 'No disponible'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Categoría:</span>
                                <span className="bg-blue-100 px-3 py-1 rounded">
                                    {getCategoryLabel(config?.category) || 'Todos los objetos'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Número de rondas configuradas:</span>
                                <span className="bg-green-100 px-3 py-1 rounded text-green-700 font-semibold">
                                    {stats?.totalRounds || 3}
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
                        Estadísticas Acumuladas
                    </h2>
                    <div className="space-y-3 flex-1">
                        <StatItem 
                            label="Tiempo total" 
                            value={`${timeInMinutes}m ${timeInSeconds}s`} 
                        />
                        <StatItem 
                            label="Respuestas correctas" 
                            value={stats?.num_aciertos || 0} 
                            highlightPositive={true}
                        />
                        <StatItem 
                            label="Errores cometidos" 
                            value={stats?.num_errores || 0} 
                            highlightNegative={true}
                        />
                        <StatItem 
                            label="Ayudas utilizadas" 
                            value={stats?.helpCount || 0} 
                        />
                        {config?.gameMode === 'memoria' && (
                            <StatItem 
                                label="Veces mostrados objetos" 
                                value={stats?.memoryShows || 0} 
                            />
                        )}
                        <StatItem 
                            label="Tasa de éxito" 
                            value={`${successRate}%`} 
                            highlightPositive={true}
                        />
                        <StatItem 
                            label="Número de pausas" 
                            value={stats?.totalPauses || 0} 
                        />
                        <StatItem 
                            label="Completado" 
                            value={stats?.completado ? 'Sí' : 'No'} 
                            highlightPositive={stats?.completado}
                        />
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <h3 className="text-md font-semibold text-[#00398A] mb-2">
                                Promedio por ronda
                            </h3>
                            <StatItem 
                                label="Aciertos por ronda" 
                                value={(stats?.num_aciertos / stats?.totalRounds).toFixed(1)} 
                                highlightPositive={true}
                            />
                            <StatItem 
                                label="Errores por ronda" 
                                value={(stats?.num_errores / stats?.totalRounds).toFixed(1)} 
                                highlightNegative={true}
                            />
                        </div>
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

const StatItem = ({ label, value, highlightPositive = false, highlightNegative = false }) => (
    <div className="flex justify-between items-center py-1.5">
        <span className="text-gray-600">{label}:</span>
        <span className={`font-medium ${highlightPositive ? 'text-green-600' : ''} ${highlightNegative ? 'text-red-600' : ''}`}>
            {value}
        </span>
    </div>
);

export default MemoryEnd;