export const memoryObjects = [
    { id: 1, name: 'Pluma' },
    { id: 2, name: 'Clip' },
    { id: 3, name: 'Borrador' },
    { id: 4, name: 'Post-it' },
    { id: 5, name: 'Lápiz' },
    { id: 6, name: 'Sacapuntas' },
    { id: 7, name: 'Tarjeta' },
    { id: 8, name: 'Cuaderno pequeño' },
    { id: 9, name: 'Marcador' },
    { id: 10, name: 'Regla' },
    { id: 11, name: 'Agenda' },
    { id: 12, name: 'Libro pequeño' },
    { id: 13, name: 'Cuaderno' },
    { id: 14, name: 'Carpeta' },
    { id: 15, name: 'Revista' },
    { id: 16, name: 'Libro mediano' },
    { id: 17, name: 'Tablet' },
    { id: 18, name: 'Laptop pequeña' },
    { id: 19, name: 'Mochila vacía' },
    { id: 20, name: 'Silla plegable' },
    { id: 21, name: 'Mesa portátil' },
    { id: 22, name: 'Microondas' },
    { id: 23, name: 'Televisor pequeño' },
    { id: 24, name: 'Escritorio' },
    { id: 25, name: 'Sillón individual' },
    { id: 26, name: 'Librero pequeño' },
    { id: 27, name: 'Cama individual' },
    { id: 28, name: 'Refrigerador pequeño' },
    { id: 29, name: 'Sofá dos plazas' },
    { id: 30, name: 'Mesa comedor' },
    { id: 31, name: 'Librero grande' },
    { id: 32, name: 'Cama matrimonial' },
    { id: 33, name: 'Refrigerador grande' },
    { id: 34, name: 'Sofá tres plazas' },
    { id: 35, name: 'Piano vertical' },
    { id: 36, name: 'Jacuzzi' },
    { id: 37, name: 'Cama king size' },
    { id: 38, name: 'Mesa billar' },
    { id: 39, name: 'Piano cola' },
    { id: 40, name: 'Refrigerador industrial' },
    { id: 41, name: 'Automóvil compacto' },
    { id: 42, name: 'Camioneta' },
    { id: 43, name: 'Minibús' },
    { id: 44, name: 'Autobús' },
    { id: 45, name: 'Camión' },
    { id: 46, name: 'Contenedor vacío' },
    { id: 47, name: 'Yate pequeño' },
    { id: 48, name: 'Helicóptero' },
    { id: 49, name: 'Avioneta' },
    { id: 50, name: 'Avión comercial' }
];

// Función para seleccionar objetos según dificultad
export const selectObjectsByDifficulty = (difficulty) => {
    // Determine number of items based on difficulty
    const count = difficulty === 'fácil' ? 20 : 28; // 4 rows of 5 or 7 items
    let selectedObjects = [];
    
    switch(difficulty) {
        case 'fácil':
            // Select objects with clear weight differences (spread across the list)
            const easyIndexes = [1, 5, 8, 12, 15, 19, 22, 25, 28, 30, 33, 35, 38, 41, 43, 45, 47, 48, 49, 50];
            selectedObjects = easyIndexes.map(id => 
                memoryObjects.find(obj => obj.id === id) || memoryObjects[id-1]
            );
            break;
            
        case 'medio':
            // Select objects with moderate weight differences
            const mediumStartIndex = 5;
            selectedObjects = memoryObjects.slice(mediumStartIndex, mediumStartIndex + count);
            break;
            
        case 'difícil':
            // Select consecutive objects (more similar weights)
            const difficultStartIndex = 10;
            selectedObjects = memoryObjects.slice(difficultStartIndex, difficultStartIndex + count);
            break;
            
        default:
            // Default to easy selection
            selectedObjects = memoryObjects.slice(0, 20);
    }
    
    // Randomly shuffle the objects for initial display
    return selectedObjects.sort(() => Math.random() - 0.5);
};