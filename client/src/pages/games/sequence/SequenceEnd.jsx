// src/pages/games/sequence/SequenceEnd.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { sessionService } from '../../../services/sessionService';
import { statsService } from '../../../services/statsService';
import { sequenceService } from '../../../services/sequenceService'; // Importamos el servicio
import { useAuth } from '@/context/AuthContext';
import { AlertTriangle } from 'lucide-react';

const SequenceEnd = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { stats, config, patientId } = location.state || {};
    const [loading, setLoading] = useState(false);
    const [observations, setObservations] = useState('');
    const [error, setError] = useState(null);
    const { user } = useAuth();

    console.log('Estado recibido en SequenceEnd:', location.state);
    
    // Debugueando las propiedades específicas de stats
    if (stats) {
        console.log('Stats detallados:', {
            totalTime: stats.totalTime,
            failedCount: stats.failedCount,
            successCount: stats.successCount,
            totalPauses: stats.totalPauses,
            helpCount: stats.helpCount,
            completed: stats.completed,
            completedType: typeof stats.completed
        });
    }

    // Cálculos adicionales para estadísticas
    const accuracy = stats ? Math.round((stats.successCount / (stats.successCount + stats.failedCount)) * 100) : 0;
    const timeInMinutes = stats ? Math.floor(stats.totalTime / 60) : 0;
    const successesPerMinute = stats ? (stats.successCount / (stats.totalTime / 60)).toFixed(1) : 0;
    const errorsPerMinute = stats ? (stats.failedCount / (stats.totalTime / 60)).toFixed(1) : 0;

// Reemplaza la función handleFinishSession en SequenceEnd.jsx

const handleFinishSession = async () => {
    setLoading(true);
    setError(null);
    
    try {
        // Verificar si tenemos patientId
        if (!patientId) {
            throw new Error('No se pudo encontrar el ID del paciente');
        }

        if (!user?.id) {
            throw new Error('No se pudo encontrar el ID del terapeuta. Por favor inicie sesión nuevamente.');
        }

        console.log('Creando sesión para paciente:', patientId);
        
        // 1. Crear la sesión y extraer ID
        let sessionId = null;
        try {
            const sessionResponse = await sessionService.createSession({
                id_paciente: patientId,
                id_juego: 3, // ID del juego de secuencia
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
        
        // 2. Si no obtuvimos el ID, intentar obtener el último ID conocido desde la BD
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
            // Asegurarse de que los valores booleanos se conviertan correctamente a 0 o 1
            const isCompleted = stats.completed === true ? 1 : 0;
            
            // Registrar estadísticas
            await statsService.registerStats({
                id_sesion: sessionId,
                tiempo_transcurrido: stats.totalTime,
                num_errores: stats.failedCount,
                num_aciertos: stats.successCount,
                num_pausas: stats.totalPauses || 0,
                num_ayudas: stats.helpCount || 0,
                completado: isCompleted
            });
            
            console.log('Estadísticas registradas correctamente');
            
            // Asegurarse de que modo_juego sea uno de los valores permitidos por el ENUM
            let modoJuego = config.gameMode.toLowerCase();
            
            // Validar que el modo de juego esté dentro de los valores permitidos
            if (!['normal', 'desvanecimiento', 'revuelto'].includes(modoJuego)) {
                // Si no es un valor válido, usar 'normal' como predeterminado
                modoJuego = 'normal';
            }
            
            // Registrar la configuración de la secuencia
            await sequenceService.registerSequenceConfig({
                id_sesion: sessionId,
                rango_inicial: config.startRange,
                rango_final: config.endRange,
                numeros_ocultar: config.numbersToHide,
                modo_juego: modoJuego
            });
            
            console.log('Configuración registrada correctamente');
            
            // Navegar a la página de sesiones con mensaje de éxito
            navigate('/new-session', { 
                state: { 
                    success: true,
                    message: 'Sesión completada y guardada correctamente'
                }
            });
        } catch (statsError) {
            console.error('Error al registrar estadísticas o configuración:', statsError);
            
            // Continuamos aunque falle el registro de estadísticas
            navigate('/new-session', { 
                state: { 
                    success: true,
                    warning: true,
                    message: 'Sesión guardada, pero hubo un problema al registrar estadísticas'
                }
            });
        }
    } catch (error) {
        console.error('Error general en el proceso:', error);
        setError(error.message || 'Error al guardar los resultados');
    } finally {
        setLoading(false);
    }
};

    const handlePlayAgain = () => {
        if (!patientId) {
            console.error("SequenceEnd - No se encontró el ID del paciente.");
            setError("No se pudo encontrar el ID del paciente.");
            return;
        }

        console.log(`SequenceEnd - Redirigiendo a /games/sequence/config con patientId: ${patientId}`);
        navigate('/games/sequence/config', { 
            state: { patientId } 
        });
    };

    // Si no hay estadísticas o configuración, mostrar error
    if (!stats || !config) {
        return (
            <div className="h-[calc(100vh-10rem)] flex flex-col items-center justify-center bg-gray-50">
                <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
                <h2 className="text-xl font-semibold text-gray-800 mb-2">No se encontraron datos del juego</h2>
                <p className="text-gray-600 mb-6">No se pudieron cargar las estadísticas o la configuración del juego.</p>
                <button
                    onClick={() => navigate('/games')}
                    className="px-6 py-2 bg-[#00398A] text-white rounded-lg hover:bg-[#002d6f] transition-colors"
                >
                    Volver a Juegos
                </button>
            </div>
        );
    }

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
                            className="w-full h-[calc(100%-2rem)] p-3 border rounded-lg resize-none"
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
                            value={`${timeInMinutes}min ${stats.totalTime % 60}s`} 
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

            {/* Mensaje de error */}
            {error && (
                <div className="p-4 bg-red-100 border border-red-200 text-red-700 text-center rounded mx-4 mb-4">
                    {error}
                </div>
            )}

            {/* Botones */}
            <div className="mt-2 bg-white flex justify-center gap-4">
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