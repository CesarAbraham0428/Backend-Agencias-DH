const FoursquareService = require('../../services/foursquareService');

const FoursquareController = {
  buscarLugar: async (req, res) => {
    try {
      const { ll, query, radius = 1000, limit = 50 } = req.query;
      
      if (!ll || !query) {
        return res.status(400).json({
          success: false,
          message: 'Los parámetros ll y query son obligatorios'
        });
      }

      const lugares = await FoursquareService.buscarLugares(ll, query, radius, limit);
      
      // Procesar lugares en lotes para evitar sobrecarga
      const BATCH_SIZE = 10;
      const resultados = [];
      const errores = [];

      for (let i = 0; i < lugares.length; i += BATCH_SIZE) {
        const batch = lugares.slice(i, i + BATCH_SIZE);
        const batchResults = await Promise.all(
          batch.map(async (lugar) => {
            try {
              const fotoResult = await FoursquareService.obtenerFotos(lugar.fsq_id);
              
              return {
                ...lugar,
                fotos: fotoResult.photos,
                foto_metadata: {
                  total: fotoResult.total,
                  error: fotoResult.error,
                  timestamp: fotoResult.timestamp
                }
              };
            } catch (error) {
              errores.push({
                venue_id: lugar.fsq_id,
                error: error.message,
                timestamp: new Date().toISOString()
              });
              return { 
                ...lugar, 
                fotos: [],
                foto_metadata: {
                  error: error.message,
                  timestamp: new Date().toISOString()
                }
              };
            }
          })
        );
        resultados.push(...batchResults);
        
        // Pequeña pausa entre lotes para evitar rate limiting
        if (i + BATCH_SIZE < lugares.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      res.status(200).json({
        success: true,
        message: 'Búsqueda completada',
        data: resultados,
        metadata: {
          total_lugares: resultados.length,
          lugares_con_fotos: resultados.filter(r => r.fotos && r.fotos.length > 0).length,
          total_errores: errores.length,
          timestamp: new Date().toISOString()
        },
        errores: errores.length > 0 ? errores : undefined
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al buscar lugares en Foursquare',
        error: error.message
      });
    }
  }
};

module.exports = FoursquareController;