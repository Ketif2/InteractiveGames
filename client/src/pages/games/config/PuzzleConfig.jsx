import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { puzzleService } from '../../../services/puzzleService';
import OptimizedImage from '../../../components/games/puzzle/config/OptimizedImage';
import AccessibleSelect from '../../../components/games/puzzle/config/AccesibleSelect';

const PuzzleConfig = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { patientId } = location.state || {};

    const [config, setConfig] = useState({
        selectedImages: [],
        gridSize: '4x4',
        puzzleCount: 1,
        useRandomImages: false
    });

    const [mediumImages, setMediumImages] = useState([]);
    const [hardImages, setHardImages] = useState([]);
    const [playedImageIds, setPlayedImageIds] = useState([]);
    const [randomImage, setRandomImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadImages = () => {
            try {
                setLoading(true);
                
                const medium = puzzleService.getImages('medium');
                const hard = puzzleService.getImages('hard');
                
                setMediumImages(medium);
                setHardImages(hard);
                
                setPlayedImageIds([]);
                
                setLoading(false);
            } catch (err) {
                setError('Error al cargar las imágenes. Por favor, intente nuevamente.');
                setLoading(false);
            }
        };

        loadImages();
    }, []);

    const handleImageSelect = (imageId, imageUrl, difficulty) => {
        if (config.useRandomImages) return;

        setConfig(prev => {
            const newSelectedImages = [...prev.selectedImages];
            const existingIndex = newSelectedImages.findIndex(img => img.id === imageId);

            if (existingIndex !== -1) {
                newSelectedImages.splice(existingIndex, 1);
                return { ...prev, selectedImages: newSelectedImages };
            }

            if (newSelectedImages.length >= parseInt(prev.puzzleCount)) {
                newSelectedImages.shift();
            }

            const newImage = {
                id: imageId,
                url: imageUrl,
                difficulty: difficulty
            };
            newSelectedImages.push(newImage);

            return { ...prev, selectedImages: newSelectedImages };
        });
    };

    const handleConfigChange = (e) => {
        const { name, value, type, checked } = e.target;
        const actualValue = type === 'checkbox' ? checked : value;
        
        if (name === 'useRandomImages') {
            const useRandom = checked;
            
            if (useRandom) {
                const randomCount = parseInt(config.puzzleCount);
                const randomImages = Array(randomCount).fill().map((_, i) => ({
                    id: `R${Math.floor(Math.random() * 10000) + i}`,
                    url: `https://picsum.photos/1200/1200?random=${Math.random()}`,
                    difficulty: 'random'
                }));
                
                setRandomImage(randomImages);
                setConfig(prev => ({
                    ...prev,
                    useRandomImages: true,
                    selectedImages: randomImages
                }));
            } else {
                setRandomImage(null);
                setConfig(prev => ({
                    ...prev,
                    useRandomImages: false,
                    selectedImages: []
                }));
            }
            return;
        }
        
        setConfig(prev => {
            if (name === 'puzzleCount') {
                const newCount = parseInt(value);
                
                if (prev.useRandomImages) {
                    const randomImages = Array(newCount).fill().map((_, i) => ({
                        id: `R${Math.floor(Math.random() * 10000) + i}`,
                        url: `https://picsum.photos/1200/1200?random=${Math.random()}`,
                        difficulty: 'random'
                    }));
                    
                    setRandomImage(randomImages);
                    return {
                        ...prev,
                        [name]: value,
                        selectedImages: randomImages
                    };
                }
                
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
        navigate('/games'+ patientId);
    };

    const handlePlay = () => {
        if (config.selectedImages.length !== parseInt(config.puzzleCount)) {
            setError(`Por favor, selecciona ${config.puzzleCount} imagen${config.puzzleCount > 1 ? 'es' : ''} para continuar.`);
            return;
        }

        try {
            const gameConfig = {
                difficulty: config.useRandomImages ? 'random' : config.selectedImages[0].difficulty,
                gridSize: config.gridSize.split('x')[0],
                selectedPuzzles: config.selectedImages
            };

            navigate('/games/puzzle/play', {
                state: {
                    config: gameConfig,
                    patientId: patientId 
                }
            });
        } catch (error) {
            setError('Error al iniciar el juego. Por favor, intente nuevamente.');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen" aria-live="polite" aria-busy="true">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00398A]" role="status">
                    <span className="sr-only">Cargando...</span>
                </div>
            </div>
        );
    }

    const gridSizeOptions = [
        { value: '4x4', label: '4 x 4' },
        { value: '5x5', label: '5 x 5' },
        { value: '6x6', label: '6 x 6' }
    ];

    const puzzleCountOptions = [
        { value: '1', label: '1 Rompecabezas' },
        { value: '2', label: '2 Rompecabezas' }
    ];

    const renderImageGrid = (images, difficulty) => (
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
            {images.map(image => {
                const isSelected = config.selectedImages.some(selected => selected.id === image.id);
                const selectionIndex = config.selectedImages.findIndex(selected => selected.id === image.id);
                
                // Mantener la ruta original sin intentar cambiar la extensión
                const imageUrl = `/images/puzzle/${difficulty}/${image.path}`;
                const isPlayed = playedImageIds.includes(image.id);
    
                return (
                    <div
                        key={image.id}
                        onClick={() => handleImageSelect(image.id, imageUrl, difficulty)}
                        className={`
                            relative cursor-pointer rounded-lg overflow-hidden
                            transform transition-all duration-300
                            ${isSelected 
                                ? 'ring-4 ring-[#00398A] scale-105 shadow-lg' 
                                : config.selectedImages.length >= parseInt(config.puzzleCount) && !isSelected
                                    ? 'opacity-50 hover:opacity-75'
                                    : 'hover:scale-105 hover:shadow-md'
                            }
                            ${config.useRandomImages ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                        role="button"
                        aria-pressed={isSelected}
                        aria-label={`Seleccionar imagen ${image.name}`}
                        tabIndex={config.useRandomImages ? -1 : 0}
                    >
                        <OptimizedImage 
                            src={imageUrl}
                            alt={image.name}
                            width={240}
                            height={240}
                            className="w-full aspect-square object-cover"
                        />
                        {/* Resto del código de este componente */}
                    </div>
                );
            })}
        </div>
    );

    const renderRandomImages = () => (
        <div className="flex justify-center w-sm mx-auto space-x-4">
            {randomImage && randomImage.map((img, index) => (
                <div key={img.id} className="relative rounded-lg overflow-hidden shadow-lg border-2 border-[#00398A]">
                    <OptimizedImage 
                        src={img.url}
                        alt={`Imagen Aleatoria ${index + 1}`}
                        width={300}
                        height={300}
                        className="w-full aspect-square object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2">
                        <p className="text-sm font-medium text-center">Imagen Aleatoria {index + 1}</p>
                    </div>
                    <div className="absolute top-2 right-2 w-6 h-6 bg-[#00398A] rounded-full flex items-center justify-center text-white font-bold" aria-hidden="true">
                        {index + 1}
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-1">
            <nav className="flex items-center py-2 px-4" aria-label="Navegación de migas de pan">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                    <li className="inline-flex items-center">
                    <button
                        onClick={() => navigate('/new-session')}
                        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#00398A]"
                        aria-label="Ir a Nueva sesión"
                    >
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                        </svg>
                        Nueva sesión
                    </button>
                    </li>
                    <li>
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                        </svg>
                        <button
                        onClick={() => navigate('/games/' + patientId)}
                        className="ml-1 text-sm font-medium text-gray-500 hover:text-[#00398A] md:ml-2"
                        aria-label="Ir a Seleccionar juego"
                        >
                        Seleccionar juego
                        </button>
                    </div>
                    </li>
                    <li aria-current="page">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                        </svg>
                        <span className="ml-1 text-sm font-medium text-gray-700 md:ml-2">Configuración</span>
                    </div>
                    </li>
                </ol>
            </nav>
            <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6" role="main">
                <h2 className="text-2xl font-bold text-[#00398A] mb-6" id="configTitle">
                    Configuración del Rompecabezas
                </h2>

                {error && (
                    <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md" role="alert" aria-live="assertive">
                        {error}
                    </div>
                )}

                <div className="space-y-8">
                    {/* Configuración inicial */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Tamaño del Grid */}
                        <AccessibleSelect
                            id="gridSize"
                            name="gridSize"
                            label="Tamaño del Rompecabezas"
                            value={config.gridSize}
                            onChange={handleConfigChange}
                            options={gridSizeOptions}
                        />

                        {/* Cantidad de Rompecabezas */}
                        <AccessibleSelect
                            id="puzzleCount"
                            name="puzzleCount"
                            label="Número de Rompecabezas"
                            value={config.puzzleCount}
                            onChange={handleConfigChange}
                            options={puzzleCountOptions}
                        />
                    </div>

                    <div className="flex items-center space-x-2 bg-blue-50 p-3 rounded-lg border border-blue-200" role="group" aria-labelledby="randomImagesLabel">
                        <span id="randomImagesLabel" className="sr-only">Opciones de imágenes aleatorias</span>
                        <input
                            type="checkbox"
                            id="useRandomImages"
                            name="useRandomImages"
                            checked={config.useRandomImages}
                            onChange={handleConfigChange}
                            className="h-5 w-5 text-[#00398A] focus:ring-[#00398A]"
                            aria-describedby="randomImagesDescription"
                        />
                        <label htmlFor="useRandomImages" className="text-gray-700 font-medium">
                            Usar imágenes aleatorias (Difícil)
                        </label>
                        <p id="randomImagesDescription" className="sr-only">
                            Al activar esta opción, se utilizarán imágenes aleatorias en lugar de las predefinidas
                        </p>
                    </div>

                    {config.useRandomImages && (
                        <div aria-live="polite">
                            <h3 className="text-xl font-semibold text-[#00398A] mb-4">
                                Imágenes Aleatorias Seleccionadas
                            </h3>
                            {renderRandomImages()}
                        </div>
                    )}

                    {!config.useRandomImages && (
                        <>
                            <div>
                                <h3 className="text-xl font-semibold text-[#00398A] mb-4" id="mediumImages">
                                    Imágenes de Dificultad Fácil
                                </h3>
                                <div aria-labelledby="mediumImages" role="listbox" aria-multiselectable="true">
                                    {renderImageGrid(mediumImages, 'medium')}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-[#00398A] mt-8 mb-4" id="hardImages">
                                    Imágenes de Dificultad Media
                                </h3>
                                <div aria-labelledby="hardImages" role="listbox" aria-multiselectable="true">
                                    {renderImageGrid(hardImages, 'hard')}
                                </div>
                            </div>
                        </>
                    )}

                    <div className="flex justify-between pt-6">
                        <button
                            onClick={handleBack}
                            className="px-6 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-[#00398A] focus:ring-opacity-50"
                            disabled={loading}
                            aria-label="Regresar a la selección de juegos"
                        >
                            Regresar
                        </button>
                        <button
                            onClick={handlePlay}
                            className={`
                                px-6 py-2 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-[#00398A] focus:ring-opacity-50
                                ${config.selectedImages.length === parseInt(config.puzzleCount)
                                    ? 'bg-[#00398A] text-white hover:bg-[#002d6f]'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }
                            `}
                            disabled={loading || config.selectedImages.length !== parseInt(config.puzzleCount)}
                            aria-disabled={loading || config.selectedImages.length !== parseInt(config.puzzleCount)}
                            aria-label={
                                config.selectedImages.length === parseInt(config.puzzleCount)
                                    ? "Comenzar el juego"
                                    : `Selecciona ${config.puzzleCount} imagen${config.puzzleCount > 1 ? 'es' : ''} para continuar`
                            }
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