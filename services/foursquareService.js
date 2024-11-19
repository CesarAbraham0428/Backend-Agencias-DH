const https = require('https');

const FoursquareService = {
  buscarLugares: (ll, query, radius, limit) => {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'GET',
        hostname: 'api.foursquare.com',
        path: `/v3/places/search?ll=${encodeURIComponent(ll)}&query=${encodeURIComponent(query)}&radius=${encodeURIComponent(radius)}&limit=${encodeURIComponent(limit)}`,
        headers: {
          accept: 'application/json',
          Authorization: process.env.FOURSQUARE_API_KEY
        }
      };

      const request = https.request(options, (response) => {
        const chunks = [];
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', () => {
          try {
            const body = Buffer.concat(chunks).toString();

            if (response.statusCode !== 200) {
              return reject(new Error(`API responded with status ${response.statusCode}: ${body}`));
            }

            const data = JSON.parse(body);
            const results = data.results || [];
            
            resolve(results);
          } catch (error) {
            reject(new Error('Error parsing search response: ' + error.message));
          }
        });
      });

      request.on('error', (error) => reject(new Error('Foursquare API Error: ' + error.message)));
      request.end();
    });
  },

  obtenerFotos: (fsq_id) => {
    return new Promise((resolve, reject) => {
      if (!fsq_id) {
        return resolve({ photos: [], error: 'Missing venue ID' });
      }

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
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', async () => {
          try {
            const body = Buffer.concat(chunks).toString();
            
            if (response.statusCode === 404) {
              return resolve({ 
                photos: [], 
                error: 'Venue not found',
                statusCode: 404
              });
            }

            if (response.statusCode !== 200) {
              return resolve({ 
                photos: [], 
                error: `API Error: ${response.statusCode}`,
                statusCode: response.statusCode
              });
            }

            const data = JSON.parse(body);
            
            if (!Array.isArray(data)) {
              return resolve({ 
                photos: [], 
                error: 'Invalid response format',
                data: data
              });
            }

            const photos = data.map(photo => ({
              url: `${photo.prefix}original${photo.suffix}`,
              created: photo.created_at,
              width: photo.width,
              height: photo.height,
              id: photo.id
            })).filter(photo => photo.url && photo.id);
            
            resolve({
              photos,
              total: photos.length,
              venue_id: fsq_id,
              timestamp: new Date().toISOString()
            });

          } catch (error) {
            resolve({ 
              photos: [], 
              error: error.message,
              venue_id: fsq_id
            });
          }
        });
      });

      request.on('error', (error) => {
        resolve({ 
          photos: [], 
          error: 'Network error: ' + error.message,
          venue_id: fsq_id
        });
      });

      request.setTimeout(8000, () => {
        request.destroy();
        resolve({ 
          photos: [], 
          error: 'Request timeout',
          venue_id: fsq_id
        });
      });

      request.end();
    });
  }
};

module.exports = FoursquareService;