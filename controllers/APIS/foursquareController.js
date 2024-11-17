const FoursquareService = require('../../services/foursquareService');

const FoursquareController = {
  buscarLugar: async (req, res) => {
    try {
      const { ll, query, radius, limit } = req.query;

      if (!ll || !query) {
        return res.status(400).json({
          success: false,
          message: 'Los parámetros ll y query son obligatorios'
        });
      }

      const lugares = await FoursquareService.buscarLugares(ll, query, radius, limit);

      const resultados = await Promise.all(
        lugares.map(async (lugar) => {
          try {
            const fotos = await FoursquareService.obtenerFotos(lugar.fsq_id);
            return { ...lugar, fotos };
          } catch {
            return null; // Manejo de errores individuales
          }
        })
      );

      res.status(200).json({
        success: true,
        message: 'Lugares encontrados',
        data: resultados.filter((lugar) => lugar !== null) // Excluir lugares con errores
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Error al buscar lugares en Foursquare',
        error: error.message
      });
    }
  }
};

module.exports = FoursquareController;
