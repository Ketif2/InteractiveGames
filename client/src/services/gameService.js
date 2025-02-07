export const gameService = {
    getGames: async () => {
      try {
        const response = await axios.get(`${API_URL}/games`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Error al obtener juegos');
      }
    },
  
    saveGameResults: async (gameId, results) => {
      try {
        const response = await axios.post(`${API_URL}/games/${gameId}/results`, results);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Error al guardar resultados');
      }
    }
  };