// src/pages/games/puzzle/PuzzleConfig.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { puzzleService } from '../../../services/puzzleService';

const PuzzleConfig = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { patientId } = location.state || {};

    const [config, setConfig] = useState({
        selectedImages: [],
        gridSize: '4x4',
        puzzleCount: 1
    });

    const [mediumImages] = useState(puzzleService.getImages('medium'));
    const [hardImages] = useState(puzzleService.getImages('hard'));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleImageSelect = (imageId, imageUrl) => {
        setConfig(prev => {
            const newSelectedImages = [...prev.selectedImages];
            const existingIndex = newSelectedImages.findIndex(img => img.id === imageId);

            // Si la imagen ya está seleccionada, la removemos
            if (existingIndex !== -1) {
                newSelectedImages.splice(existingIndex, 1);
                return { ...prev, selectedImages: newSelectedImages };
            }

            // Si ya tenemos el máximo de imágenes permitidas, removemos la primera
            if (newSelectedImages.length >= prev.puzzleCount) {
                newSelectedImages.shift();
            }

            // Agregamos la nueva imagen
            newSelectedImages.push({
                id: imageId,
                url: imageUrl,
                difficulty: imageId.endsWith('M') ? 'medium' : 'hard'
            });

            return { ...prev, selectedImages: newSelectedImages };
        });
    };

    const handleConfigChange = (e) => {
        const { name, value } = e.target;
        setConfig(prev => {
            if (name === 'puzzleCount') {
                const newCount = parseInt(value);
                return {
                    ...prev,
                    [name]: value,
                    selectedImages: prev.selectedImages.slice(0, newCount)
                };
            }
            return {
                ...prev,
                [name]: value
            };
        });
    };

    const handleBack = () => {
        navigate('/games/1');
    };

    const handlePlay = async () => {
        if (config.selectedImages.length !== parseInt(config.puzzleCount)) {
            setError(`Por favor, selecciona ${config.puzzleCount} imagen${config.puzzleCount > 1 ? 'es' : ''} para continuar.`);
            return;
        }
    
        setLoading(true);
        setError('');
    
        try {
            // Crear configuración para pasar al juego
            const gameConfig = {
                difficulty: config.useRandomImages ? 'random' : config.selectedImages[0].difficulty,
                gridSize: config.gridSize.split('x')[0],
                selectedPuzzles: config.selectedImages
            };
    
            // Navegar directamente al juego
            navigate('/games/puzzle/game', {
                state: {
                    config: gameConfig,
                    patientId
                }
            });
        } catch (error) {
            console.error('Error al iniciar el juego:', error);
            setError('Error al iniciar el juego. Por favor, intente nuevamente.');
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

    const renderImageGrid = (images, difficulty) => (
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
            {images.map(image => {
                const isSelected = config.selectedImages.some(selected => selected.id === image.id);
                const selectionIndex = config.selectedImages.findIndex(selected => selected.id === image.id);
                const imageUrl = `/src/assets/images/puzzle/${difficulty}/${image.path}`;

                return (
                    <div
                        key={image.id}
                        onClick={() => handleImageSelect(image.id, imageUrl)}
                        className={`
                            relative cursor-pointer rounded-lg overflow-hidden
                            transform transition-all duration-300
                            ${isSelected 
                                ? 'ring-4 ring-[#00398A] scale-105 shadow-lg' 
                                : config.selectedImages.length >= parseInt(config.puzzleCount)
                                    ? 'opacity-50 hover:opacity-75'
                                    : 'hover:scale-105 hover:shadow-md'
                            }
                        `}
                    >
                        <img 
                            src={imageUrl}
                            alt={image.name}
                            className="w-full aspect-square object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2">
                            <p className="text-sm font-medium text-center">{image.name}</p>
                            <p className="text-xs text-center opacity-75">{image.id}</p>
                        </div>
                        {isSelected && (
                            <div className="absolute top-2 right-2 w-6 h-6 bg-[#00398A] rounded-full flex items-center justify-center text-white font-bold">
                                {selectionIndex + 1}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-[#00398A] mb-6">
                    Configuración del Rompecabezas
                </h2>

                {error && (
                    <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
                        {error}
                    </div>
                )}

                <div className="space-y-8">
                    {/* Configuración inicial */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Tamaño del Grid */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Tamaño del Rompecabezas
                            </label>
                            <select
                                name="gridSize"
                                value={config.gridSize}
                                onChange={handleConfigChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-[#00398A] focus:ring focus:ring-[#00398A] focus:ring-opacity-50"
                            >
                                <option value="4x4">4 x 4</option>
                                <option value="5x5">5 x 5</option>
                                <option value="6x6">6 x 6</option>
                            </select>
                        </div>

                        {/* Cantidad de Rompecabezas */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Número de Rompecabezas
                            </label>
                            <select
                                name="puzzleCount"
                                value={config.puzzleCount}
                                onChange={handleConfigChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-[#00398A] focus:ring focus:ring-[#00398A] focus:ring-opacity-50"
                            >
                                <option value={1}>1 Rompecabezas</option>
                                <option value={2}>2 Rompecabezas</option>
                            </select>
                        </div>
                    </div>

                    {/* Selección de Imágenes */}
                    <div>
                        <h3 className="text-xl font-semibold text-[#00398A] mb-4">
                            Imágenes de Dificultad Media
                        </h3>
                        {renderImageGrid(mediumImages, 'medium')}

                        <h3 className="text-xl font-semibold text-[#00398A] mt-8 mb-4">
                            Imágenes de Dificultad Alta
                        </h3>
                        {renderImageGrid(hardImages, 'hard')}
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
                            className={`
                                px-6 py-2 rounded transition-colors
                                ${config.selectedImages.length === parseInt(config.puzzleCount)
                                    ? 'bg-[#00398A] text-white hover:bg-[#002d6f]'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }
                            `}
                            disabled={loading || config.selectedImages.length !== parseInt(config.puzzleCount)}
                        >
                            Jugar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PuzzleConfig;