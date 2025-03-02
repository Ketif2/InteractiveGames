// Objetos ordenados por peso (de menor a mayor)
export const memoryObjects = [
    // Objetos muy pequeños/ligeros (1-20)
    { id: 1, name: 'Aguja', category: 'hogar' },
    { id: 2, name: 'Clip', category: 'oficina' },
    { id: 3, name: 'Alfiler', category: 'hogar' },
    { id: 4, name: 'Botón', category: 'ropa' },
    { id: 5, name: 'Pendiente', category: 'ropa' },
    { id: 6, name: 'Anillo', category: 'ropa' },
    { id: 7, name: 'Goma de borrar', category: 'oficina' },
    { id: 8, name: 'Dedal', category: 'hogar' },
    { id: 9, name: 'Moneda', category: 'hogar' },
    { id: 10, name: 'Llave', category: 'hogar' },
    { id: 11, name: 'Sacapuntas', category: 'oficina' },
    { id: 12, name: 'Post-it', category: 'oficina' },
    { id: 13, name: 'Tarjeta de crédito', category: 'hogar' },
    { id: 14, name: 'Lapicero', category: 'oficina' },
    { id: 15, name: 'Lápiz', category: 'oficina' },
    { id: 16, name: 'Cuchara', category: 'cocina' },
    { id: 17, name: 'Tenedor', category: 'cocina' },
    { id: 18, name: 'Cuchillo de mesa', category: 'cocina' },
    { id: 19, name: 'Cucharilla de café', category: 'cocina' },
    { id: 20, name: 'Servilleta', category: 'cocina' },
    
    // Objetos pequeños (21-40)
    { id: 21, name: 'Cartera', category: 'ropa' },
    { id: 22, name: 'Calcetines', category: 'ropa' },
    { id: 23, name: 'Gafas', category: 'ropa' },
    { id: 24, name: 'Guantes', category: 'ropa' },
    { id: 25, name: 'Bufanda', category: 'ropa' },
    { id: 26, name: 'Taza de café', category: 'cocina' },
    { id: 27, name: 'Plato pequeño', category: 'cocina' },
    { id: 28, name: 'Cuaderno', category: 'oficina' },
    { id: 29, name: 'Libreta', category: 'oficina' },
    { id: 30, name: 'Bloc de notas', category: 'oficina' },
    { id: 31, name: 'Bolígrafo', category: 'oficina' },
    { id: 32, name: 'Regla', category: 'oficina' },
    { id: 33, name: 'Tijeras', category: 'oficina' },
    { id: 34, name: 'Grapadora', category: 'oficina' },
    { id: 35, name: 'Manzana', category: 'alimentos' },
    { id: 36, name: 'Naranja', category: 'alimentos' },
    { id: 37, name: 'Plátano', category: 'alimentos' },
    { id: 38, name: 'Pera', category: 'alimentos' },
    { id: 39, name: 'Vaso', category: 'cocina' },
    { id: 40, name: 'Tazón', category: 'cocina' },
    
    // Objetos medianos (41-60)
    { id: 41, name: 'Libro', category: 'hogar' },
    { id: 42, name: 'Camisa', category: 'ropa' },
    { id: 43, name: 'Pantalón', category: 'ropa' },
    { id: 44, name: 'Zapatos', category: 'ropa' },
    { id: 45, name: 'Bolso', category: 'ropa' },
    { id: 46, name: 'Paraguas', category: 'hogar' },
    { id: 47, name: 'Tetera', category: 'cocina' },
    { id: 48, name: 'Sartén pequeña', category: 'cocina' },
    { id: 49, name: 'Caja de zapatos', category: 'hogar' },
    { id: 50, name: 'Carpeta archivadora', category: 'oficina' },
    { id: 51, name: 'Chaqueta', category: 'ropa' },
    { id: 52, name: 'Abrigo', category: 'ropa' },
    { id: 53, name: 'Plato grande', category: 'cocina' },
    { id: 54, name: 'Bandeja', category: 'cocina' },
    { id: 55, name: 'Florero', category: 'hogar' },
    { id: 56, name: 'Cojín', category: 'hogar' },
    { id: 57, name: 'Pelota de fútbol', category: 'deportes' },
    { id: 58, name: 'Balón de baloncesto', category: 'deportes' },
    { id: 59, name: 'Raqueta de tenis', category: 'deportes' },
    { id: 60, name: 'Sandalias', category: 'ropa' },
    
    // Objetos mediano-grandes (61-80)
    { id: 61, name: 'Mochila', category: 'ropa' },
    { id: 62, name: 'Olla pequeña', category: 'cocina' },
    { id: 63, name: 'Guitarra', category: 'música' },
    { id: 64, name: 'Maletín', category: 'oficina' },
    { id: 65, name: 'Impresora pequeña', category: 'oficina' },
    { id: 66, name: 'Lámpara de mesa', category: 'hogar' },
    { id: 67, name: 'Taburete', category: 'hogar' },
    { id: 68, name: 'Maleta', category: 'ropa' },
    { id: 69, name: 'Silla plegable', category: 'hogar' },
    { id: 70, name: 'Microondas', category: 'cocina' },
    { id: 71, name: 'Aspiradora', category: 'hogar' },
    { id: 72, name: 'Ventilador', category: 'hogar' },
    { id: 73, name: 'Olla grande', category: 'cocina' },
    { id: 74, name: 'Batería de cocina', category: 'cocina' },
    { id: 75, name: 'Violín', category: 'música' },
    { id: 76, name: 'Saxofón', category: 'música' },
    { id: 77, name: 'Ordenador portátil', category: 'oficina' },
    { id: 78, name: 'Silla de oficina', category: 'oficina' },
    { id: 79, name: 'Mesa auxiliar', category: 'hogar' },
    { id: 80, name: 'Bicicleta', category: 'deportes' },
    
    // Objetos grandes (81-100)
    { id: 81, name: 'Sillón individual', category: 'hogar' },
    { id: 82, name: 'Escritorio', category: 'oficina' },
    { id: 83, name: 'Mesa de comedor', category: 'hogar' },
    { id: 84, name: 'Armario pequeño', category: 'hogar' },
    { id: 85, name: 'Lavadora', category: 'hogar' },
    { id: 86, name: 'Secadora', category: 'hogar' },
    { id: 87, name: 'Frigorífico', category: 'cocina' },
    { id: 88, name: 'Sofá dos plazas', category: 'hogar' },
    { id: 89, name: 'Cama individual', category: 'hogar' },
    { id: 90, name: 'Estantería mediana', category: 'hogar' },
    { id: 91, name: 'Congelador', category: 'cocina' },
    { id: 92, name: 'Horno', category: 'cocina' },
    { id: 93, name: 'Piano vertical', category: 'música' },
    { id: 94, name: 'Armario grande', category: 'hogar' },
    { id: 95, name: 'Cama matrimonial', category: 'hogar' },
    { id: 96, name: 'Estantería grande', category: 'hogar' },
    { id: 97, name: 'Sofá tres plazas', category: 'hogar' },
    { id: 98, name: 'Mesa de billar', category: 'deportes' },
    { id: 99, name: 'Piano de cola', category: 'música' },
    { id: 100, name: 'Vitrina', category: 'hogar' },
    
    // Objetos muy grandes (101-120)
    { id: 101, name: 'Nevera grande', category: 'cocina' },
    { id: 102, name: 'Yate pequeño', category: 'transporte' },
    { id: 103, name: 'Automóvil pequeño', category: 'transporte' },
    { id: 104, name: 'Camioneta', category: 'transporte' },
    { id: 105, name: 'Furgoneta', category: 'transporte' },
    { id: 106, name: 'Minibús', category: 'transporte' },
    { id: 107, name: 'Autobús', category: 'transporte' },
    { id: 108, name: 'Camión', category: 'transporte' },
    { id: 109, name: 'Tractor', category: 'transporte' },
    { id: 110, name: 'Helicóptero', category: 'transporte' },
    { id: 111, name: 'Avioneta', category: 'transporte' },
    { id: 112, name: 'Avión comercial', category: 'transporte' },
    { id: 113, name: 'Vagón de tren', category: 'transporte' },
    { id: 114, name: 'Locomotora', category: 'transporte' },
    { id: 115, name: 'Barco pequeño', category: 'transporte' },
    { id: 116, name: 'Barco mediano', category: 'transporte' },
    { id: 117, name: 'Crucero', category: 'transporte' },
    { id: 118, name: 'Contenedor', category: 'transporte' },
    { id: 119, name: 'Grúa de construcción', category: 'transporte' },
    { id: 120, name: 'Remolque de camión', category: 'transporte' },
    
    // Objetos adicionales para cada categoría
    
    // Hogar (adicionales)
    { id: 121, name: 'Cepillo de dientes', category: 'hogar' },
    { id: 122, name: 'Jabón', category: 'hogar' },
    { id: 123, name: 'Toalla pequeña', category: 'hogar' },
    { id: 124, name: 'Toalla grande', category: 'hogar' },
    { id: 125, name: 'Marco de fotos', category: 'hogar' },
    { id: 126, name: 'Reloj de pared', category: 'hogar' },
    { id: 127, name: 'Espejo pequeño', category: 'hogar' },
    { id: 128, name: 'Espejo grande', category: 'hogar' },
    { id: 129, name: 'Almohada', category: 'hogar' },
    { id: 130, name: 'Edredón', category: 'hogar' },
    { id: 131, name: 'Manta', category: 'hogar' },
    { id: 132, name: 'Cortina', category: 'hogar' },
    { id: 133, name: 'Alfombra pequeña', category: 'hogar' },
    { id: 134, name: 'Alfombra grande', category: 'hogar' },
    { id: 135, name: 'Perchero', category: 'hogar' },
    { id: 136, name: 'Plancha', category: 'hogar' },
    { id: 137, name: 'Tabla de planchar', category: 'hogar' },
    { id: 138, name: 'Escoba', category: 'hogar' },
    { id: 139, name: 'Recogedor', category: 'hogar' },
    { id: 140, name: 'Fregona', category: 'hogar' },
    
    // Oficina (adicionales)
    { id: 141, name: 'Clip grande', category: 'oficina' },
    { id: 142, name: 'Lápiz de color', category: 'oficina' },
    { id: 143, name: 'Rotulador', category: 'oficina' },
    { id: 144, name: 'Marcador', category: 'oficina' },
    { id: 145, name: 'Cinta adhesiva', category: 'oficina' },
    { id: 146, name: 'Calculadora', category: 'oficina' },
    { id: 147, name: 'Agenda', category: 'oficina' },
    { id: 148, name: 'Calendario de mesa', category: 'oficina' },
    { id: 149, name: 'Porta bolígrafos', category: 'oficina' },
    { id: 150, name: 'Sobre', category: 'oficina' },
    { id: 151, name: 'Carpeta', category: 'oficina' },
    { id: 152, name: 'Paquete de folios', category: 'oficina' },
    { id: 153, name: 'Archivador', category: 'oficina' },
    { id: 154, name: 'Clasificador', category: 'oficina' },
    { id: 155, name: 'Perforadora', category: 'oficina' },
    { id: 156, name: 'Atril', category: 'oficina' },
    { id: 157, name: 'Pizarra pequeña', category: 'oficina' },
    { id: 158, name: 'Pizarra grande', category: 'oficina' },
    { id: 159, name: 'Papelera', category: 'oficina' },
    { id: 160, name: 'Fichero', category: 'oficina' },
    
    // Cocina (adicionales)
    { id: 161, name: 'Tapón de botella', category: 'cocina' },
    { id: 162, name: 'Abrebotellas', category: 'cocina' },
    { id: 163, name: 'Sacacorchos', category: 'cocina' },
    { id: 164, name: 'Cucharón', category: 'cocina' },
    { id: 165, name: 'Espumadera', category: 'cocina' },
    { id: 166, name: 'Espátula', category: 'cocina' },
    { id: 167, name: 'Jarra', category: 'cocina' },
    { id: 168, name: 'Rallador', category: 'cocina' },
    { id: 169, name: 'Colador pequeño', category: 'cocina' },
    { id: 170, name: 'Colador grande', category: 'cocina' },
    { id: 171, name: 'Tabla de cortar', category: 'cocina' },
    { id: 172, name: 'Fuente', category: 'cocina' },
    { id: 173, name: 'Cazo', category: 'cocina' },
    { id: 174, name: 'Cacerola', category: 'cocina' },
    { id: 175, name: 'Sartén grande', category: 'cocina' },
    { id: 176, name: 'Molde para horno', category: 'cocina' },
    { id: 177, name: 'Báscula de cocina', category: 'cocina' },
    { id: 178, name: 'Batidora', category: 'cocina' },
    { id: 179, name: 'Tostadora', category: 'cocina' },
    { id: 180, name: 'Cafetera', category: 'cocina' },
    
    // Ropa (adicionales)
    { id: 181, name: 'Pañuelo', category: 'ropa' },
    { id: 182, name: 'Corbata', category: 'ropa' },
    { id: 183, name: 'Cinturón', category: 'ropa' },
    { id: 184, name: 'Pijama', category: 'ropa' },
    { id: 185, name: 'Falda', category: 'ropa' },
    { id: 186, name: 'Vestido', category: 'ropa' },
    { id: 187, name: 'Blusa', category: 'ropa' },
    { id: 188, name: 'Sudadera', category: 'ropa' },
    { id: 189, name: 'Jersey', category: 'ropa' },
    { id: 190, name: 'Camiseta', category: 'ropa' },
    { id: 191, name: 'Gorra', category: 'ropa' },
    { id: 192, name: 'Sombrero', category: 'ropa' },
    { id: 193, name: 'Botas', category: 'ropa' },
    { id: 194, name: 'Zapatillas', category: 'ropa' },
    { id: 195, name: 'Traje', category: 'ropa' },
    { id: 196, name: 'Gabardina', category: 'ropa' },
    { id: 197, name: 'Abrigo grueso', category: 'ropa' },
    { id: 198, name: 'Vestido de fiesta', category: 'ropa' },
    { id: 199, name: 'Ropa de cama', category: 'ropa' },
    { id: 200, name: 'Manta térmica', category: 'ropa' },
    
    // Alimentos (adicionales)
    { id: 201, name: 'Fresa', category: 'alimentos' },
    { id: 202, name: 'Uva', category: 'alimentos' },
    { id: 203, name: 'Cereza', category: 'alimentos' },
    { id: 204, name: 'Limón', category: 'alimentos' },
    { id: 205, name: 'Mandarina', category: 'alimentos' },
    { id: 206, name: 'Kiwi', category: 'alimentos' },
    { id: 207, name: 'Tomate', category: 'alimentos' },
    { id: 208, name: 'Zanahoria', category: 'alimentos' },
    { id: 209, name: 'Patata', category: 'alimentos' },
    { id: 210, name: 'Cebolla', category: 'alimentos' },
    { id: 211, name: 'Pimiento', category: 'alimentos' },
    { id: 212, name: 'Lechuga', category: 'alimentos' },
    { id: 213, name: 'Col', category: 'alimentos' },
    { id: 214, name: 'Calabaza', category: 'alimentos' },
    { id: 215, name: 'Melón', category: 'alimentos' },
    { id: 216, name: 'Sandía', category: 'alimentos' },
    { id: 217, name: 'Pan', category: 'alimentos' },
    { id: 218, name: 'Queso', category: 'alimentos' },
    { id: 219, name: 'Jamón', category: 'alimentos' },
    { id: 220, name: 'Piña', category: 'alimentos' },
    
    // Música (adicionales)
    { id: 221, name: 'Armónica', category: 'música' },
    { id: 222, name: 'Flauta', category: 'música' },
    { id: 223, name: 'Clarinete', category: 'música' },
    { id: 224, name: 'Trompeta', category: 'música' },
    { id: 225, name: 'Violonchelo', category: 'música' },
    { id: 226, name: 'Contrabajo', category: 'música' },
    { id: 227, name: 'Arpa', category: 'música' },
    { id: 228, name: 'Acordeón', category: 'música' },
    { id: 229, name: 'Ukelele', category: 'música' },
    { id: 230, name: 'Batería', category: 'música' },
    { id: 231, name: 'Tambor', category: 'música' },
    { id: 232, name: 'Pandereta', category: 'música' },
    { id: 233, name: 'Maracas', category: 'música' },
    { id: 234, name: 'Triángulo', category: 'música' },
    { id: 235, name: 'Xilófono', category: 'música' },
    { id: 236, name: 'Bongós', category: 'música' },
    { id: 237, name: 'Órgano', category: 'música' },
    { id: 238, name: 'Banjo', category: 'música' },
    { id: 239, name: 'Guitarra eléctrica', category: 'música' },
    { id: 240, name: 'Bajo eléctrico', category: 'música' },
    
    // Deportes (adicionales)
    { id: 241, name: 'Canica', category: 'deportes' },
    { id: 242, name: 'Pelota de ping pong', category: 'deportes' },
    { id: 243, name: 'Pelota de tenis', category: 'deportes' },
    { id: 244, name: 'Pelota de golf', category: 'deportes' },
    { id: 245, name: 'Volante de bádminton', category: 'deportes' },
    { id: 246, name: 'Palo de golf', category: 'deportes' },
    { id: 247, name: 'Pala de ping pong', category: 'deportes' },
    { id: 248, name: 'Balón de voleibol', category: 'deportes' },
    { id: 249, name: 'Balón de rugby', category: 'deportes' },
    { id: 250, name: 'Patines', category: 'deportes' },
    { id: 251, name: 'Casco', category: 'deportes' },
    { id: 252, name: 'Tienda de campaña', category: 'deportes' },
    { id: 253, name: 'Saco de dormir', category: 'deportes' },
    { id: 254, name: 'Mochila de montaña', category: 'deportes' },
    { id: 255, name: 'Tabla de surf', category: 'deportes' },
    { id: 256, name: 'Esquís', category: 'deportes' },
    { id: 257, name: 'Canoa', category: 'deportes' },
    { id: 258, name: 'Kayak', category: 'deportes' },
    { id: 259, name: 'Red de voleibol', category: 'deportes' },
    { id: 260, name: 'Portería de fútbol', category: 'deportes' }
];

