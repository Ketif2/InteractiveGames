// server/src/controllers/games/puzzleController.js

import pool from '../../config/db.js';

    // Guardar configuración del puzzle
    const savePuzzleConfig = async (req, res) => {
        const { sessionId } = req.params;
        const { difficulty, gridSize, selectedPuzzles } = req.body;
        
        try {
            // Verificar que la sesión exista
            const [session] = await pool.query(
                'SELECT * FROM sesion WHERE id_sesion = ?',
                [sessionId]
            );
    
            if (session.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Sesión no encontrada'
                });
            }
    
            // Guardar la configuración (incluye difficulty explícitamente)
            const [result] = await pool.query(
                `INSERT INTO configuracion_puzzle (
                    id_sesion, 
                    dificultad,
                    tamano_grid, 
                    cantidad_puzzles, 
                    imagenes_seleccionadas, 
                    fecha_creacion
                ) VALUES (?, ?, ?, ?, ?, NOW())`,
                [
                    sessionId,
                    difficulty, // Agregamos dificultad explícitamente
                    `${gridSize}x${gridSize}`, 
                    selectedPuzzles.length, 
                    JSON.stringify(selectedPuzzles)
                ]
            );
    
            res.status(201).json({
                success: true,
                configId: result.insertId,
                difficulty, // Incluimos en la respuesta
                message: 'Configuración guardada exitosamente'
            });
        } catch (error) {
            console.error('Error al guardar la configuración:', error);
            res.status(500).json({
                success: false,
                message: 'Error al guardar la configuración del puzzle'
            });
        }
    };

    // Obtener configuración por ID
    const getPuzzleConfig = async (req, res) => {
        const { configId } = req.params;

        try {
            const [config] = await pool.query(
                'SELECT * FROM configuracion_puzzle WHERE id_configuracion = ?',
                [configId]
            );

            if (config.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Configuración no encontrada'
                });
            }

            // Parsear las imágenes seleccionadas
            const configData = {
                ...config[0],
                imagenes_seleccionadas: JSON.parse(config[0].imagenes_seleccionadas)
            };

            res.status(200).json({
                success: true,
                config: configData
            });
        } catch (error) {
            console.error('Error al obtener la configuración:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener la configuración del puzzle'
            });
        }
    };

    // Guardar estadísticas del puzzle
    const savePuzzleStats = async (req, res) => {
        const { configId } = req.params;
        const { 
            totalTime,
            successMoves,
            failedMoves,
            helpCount,
            pauseCount,
            completed
        } = req.body;

        try {
            // Verificar que exista la configuración
            const [config] = await pool.query(
                'SELECT * FROM configuracion_puzzle WHERE id_configuracion = ?',
                [configId]
            );

            if (config.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Configuración no encontrada'
                });
            }

            // Guardar las estadísticas
            const [result] = await pool.query(
                `INSERT INTO estadisticas_juego (
                    id_sesion, 
                    tiempo_transcurrido, 
                    num_errores, 
                    num_aciertos,
                    num_pausas,
                    num_ayudas,
                    completado,
                    fecha_inicio,
                    fecha_fin
                ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW() - INTERVAL ? SECOND, NOW())`,
                [
                    config[0].id_sesion,
                    totalTime,
                    failedMoves,
                    successMoves,
                    pauseCount || 0,
                    helpCount || 0,
                    completed || false,
                    totalTime
                ]
            );

            res.status(201).json({
                success: true,
                statsId: result.insertId,
                message: 'Estadísticas guardadas exitosamente'
            });
        } catch (error) {
            console.error('Error al guardar estadísticas:', error);
            res.status(500).json({
                success: false,
                message: 'Error al guardar las estadísticas del puzzle'
            });
        }
    };

    // Guardar sesión completa (config, stats, observaciones)
    const savePuzzleSessionComplete = async (req, res) => {
        const { sessionId } = req.params;
        const { config, stats, observations } = req.body;
        
        try {
            // Iniciar transacción
            await pool.query('START TRANSACTION');
            
            // 1. Actualizar la sesión con las observaciones y estadísticas básicas
            await pool.query(
                `UPDATE sesion 
                SET observaciones_terapeuta = ?,
                    aciertos = ?,
                    fallos = ?,
                    duracion = ?
                WHERE id_sesion = ?`,
                [
                    observations || '', 
                    stats.successMoves || 0, 
                    stats.failedMoves || 0, 
                    Math.ceil(stats.totalTime / 60), // Convertir segundos a minutos
                    sessionId
                ]
            );
            
            // 2. Guardar o actualizar la configuración del puzzle
            let configId;
            if (config.id) {
                // Si ya existe la configuración, actualizarla
                await pool.query(
                    `UPDATE configuracion_puzzle 
                    SET tamano_grid = ?, 
                        cantidad_puzzles = ?, 
                        imagenes_seleccionadas = ? 
                    WHERE id_configuracion = ?`,
                    [
                        `${config.gridSize}x${config.gridSize}`,
                        config.selectedPuzzles.length,
                        JSON.stringify(config.selectedPuzzles),
                        config.id
                    ]
                );
                configId = config.id;
            } else {
                // Si no existe, crear nueva configuración
                const [configResult] = await pool.query(
                    `INSERT INTO configuracion_puzzle (
                        id_sesion,
                        tamano_grid,
                        cantidad_puzzles,
                        imagenes_seleccionadas,
                        fecha_creacion
                    ) VALUES (?, ?, ?, ?, NOW())`,
                    [
                        sessionId,
                        `${config.gridSize}x${config.gridSize}`,
                        config.selectedPuzzles.length,
                        JSON.stringify(config.selectedPuzzles)
                    ]
                );
                configId = configResult.insertId;
            }
            
            // 3. Guardar las estadísticas detalladas
            await pool.query(
                `INSERT INTO estadisticas_juego (
                    id_sesion,
                    tiempo_transcurrido,
                    num_errores,
                    num_aciertos,
                    num_pausas,
                    num_ayudas,
                    completado,
                    fecha_inicio,
                    fecha_fin,
                    observaciones
                ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW() - INTERVAL ? SECOND, NOW(), ?)`,
                [
                    sessionId,
                    stats.totalTime,
                    stats.failedMoves,
                    stats.successMoves,
                    stats.pauseCount || 0,
                    stats.helpCount || 0,
                    stats.completed || true,
                    stats.totalTime,
                    observations || ''
                ]
            );
            
            // Confirmar transacción
            await pool.query('COMMIT');
            
            res.status(200).json({
                success: true,
                message: 'Datos de la sesión guardados exitosamente',
                sessionId,
                configId
            });
        } catch (error) {
            // Revertir en caso de error
            await pool.query('ROLLBACK');
            console.error('Error al guardar datos de la sesión:', error);
            res.status(500).json({
                success: false,
                message: 'Error al guardar los datos de la sesión'
            });
        }
    };

    // Actualizar configuración del puzzle
    const updatePuzzleConfig = async (req, res) => {
        const { configId } = req.params;
        const { completado, tiempo_fin } = req.body;

        try {
            // Verificar que exista la configuración
            const [config] = await pool.query(
                'SELECT * FROM configuracion_puzzle WHERE id_configuracion = ?',
                [configId]
            );

            if (config.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Configuración no encontrada'
                });
            }

            // Actualizar la configuración
            await pool.query(
                `UPDATE configuracion_puzzle 
                SET completado = ?,
                    tiempo_fin = ?
                WHERE id_configuracion = ?`,
                [completado, tiempo_fin || new Date(), configId]
            );

            res.status(200).json({
                success: true,
                message: 'Configuración actualizada exitosamente'
            });
        } catch (error) {
            console.error('Error al actualizar configuración:', error);
            res.status(500).json({
                success: false,
                message: 'Error al actualizar la configuración'
            });
        }
    };

    // Obtener estadísticas de sesión
    const getPuzzleSessionStats = async (req, res) => {
        const { sessionId } = req.params;

        try {
            const [stats] = await pool.query(
                `SELECT 
                    pc.*,
                    ej.tiempo_transcurrido,
                    ej.num_errores,
                    ej.num_aciertos,
                    ej.num_pausas,
                    ej.num_ayudas,
                    ej.completado,
                    ej.fecha_inicio,
                    ej.fecha_fin,
                    ej.observaciones,
                    s.observaciones_terapeuta,
                    s.aciertos,
                    s.fallos,
                    s.duracion
                FROM configuracion_puzzle pc 
                JOIN sesion s ON pc.id_sesion = s.id_sesion
                LEFT JOIN estadisticas_juego ej ON pc.id_sesion = ej.id_sesion 
                WHERE pc.id_sesion = ?`,
                [sessionId]
            );

            if (stats.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'No se encontraron estadísticas para esta sesión'
                });
            }

            res.status(200).json({
                success: true,
                stats
            });
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener las estadísticas de la sesión'
            });
        }
    };

    // Obtener imágenes jugadas por paciente
    const getPlayedImagesByPatient = async (req, res) => {
        const { patientId } = req.params;

        try {
            const [results] = await pool.query(
                `SELECT 
                    pc.imagenes_seleccionadas,
                    s.fecha_sesion
                FROM configuracion_puzzle pc
                JOIN sesion s ON pc.id_sesion = s.id_sesion
                WHERE s.id_paciente = ?
                ORDER BY s.fecha_sesion DESC`,
                [patientId]
            );

            // Extraer y aplanar las imágenes jugadas
            const playedImages = [];
            results.forEach(row => {
                try {
                    const images = JSON.parse(row.imagenes_seleccionadas);
                    if (Array.isArray(images)) {
                        playedImages.push(...images.map(img => ({
                            ...img,
                            fecha_jugada: row.fecha_sesion
                        })));
                    }
                } catch (err) {
                    console.error('Error al parsear imágenes:', err);
                }
            });

            res.status(200).json({
                success: true,
                playedImages
            });
        } catch (error) {
            console.error('Error al obtener imágenes jugadas:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener las imágenes jugadas'
            });
        }
    };

    // Obtener imágenes recomendadas
    const getRecommendedImages = async (req, res) => {
        const { patientId } = req.params;
        const { difficulty } = req.query;

        try {
            // Primero obtenemos las imágenes jugadas recientemente
            const [recentImages] = await pool.query(
                `SELECT 
                    pc.imagenes_seleccionadas
                FROM configuracion_puzzle pc
                JOIN sesion s ON pc.id_sesion = s.id_sesion
                WHERE s.id_paciente = ?
                ORDER BY s.fecha_sesion DESC
                LIMIT 10`,
                [patientId]
            );

            // Extraer IDs de imágenes jugadas recientemente
            const recentlyPlayedIds = new Set();
            recentImages.forEach(row => {
                try {
                    const images = JSON.parse(row.imagenes_seleccionadas);
                    if (Array.isArray(images)) {
                        images.forEach(img => recentlyPlayedIds.add(img.id));
                    }
                } catch (err) {
                    console.error('Error al parsear imágenes recientes:', err);
                }
            });

            // Definir imágenes disponibles según la dificultad
            const PUZZLE_IMAGES = {
                medium: [
                    { id: '1M', name: 'Alpacas', path: 'Alpacas.jpg' },
                    { id: '2M', name: 'Cangrejos', path: 'Cangrejos.jpg' },
                    { id: '3M', name: 'Foca', path: 'Foca.jpg' },
                    { id: '4M', name: 'Laguna', path: 'Laguna.jpg' },
                    { id: '5M', name: 'MitadMund', path: 'MitadMund.jpg' },
                    { id: '6M', name: 'Pajarito', path: 'Pajarito.jpg' },
                    { id: '7M', name: 'Pajaritos', path: 'Pajaritos.jpg' },
                    { id: '8M', name: 'Signal', path: 'Signal.jpg' },
                    { id: '9M', name: 'Stop', path: 'Stop.jpg' },
                    { id: '10M', name: 'Volcan', path: 'Volcan.jpg' }
                ],
                hard: [
                    { id: '1H', name: 'Bandera ECU', path: 'BanderaECU.jpg' },
                    { id: '2H', name: 'Birds', path: 'Birds.jpg' },
                    { id: '3H', name: 'Capillas', path: 'Capillas.jpg' },
                    { id: '4H', name: 'Colibri', path: 'Colibri.jpg' },
                    { id: '5H', name: 'Fin Año', path: 'FinAnio.jpg' },
                    { id: '6H', name: 'Foca', path: 'Foca.jpg' },
                    { id: '7H', name: 'Laguna', path: 'Laguna.jpg' },
                    { id: '8H', name: 'Panecillo', path: 'Panecillo.jpg' },
                    { id: '9H', name: 'Quito Centro', path: 'QuitoCentro.jpg' },
                    { id: '10H', name: 'Quito Centro B', path: 'QuitoCentroD.jpg' }
                ]
            };

            // Obtener todas las imágenes disponibles según dificultad
            let availableImages;
            if (difficulty === 'random') {
                // Para random, generamos URLs aleatorias
                availableImages = Array(10).fill().map((_, index) => ({
                    id: `R${index + 1}`,
                    name: `Random ${index + 1}`,
                    url: `https://picsum.photos/1200/1200?random=${Math.random()}`
                }));
            } else {
                // Para medium o hard, usamos las predefinidas
                const imagesForDifficulty = PUZZLE_IMAGES[difficulty] || [];
                
                availableImages = imagesForDifficulty.map(img => ({
                    id: img.id,
                    name: img.name,
                    url: `/src/assets/images/puzzle/${difficulty}/${img.path}`
                }));
            }
            
            // Filtrar para excluir imágenes jugadas recientemente
            let recommendedImages = availableImages.filter(img => !recentlyPlayedIds.has(img.id));
            
            // Si quedan pocas imágenes, completar con algunas de las jugadas
            if (recommendedImages.length < 5 && difficulty !== 'random') {
                const imagesToAdd = availableImages.filter(img => recentlyPlayedIds.has(img.id))
                                                .sort(() => Math.random() - 0.5)
                                                .slice(0, 5 - recommendedImages.length);
                recommendedImages.push(...imagesToAdd);
            }
            
            // Para random siempre generamos nuevas
            if (difficulty === 'random') {
                recommendedImages = Array(10).fill().map((_, index) => ({
                    id: `R${index + 1}`,
                    name: `Random ${index + 1}`,
                    url: `https://picsum.photos/1200/1200?random=${Math.random()}`
                }));
            }

            res.status(200).json({
                success: true,
                images: recommendedImages
            });
        } catch (error) {
            console.error('Error al obtener imágenes recomendadas:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener imágenes recomendadas'
            });
        }
    };

// Exportación única de todas las funciones
export {
    savePuzzleConfig,
    savePuzzleStats,
    getPuzzleSessionStats,
    updatePuzzleConfig,
    getPuzzleConfig,
    getPlayedImagesByPatient,
    getRecommendedImages,
    savePuzzleSessionComplete
};