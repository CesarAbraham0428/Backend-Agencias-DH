const FoursquareService = require('../../services/foursquareService');

const FoursquareController = {
  buscarLugar: async (req, res) => {
    try {
<<<<<<< HEAD
      const { ll, query, radius, limit } = req.query;

      const options = {
        method: 'GET',
        hostname: 'api.foursquare.com',
        path: `/v3/places/search?ll=${encodeURIComponent(ll)}&query=${encodeURIComponent(query)}&radius=${encodeURIComponent(radius)}&limit=${encodeURIComponent(limit)}`,
        headers: {
          accept: 'application/json',
          Authorization: 'fsq3zsmuEF2kL8pvUzYa06wskpwll/v+kKhij0vB0vS4N54='
        }
      };

      const request = https.request(options, (response) => {
        const chunks = [];

        response.on('data', (chunk) => {
          chunks.push(chunk);
        });

        response.on('end', async () => {
          const body = Buffer.concat(chunks).toString();
          const data = JSON.parse(body);

          if (data && data.results && data.results.length > 0) {
            const results = await Promise.all(
              data.results.map(async (place) => {
                try {
                  const photos = await getPhotos(place.fsq_id);
                  place.photos = photos;
                  return place;
                } catch (error) {
                  return null; 
                }
              })
            );

            res.status(200).json({
              success: true,
              message: 'Lugares encontrados en Dolores Hidalgo',
              data: results.filter((place) => place !== null) // Remove null entries
            });
          } else {
            res.status(404).json({
              success: false,
              message: 'No se encontraron lugares'
            });
          }
        });
      });

      request.on('error', (error) => {
        res.status(500).json({
=======
      const { ll, query, radius = 1000, limit = 50 } = req.query;
      
      if (!ll || !query) {
        return res.status(400).json({
>>>>>>> mejoras
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

<<<<<<< HEAD
// Función para obtener las fotos de un lugar dado su fsq_id
const getPhotos = (fsq_id) => {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      hostname: 'api.foursquare.com',
      path: `/v3/places/${fsq_id}/photos`,
      headers: {
        accept: 'application/json',
        Authorization: 'fsq3zsmuEF2kL8pvUzYa06wskpwll/v+kKhij0vB0vS4N54='
      }
    };

    const request = https.request(options, (response) => {
      const chunks = [];

      response.on('data', (chunk) => {
        chunks.push(chunk);
      });

      response.on('end', () => {
        const body = Buffer.concat(chunks).toString();

        // Check if the status code is not 200, indicating an error response
        if (response.statusCode !== 200) {
          resolve([]); // Resolve with an empty array if there’s an error
          return;
        }

        // Try to parse JSON and handle any errors
        try {
          const data = JSON.parse(body);
          const photos = data.map(photo => `${photo.prefix}original${photo.suffix}`);
          resolve(photos);
        } catch (error) {
          resolve([]); // Resolve with an empty array if parsing fails
        }
      });
    });

    request.on('error', (error) => {
      reject(error);
    });

    request.end();
  });
};

module.exports = foursquareController;
=======
module.exports = FoursquareController;
>>>>>>> mejoras
