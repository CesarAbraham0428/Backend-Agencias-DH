const https = require('https');

// Foursquare Service
const FoursquareService = {
  buscarLugares: (ll, query, radius, limit) => {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'GET',
        hostname: 'api.foursquare.com',
        path: `/v3/places/search?ll=${encodeURIComponent(ll)}&query=${encodeURIComponent(query)}&radius=${encodeURIComponent(radius)}&limit=${encodeURIComponent(limit)}`,
        headers: {
          accept: 'application/json',
          Authorization: process.env.FOURSQUARE_API_KEY // Verifica que esta variable esté configurada
        }
      };

      const request = https.request(options, (response) => {
        const chunks = [];

        response.on('data', (chunk) => {
          chunks.push(chunk);
        });

        response.on('end', () => {
          try {
            const body = Buffer.concat(chunks).toString();
            const data = JSON.parse(body);
            resolve(data.results || []);
          } catch (error) {
            reject(error);
          }
        });
      });

      request.on('error', (error) => {
        reject(error);
      });

      request.end();
    });
  },

  obtenerFotos: (fsq_id) => {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'GET',
        hostname: 'api.foursquare.com',
        path: `/v3/places/${fsq_id}/photos`,
        headers: {
          accept: 'application/json',
          Authorization: process.env.FOURSQUARE_API_KEY
        }
      };

      const request = https.request(options, (response) => {
        const chunks = [];

        response.on('data', (chunk) => {
          chunks.push(chunk);
        });

        response.on('end', () => {
          try {
            const body = Buffer.concat(chunks).toString();
            const data = JSON.parse(body);
            const photos = data.map(photo => `${photo.prefix}original${photo.suffix}`);
            resolve(photos);
          } catch (error) {
            reject(error);
          }
        });
      });

      request.on('error', (error) => {
        reject(error);
      });

      request.end();
    });
  }
};

module.exports = FoursquareService;
