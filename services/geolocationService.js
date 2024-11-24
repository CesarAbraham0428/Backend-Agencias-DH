const connection = require('../connection');

const getNearbyServices = {
  findNearbyServices: (latitude, longitude, radius = 5, paqueteId) => {//Es requerido aunque Visual te diaga que no es necesario
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          CASE
            WHEN ps.tipo_servicio IN ('Hotel', 'Restaurante') THEN h.id_hosteleria
            WHEN ps.tipo_servicio IN ('Museo', 'Viñedo', 'Atractivo Turístico') THEN a.id_atracTuris
            ELSE ps.id_servicio
          END AS id,
          COALESCE(h.nom_hs, a.nom_actur, 'Servicio sin nombre') AS nombre,
          COALESCE(h.descripcion_hs, a.descripcion_actur) AS descripcion,
          COALESCE(h.tipologia_hs, a.tipologia_actur) AS tipologia,
          COALESCE(h.costo_hs, a.costo_actur) AS costo,
          COALESCE(h.servicios, a.servicios_actur) AS servicios,
          COALESCE(h.tipo_hs, a.tipo_actur, ps.tipo_servicio) AS tipo,
          h.img_hs AS imagen,
          COALESCE(h.latitud, a.latitud, 0) AS latitud,
          COALESCE(h.longitud, a.longitud, 0) AS longitud,
          ps.tipo_servicio AS tipo_servicio_paquete
        FROM paquete_servicio ps
        LEFT JOIN hosteleria h ON ps.id_servicio = h.id_hosteleria AND ps.tipo_servicio IN ('Hotel', 'Restaurante')
        LEFT JOIN atracturistico a ON ps.id_servicio = a.id_atracTuris AND ps.tipo_servicio IN ('Museo', 'Viñedo', 'Atractivo Turístico')
        WHERE ps.id_paquete = ?
        ORDER BY nombre;
      `;

      connection.query(query, [paqueteId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          
          // Filtrar resultados nulos o indefinidos
          results = results.filter(result => result.id != null);
          resolve(results);
        }
      });
    });
  }
};

module.exports = getNearbyServices;