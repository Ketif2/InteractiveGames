const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// sequenceService.js
class SequenceService {
    // Mock data para desarrollo
    #mockData = {
        configs: [],
        stats: []
    };

    async saveConfig(config) {
        // Simula una llamada al backend
        try {
            // En producción, esto sería una llamada API real
            // const response = await fetch(`${API_URL}/sequence/config`, {...});
            
            const configId = Date.now(); // Simulamos un ID único
            this.#mockData.configs.push({ ...config, id: configId });
            
            return {
                success: true,
                configId,
                message: 'Configuración guardada exitosamente'
            };
        } catch (error) {
            console.error('Error en saveConfig:', error);
            throw new Error('Error al guardar la configuración');
        }
    }

    async generateSequence(config) {
        // Simula la generación de secuencia basada en la configuración
        try {
            const [min, max] = config.numberRange.split('-').map(Number);
            const sequence = [];
            const length = 25; // Grid 5x5
            
            for (let i = 0; i < length; i++) {
                sequence.push(Math.floor(Math.random() * (max - min + 1)) + min);
            }
            
            // Ordenamos la secuencia
            sequence.sort((a, b) => a - b);
            
            // Aplicamos el patrón seleccionado
            return this.#applyPattern(sequence, config.pattern);
        } catch (error) {
            console.error('Error en generateSequence:', error);
            throw new Error('Error al generar la secuencia');
        }
    }

    #applyPattern(sequence, pattern) {
        switch (pattern) {
            case 'even':
                return sequence.filter(num => num % 2 === 0);
            case 'odd':
                return sequence.filter(num => num % 2 !== 0);
            case 'sequence':
                // Incrementamos cada número por 2
                return sequence.map(num => num + 2);
            case 'position':
                // Mantenemos los números en las esquinas y el centro
                return sequence;
            default:
                return sequence;
        }
    }

    async saveStats(stats) {
        try {
            const statId = Date.now();
            this.#mockData.stats.push({ ...stats, id: statId });
            
            return {
                success: true,
                statId,
                message: 'Estadísticas guardadas exitosamente'
            };
        } catch (error) {
            console.error('Error en saveStats:', error);
            throw new Error('Error al guardar las estadísticas');
        }
    }
}

export const sequenceService = new SequenceService();