// Definir las categorías disponibles
export const availableCategories = [
    { value: 'todos', label: 'Todos los objetos' },
    { value: 'hogar', label: 'Objetos del hogar' },
    { value: 'oficina', label: 'Objetos de oficina' },
    { value: 'cocina', label: 'Utensilios de cocina' },
    { value: 'ropa', label: 'Ropa y complementos' },
    { value: 'alimentos', label: 'Alimentos' },
    { value: 'música', label: 'Instrumentos musicales' },
    { value: 'deportes', label: 'Deportes y ocio' },
    { value: 'transporte', label: 'Medios de transporte' }
];

// Función para seleccionar objetos según dificultad y categoría
export const selectObjectsByDifficultyAndCategory = (difficulty, category = 'todos') => {
    // Filtrar objetos por categoría si no es "todos"
    let filteredObjects = [...memoryObjects]; // Hacer una copia para no modificar el original
    
    if (category !== 'todos') {
        filteredObjects = memoryObjects.filter(obj => obj.category === category);
        
        // Verificar si hay suficientes objetos en la categoría
        if (filteredObjects.length < 10) {
            console.warn(`No hay suficientes objetos en la categoría ${category}. Usando todos los objetos.`);
            filteredObjects = [...memoryObjects];
        }
    }
    
    // Determine number of items based on difficulty
    // Fácil: 2 filas (10 elementos)
    // Medio: 3 filas (15 elementos)
    // Difícil: 4 filas (20 elementos)
    let count;
    switch(difficulty) {
        case 'fácil':
            count = 10; // 2 filas de 5 elementos
            break;
        case 'medio':
            count = 15; // 3 filas de 5 elementos
            break;
        case 'difícil':
        default:
            count = 20; // 4 filas de 5 elementos
            break;
    }
    
    // Seleccionar según dificultad
    let selectedObjects = [];
    
    switch(difficulty) {
        case 'fácil':
            // Para dificultad fácil, seleccionar objetos con claras diferencias de peso
            // Para asegurar esto, tomamos objetos distribuidos uniformemente a lo largo del array
            selectedObjects = [];
            const easyStep = Math.max(1, Math.floor(filteredObjects.length / count));
            
            for (let i = 0; i < count && i * easyStep < filteredObjects.length; i++) {
                selectedObjects.push(filteredObjects[i * easyStep]);
            }
            
            // Si no tenemos suficientes, completamos con objetos aleatorios
            while (selectedObjects.length < count) {
                const randomIndex = Math.floor(Math.random() * filteredObjects.length);
                const randomItem = filteredObjects[randomIndex];
                
                // Verificar que no esté ya incluido
                if (!selectedObjects.some(item => item.id === randomItem.id)) {
                    selectedObjects.push(randomItem);
                }
            }
            break;
            
        case 'medio':
            // Para dificultad media, tomamos objetos con diferencia moderada de peso
            // Seleccionamos un segmento del array, asegurando que haya cierta progresión
            const mediumStart = Math.floor(filteredObjects.length * 0.25); // Empezar en el primer cuarto
            const mediumSegmentSize = Math.floor(filteredObjects.length * 0.5); // Tomar la mitad central
            const mediumSegment = filteredObjects.slice(mediumStart, mediumStart + mediumSegmentSize);
            
            // Seleccionar objetos a intervalos regulares desde este segmento
            const mediumStep = Math.max(1, Math.floor(mediumSegment.length / count));
            for (let i = 0; i < count && i * mediumStep < mediumSegment.length; i++) {
                selectedObjects.push(mediumSegment[i * mediumStep]);
            }
            
            // Completar si es necesario
            while (selectedObjects.length < count) {
                const remainingCount = count - selectedObjects.length;
                const additionalObjects = filteredObjects
                    .filter(obj => !selectedObjects.some(item => item.id === obj.id))
                    .slice(0, remainingCount);
                
                selectedObjects = [...selectedObjects, ...additionalObjects];
            }
            break;
            
        case 'difícil':
            // Para dificultad difícil, tomamos objetos con pesos muy similares
            // Seleccionamos un segmento específico donde los objetos tienen pesos cercanos
            const difficultStart = Math.floor(filteredObjects.length * 0.4); // Empezar cerca de la mitad
            const difficultSegmentSize = Math.floor(filteredObjects.length * 0.3); // Tomar un 30%
            const difficultSegment = filteredObjects.slice(difficultStart, difficultStart + difficultSegmentSize);
            
            // Tomar objetos consecutivos para asegurar similitud de peso
            selectedObjects = difficultSegment.slice(0, count);
            
            // Completar si es necesario
            while (selectedObjects.length < count) {
                const remainingCount = count - selectedObjects.length;
                const additionalObjects = filteredObjects
                    .filter(obj => !selectedObjects.some(item => item.id === obj.id))
                    .slice(0, remainingCount);
                
                selectedObjects = [...selectedObjects, ...additionalObjects];
            }
            break;
            
        default:
            // Por defecto, seleccionar aleatoriamente
            selectedObjects = filteredObjects
                .sort(() => Math.random() - 0.5)
                .slice(0, count);
    }
    
    // Asegurar que tenemos la cantidad correcta de objetos
    selectedObjects = selectedObjects.slice(0, count);
    
    // Mezclar aleatoriamente para la presentación inicial
    return selectedObjects.sort(() => Math.random() - 0.5);
};

// Mantener la función original para compatibilidad
export const selectObjectsByDifficulty = (difficulty) => {
    return selectObjectsByDifficultyAndCategory(difficulty, 'todos');
};