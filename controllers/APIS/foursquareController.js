const https = require('https');

const foursquareController = {
  buscarLugar: async (req, res) => {
    try {
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
                  console.error(`Skipping fsq_id ${place.fsq_id} due to error:`, error.message);
                  return null; // Skip this place if fetching photos fails
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
        console.error('Error en la solicitud a Foursquare:', error);
        res.status(500).json({
          success: false,
          message: 'Error al realizar la búsqueda en Foursquare',
          error: error.message
        });
      });

      request.end();
    } catch (error) {
      console.error('Error en el controlador de búsqueda:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }
};

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
          console.error(`Error fetching photos for fsq_id ${fsq_id}:`, body);
          resolve([]); // Resolve with an empty array if there’s an error
          return;
        }

        // Try to parse JSON and handle any errors
        try {
          const data = JSON.parse(body);
          const photos = data.map(photo => `${photo.prefix}original${photo.suffix}`);
          resolve(photos);
        } catch (error) {
          console.error('Error parsing JSON response for photos:', error);
          resolve([]); // Resolve with an empty array if parsing fails
        }
      });
    });

    request.on('error', (error) => {
      console.error('Error in Foursquare photo request:', error);
      reject(error);
    });

    request.end();
  });
};

module.exports = foursquareController;