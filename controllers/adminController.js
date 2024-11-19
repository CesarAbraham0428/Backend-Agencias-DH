const connection = require('../connection')

//Crud de transportista
exports.createTransportista = (req, res) => {
  const { nom_trans, apellidos_trans, alcance_trans, email_trans, tarifa_trans, servicios_trans, tel_trans } = req.body;
  connection.query(
    'INSERT INTO Transportista (nom_trans, apellidos_trans, alcance_trans, email_trans, tarifa_trans, servicios_trans, tel_trans) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [nom_trans, apellidos_trans, alcance_trans, email_trans, tarifa_trans, servicios_trans, tel_trans],
    (error, results) => {
      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }
      res.status(201).json({ id_trans: results.insertId, nom_trans, apellidos_trans, alcance_trans, email_trans, tarifa_trans, servicios_trans, tel_trans });
    }
  );
};

exports.getAllTransportistas = (req, res) => {
  connection.query('SELECT * FROM Transportista', (error, results) => {
    if (error) {
      res.status(500).json({ error: error.message });
    }
    res.status(200).json(results);
  })
}



exports.getTransportistaById = (req, res) => {
  const { id_trans } = req.params;
  connection.query(
    'SELECT * FROM Transportista WHERE id_trans = ?',
    [id_trans],
    (error, results) => {
      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }
      res.status(200).json(results[0]);
    }
  );
};

exports.updateTransportista = (req, res) => {
  const { id_trans, nom_trans, apellidos_trans, alcance_trans, email_trans, tarifa_trans, servicios_trans, tel_trans } = req.body;
  connection.query(
    'UPDATE Transportista SET nom_trans = ?, apellidos_trans = ?, alcance_trans = ?, email_trans = ?, tarifa_trans = ?, servicios_trans = ?, tel_trans = ? WHERE id_trans = ?',
    [nom_trans, apellidos_trans, alcance_trans, email_trans, tarifa_trans, servicios_trans, tel_trans, id_trans],
    (error, results) => {
      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }
      res.status(200).json({ id_trans, nom_trans, apellidos_trans, alcance_trans, email_trans, tarifa_trans, servicios_trans, tel_trans });
    }
  );
};

exports.deleteTransportista = (req, res) => {
  const { id_trans } = req.params;
  connection.query(
    'DELETE FROM Transportista WHERE id_trans = ?',
    [id_trans],
    (error, results) => {
      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }
      res.status(200).json({ message: 'Transportista eliminado correctamente' });
    }
  );
};


//Guias
exports.createGuia = (req, res) => {
  const { nom_guia, apellido_guia, nomcalle_guia, numcalle_guia, comunidad_guia, categoria_guia, telefono_guia, costo_guia, email_guia} = req.body;
  connection.query(
    'INSERT INTO Guia (nom_guia, apellido_guia, nomcalle_guia, numcalle_guia, comunidad_guia, categoria_guia, telefono_guia, costo_guia, email_guia) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [nom_guia, apellido_guia, nomcalle_guia, numcalle_guia, comunidad_guia, categoria_guia, telefono_guia, costo_guia, email_guia],
    (error, results) => {
      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }
      res.status(201).json({ id_guia: results.insertId, nom_guia, apellido_guia, nomcalle_guia, numcalle_guia, comunidad_guia, categoria_guia, telefono_guia, costo_guia, email_guia  });
    }
  );
};


exports.getAllGuia = (req, res) => {
  connection.query('SELECT * FROM Guia', (error, results) => {
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(200).json(results);
  })
}

exports.getGuiaById = (req, res) => {
  const { id_guia } = req.params;
  connection.query(
    'SELECT * FROM Guia WHERE id_guia = ?',
    [id_guia],
    (error, results) => {
      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }
      res.status(200).json(results[0]);
    }
  );
};


exports.updateGuia = (req, res) => {
  const { id_guia, nom_guia, apellido_guia, nomcalle_guia, numcalle_guia, comunidad_guia, categoria_guia, telefono_guia, costo_guia, email_guia } = req.body;
  connection.query(
    'UPDATE Guia SET nom_guia = ?, apellido_guia = ?, nomcalle_guia = ?, numcalle_guia = ?, comunidad_guia = ?, categoria_guia = ?, telefono_guia = ?, costo_guia = ?, email_guia = ? WHERE id_guia = ?',
    [nom_guia, apellido_guia, nomcalle_guia, numcalle_guia, comunidad_guia, categoria_guia, telefono_guia, costo_guia, email_guia, id_guia],
    (error, results) => {
      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }
      res.status(200).json({ id_guia, nom_guia, apellido_guia, nomcalle_guia, numcalle_guia, comunidad_guia, categoria_guia, telefono_guia, costo_guia, email_guia });
    }
  );
};

exports.deleteGuia = (req, res) => {
  const { id_guia } = req.params;
  connection.query(
    'DELETE FROM Guia WHERE id_guia = ?',
    [id_guia],
    (error, results) => {
      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }
      res.status(200).json({ message: 'Guia eliminado correctamente' });
    }
  );
};

exports.createHosteleria = (req, res) => {
  const { nom_hs, descripcion_hs, accesibility_infrastr_hs, tipologia_hs, costo_hs, servicios, tipo_hs, img_hs,latitud,longitud } = req.body;
  connection.query(
    'INSERT INTO Hosteleria (nom_hs, descripcion_hs, accesibility_infrastr_hs, tipologia_hs, costo_hs, servicios, tipo_hs, img_hs,latitud,longitud) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?)',
    [nom_hs, descripcion_hs, accesibility_infrastr_hs, tipologia_hs, costo_hs, servicios, tipo_hs, img_hs,latitud,longitud],
    (error, results) => {
      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }
      res.status(201).json({ id_hosteleria: results.insertId, nom_hs, descripcion_hs, accesibility_infrastr_hs, tipologia_hs, costo_hs, servicios, tipo_hs, img_hs,latitud,longitud });
    }
  );
};

exports.getAllHosteleria = (req, res) => {
  connection.query('SELECT * FROM Hosteleria',
    (error, results) => {
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(200).json(results);
  })
}

exports.getHosteleriaById = (req, res) => {
  const { id_hosteleria } = req.params;
  connection.query(
    'SELECT * FROM Hosteleria WHERE id_hosteleria = ?',
    [id_hosteleria],
    (error, results) => {
      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }
      res.status(200).json(results[0]);
    }
  );
};

exports.updateHosteleria = (req, res) => {
  const { id_hosteleria, nom_hs, descripcion_hs, accesibility_infrastr_hs, tipologia_hs, costo_hs, servicios, tipo_hs, img_hs,latitud,longitud } = req.body;
  connection.query(
    'UPDATE Hosteleria SET nom_hs = ?, descripcion_hs = ?, accesibility_infrastr_hs = ?, tipologia_hs = ?, costo_hs = ?, servicios = ?, tipo_hs = ?, img_hs = ?,latitud = ?, longitud = ? WHERE id_hosteleria = ?',
    [nom_hs, descripcion_hs, accesibility_infrastr_hs, tipologia_hs, costo_hs, servicios, tipo_hs, img_hs,latitud,longitud, id_hosteleria],
    (error, results) => {
      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }
      res.status(200).json({ id_hosteleria, nom_hs, descripcion_hs, accesibility_infrastr_hs, tipologia_hs, costo_hs, servicios, tipo_hs, img_hs,latitud,longitud });
    }
  );
};


exports.deleteHosteleria = (req, res) => {
  const { id_hosteleria } = req.params;
  connection.query(
    'DELETE FROM Hosteleria WHERE id_hosteleria = ?',
    [id_hosteleria],
    (error, results) => {
      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }
      res.status(200).json({ message: 'Hosteleria eliminada correctamente' });
    }
  );
};

exports.createAtracTuristico = (req, res) => {
  const { nom_actur, accesbilidad_actur, descripcion_actur, nom_calle_actur, num_calle_actur, localidad_actur, tipologia_actur, num_visitantes_actur, categoria_actur, servicios_actur, costo_actur, tipo_actur, latitud, longitud } = req.body;
  connection.query(
    'INSERT INTO AtracTuristico (nom_actur, accesbilidad_actur, descripcion_actur, nom_calle_actur, num_calle_actur, localidad_actur, tipologia_actur, num_visitantes_actur, categoria_actur, servicios_actur, costo_actur, tipo_actur, latitud, longitud) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [nom_actur, accesbilidad_actur, descripcion_actur, nom_calle_actur, num_calle_actur, localidad_actur, tipologia_actur, num_visitantes_actur, categoria_actur, servicios_actur, costo_actur, tipo_actur, latitud, longitud],
    (error, results) => {
      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }
      res.status(201).json({ id_atracTuris: results.insertId, nom_actur, accesbilidad_actur, descripcion_actur, nom_calle_actur, num_calle_actur, localidad_actur, tipologia_actur, num_visitantes_actur, categoria_actur, servicios_actur, costo_actur, tipo_actur,latitud,longitud });
    }
  );
};

exports.getAllAtracTuristico = (req, res) => {
  connection.query('SELECT * FROM AtracTuristico', (error, results) => {
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(200).json(results);
  });
};

exports.getAtracTuristiconById = (req, res) => {
  const { id_atracTuris } = req.params;
  connection.query(
    'SELECT * FROM AtracTuristico WHERE id_atracTuris = ?',
    [id_atracTuris],
    (error, results) => {
      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }
      res.status(200).json(results[0]);
    }
  );
};

exports.updateAtracTuristico = (req, res) => {
  const { id_atracTuris, nom_actur, accesbilidad_actur, descripcion_actur, nom_calle_actur, num_calle_actur, localidad_actur, tipologia_actur, num_visitantes_actur, categoria_actur, servicios_actur, costo_actur, tipo_actur,latitud,longitud } = req.body;
  connection.query(
    'UPDATE AtracTuristico SET nom_actur = ?, accesbilidad_actur = ?, descripcion_actur = ?, nom_calle_actur = ?, num_calle_actur = ?, localidad_actur = ?, tipologia_actur = ?, num_visitantes_actur = ?, categoria_actur = ?, servicios_actur = ?, costo_actur = ?, tipo_actur = ?, latitud = ?, longitud = ? WHERE id_atracTuris = ?',
    [nom_actur, accesbilidad_actur, descripcion_actur, nom_calle_actur, num_calle_actur, localidad_actur, tipologia_actur, num_visitantes_actur, categoria_actur, servicios_actur, costo_actur, tipo_actur,latitud,longitud, id_atracTuris],
    (error, results) => {
      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }
      res.status(200).json({ id_atracTuris, nom_actur, accesbilidad_actur, descripcion_actur, nom_calle_actur, num_calle_actur, localidad_actur, tipologia_actur, num_visitantes_actur, categoria_actur, servicios_actur, costo_actur,tipo_actur, latitud, longitud });
    }
  );
};

exports.deleteAtracTuristico = (req, res) => {
  const { id_atracTuris } = req.params;
  connection.query(
    'DELETE FROM AtracTuristico WHERE id_atracTuris = ?',
    [id_atracTuris],
    (error, results) => {
      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }
      res.status(200).json({ message: 'Atractivo Turistico eliminado correctamente' });
    }
  );
};

exports.getTodosUsuarios = (req, res) => {
  connection.query(
    'SELECT nom_usr, app_usr, nacionalidad_usr, sexo_usr, edad_usr, email_usr, ciudad_usr FROM Usuario WHERE role = ?', 
    ['usuario'], 
    (error, results) => {
      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }
      res.status(200).json(results);
    }
  );
}; 
 
exports.getUsuarioById = (req, res) => {
  const { id_usr } = req.params;
  connection.query(
    'SELECT nom_usr, app_usr, nacionalidad_usr, sexo_usr, edad_usr, email_usr, ciudad_usr FROM Usuario WHERE id_usr = ? AND role = ?',
    [id_usr, 'usuario'],
    (error, results) => {
      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }
      if (results.length === 0) {
        res.status(404).json({ error: 'Usuario no encontrado.' });
        return;
      }
      res.status(200).json(results[0]);
    }
  );
};


exports.getPaquetesCompletosByAgencia = (req, res) => {
  const query = `
    SELECT p.*, a.id_agencia, a.nom_ag, ps.id_servicio, ps.tipo_servicio,
      act.id_actividad, act.fecha_actividad, act.hora_actividad, act.descripcion_actividad, p.img_paquete
    FROM Paquete p
    JOIN Agencia a ON p.id_agencia = a.id_agencia
    LEFT JOIN Paquete_Servicio ps ON p.id_paquete = ps.id_paquete
    LEFT JOIN Actividad act ON ps.id_paquete = act.id_paquete AND ps.id_servicio = act.id_servicio AND ps.tipo_servicio = act.tipo_servicio
    WHERE p.tipo_paquete = 'Predeterminado'
  `;

  connection.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Error al obtener los paquetes completos' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'No se encontraron paquetes.' });
    }

    const paquetesPorAgencia = {};

    results.forEach(row => {
      if (!paquetesPorAgencia[row.id_agencia]) {
        paquetesPorAgencia[row.id_agencia] = {
          id_agencia: row.id_agencia,
          nom_ag: row.nom_ag,
          paquetes: {}
        };
      }

      if (!paquetesPorAgencia[row.id_agencia].paquetes[row.id_paquete]) {
        paquetesPorAgencia[row.id_agencia].paquetes[row.id_paquete] = {
          id_paquete: row.id_paquete,
          nom_paquete: row.nom_paquete,
          tipo_paquete: row.tipo_paquete,
          costo_paquete: row.costo_paquete,
          img_paquete: row.img_paquete,
          servicios: []
        };
      }

      const paquete = paquetesPorAgencia[row.id_agencia].paquetes[row.id_paquete];

      if (row.id_servicio) {
        let servicio = paquete.servicios.find(s => s.id_servicio === row.id_servicio && s.tipo_servicio === row.tipo_servicio);
        if (!servicio) {
          servicio = {
            id_servicio: row.id_servicio,
            tipo_servicio: row.tipo_servicio,
            actividades: []
          };
          paquete.servicios.push(servicio);
        }

        if (row.id_actividad) {
          servicio.actividades.push({
            id_actividad: row.id_actividad,
            fecha_actividad: row.fecha_actividad,
            hora_actividad: row.hora_actividad,
            descripcion_actividad: row.descripcion_actividad
          });
        }
      }
    });

    // Convertir el objeto de paquetes por agencia a un array
    const paquetesFormateados = Object.values(paquetesPorAgencia).map(agencia => ({
      id_agencia: agencia.id_agencia,
      nom_ag: agencia.nom_ag,
      paquetes: Object.values(agencia.paquetes)
    }));

    res.status(200).json(paquetesFormateados);
  });
};
/* ----------------------------------------- Aqui termina la parte de Marco------------------------------------------------------- */

/* ----------------------------------------- Aqui Inicia la parte de Abraham ------------------------------------------------------- */
/* Pate de Abraham No Modificar */

/*-------------------- Esto es necesario para obtener los usarios al momento de Asignar paquetes */

exports.getAllUsuarios = (req, res) => {
  const query = "SELECT id_usr, nom_usr, app_usr, nacionalidad_usr, sexo_usr, edad_usr FROM Usuario WHERE role = 'usuario'";
  
  connection.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Error al obtener usuarios' });
    }
    res.status(200).json(results);
  });
};

exports.getUsuariosAsignados = (req, res) => {
  const idPaquete = req.params.id;
  const query = `
    SELECT u.id_usr, u.nom_usr, u.app_usr, u.nacionalidad_usr, u.sexo_usr, u.edad_usr
    FROM Usuario u
    INNER JOIN Asignacion_Paquete ap ON u.id_usr = ap.id_usr
    WHERE ap.id_paquete = ?
  `;
  
  connection.query(query, [idPaquete], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Error al obtener usuarios asignados' });
    }
    res.status(200).json(results);
  });
};

exports.getAllPaquetes = (req, res) => {
  const usuarioId = req.usuarioId;

  // Obtener el id_agencia del usuario
  connection.query(
    'SELECT id_agencia FROM AdminAgencia WHERE id_usr = ?',
    [usuarioId],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: 'Error al obtener la agencia del usuario' });
      }
      if (results.length === 0) {
        return res.status(403).json({ error: 'El usuario no está asociado a ninguna agencia' });
      }

      const id_agencia = results[0].id_agencia;

      // Obtener los paquetes de la agencia del usuario
      connection.query(
        'SELECT * FROM Paquete WHERE id_agencia = ?',
        [id_agencia],
        (error, paquetes) => {
          if (error) {
            return res.status(500).json({ error: 'Error al obtener los paquetes' });
          }

          res.status(200).json(paquetes);
        }
      );
    }
  );
};


exports.getPaqueteCompleto = (req, res) => {
  const paqueteId = req.params.id;

  connection.query(`
    SELECT p.*, ps.id_servicio, ps.tipo_servicio,
      a.id_actividad, a.fecha_actividad, a.hora_actividad, a.descripcion_actividad
    FROM Paquete p
    LEFT JOIN Paquete_Servicio ps ON p.id_paquete = ps.id_paquete
    LEFT JOIN Actividad a ON ps.id_paquete = a.id_paquete AND ps.id_servicio = a.id_servicio AND ps.tipo_servicio = a.tipo_servicio
    WHERE p.id_paquete = ?
  `, [paqueteId], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Error al obtener el paquete completo' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Paquete no encontrado' });
    }

    const paquete = {
      id_paquete: results[0].id_paquete,
      nom_paquete: results[0].nom_paquete,
      tipo_paquete: results[0].tipo_paquete,
      costo_paquete: results[0].costo_paquete,
      servicios: []
    };

    results.forEach(row => {
      let servicio = paquete.servicios.find(s => s.id_servicio === row.id_servicio && s.tipo_servicio === row.tipo_servicio);
      if (!servicio) {
        servicio = {
          id_servicio: row.id_servicio,
          tipo_servicio: row.tipo_servicio,
          actividades: []
        };
        paquete.servicios.push(servicio);
      }

      if (row.id_actividad) {
        servicio.actividades.push({
          id_actividad: row.id_actividad,
          fecha_actividad: row.fecha_actividad,
          hora_actividad: row.hora_actividad,
          descripcion_actividad: row.descripcion_actividad
        });
      }
    });

    res.status(200).json(paquete);
  });
};

// Crear un nuevo paquete


exports.createPaquete = (req, res) => {
  const { nom_paquete, tipo_paquete, costo_paquete, actividades, servicios } = req.body;
  const usuarioId = req.usuarioId;

  // Validación básica
  if (!nom_paquete || !tipo_paquete || costo_paquete === undefined) {
    return res.status(400).json({ error: 'Datos del paquete incompletos' });
  }

  const tiposServicioValidos = ['Hotel', 'Restaurante', 'Transportista', 'Guia', 'Museo', 'Viñedo', 'Atractivo Turístico', 'Otro'];

  function mapTipoServicio(tipo) {
    return tipo;
  }

  const serviciosMapeados = servicios.map(serv => ({
    ...serv,
    tipo_servicio: mapTipoServicio(serv.tipo_servicio)
  }));

  const serviciosInvalidos = serviciosMapeados.filter(serv => !tiposServicioValidos.includes(serv.tipo_servicio));
  if (serviciosInvalidos.length > 0) {
    return res.status(400).json({ 
      error: 'Tipo de servicio inválido', 
      serviciosInvalidos: serviciosInvalidos.map(s => s.tipo_servicio) 
    });
  }

  // Obtener el id_agencia del usuario
  connection.query(
    'SELECT id_agencia FROM AdminAgencia WHERE id_usr = ?',
    [usuarioId],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: 'Error al obtener la agencia del usuario', details: error.message });
      }
      if (results.length === 0) {
        return res.status(403).json({ error: 'El usuario no está asociado a ninguna agencia' });
      }

      const id_agencia = results[0].id_agencia;

      connection.beginTransaction((err) => {
        if (err) {
          return res.status(500).json({ error: 'Error al iniciar la transacción', details: err.message });
        }

        // 1. Insertar el paquete
        connection.query(
          'INSERT INTO Paquete (nom_paquete, tipo_paquete, costo_paquete, id_agencia) VALUES (?, ?, ?, ?)',
          [nom_paquete, tipo_paquete, costo_paquete, id_agencia],
          (error, results) => {
            if (error) {
              return connection.rollback(() => {
                res.status(500).json({ error: 'Error al crear el paquete', details: error.message });
              });
            }

            const id_paquete = results.insertId;

            // 2. Insertar los servicios
            insertarServicios(id_paquete, serviciosMapeados, (error) => {
              if (error) {
                return connection.rollback(() => {
                  res.status(500).json(error);
                });
              }

              // 3. Insertar las actividades
              const actividadesMapeadas = actividades.map(act => ({
                ...act,
                tipo_servicio: mapTipoServicio(act.tipo_servicio)
              }));

              insertarActividades(id_paquete, actividadesMapeadas, (error) => {
                if (error) {
                  return connection.rollback(() => {
                    res.status(500).json(error);
                  });
                }

                connection.commit((err) => {
                  if (err) {
                    return connection.rollback(() => {
                      res.status(500).json({ error: 'Error al finalizar la transacción', details: err.message });
                    });
                  }
                  res.status(201).json({
                    message: 'Paquete creado exitosamente',
                    id_paquete: id_paquete
                  });
                });
              });
            });
          }
        );
      });
    }
  );
};

// Funciones insertarServicios, insertarActividades y convertTo24Hour 

function insertarServicios(id_paquete, servicios, callback) {
  if (!servicios || servicios.length === 0) {
    return callback(null);
  }

  const serviciosValues = servicios.map(serv => 
    [id_paquete, serv.id_servicio, serv.tipo_servicio]
  );

  connection.query(
    'INSERT IGNORE INTO Paquete_Servicio (id_paquete, id_servicio, tipo_servicio) VALUES ?',
    [serviciosValues],
    (error) => {
      if (error) {
        return callback({ error: 'Error al crear servicios del paquete', details: error.message });
      }
      callback(null);
    }
  );
}

function insertarActividades(id_paquete, actividades, callback) {
  if (!actividades || actividades.length === 0) {
    return callback(null);
  }

  const actividadesValues = actividades.map(act => 
    [id_paquete, act.fecha_actividad, convertTo24Hour(act.hora_actividad), act.descripcion_actividad, act.id_servicio, act.tipo_servicio]
  );

  connection.query(
    'INSERT INTO Actividad (id_paquete, fecha_actividad, hora_actividad, descripcion_actividad, id_servicio, tipo_servicio) VALUES ?',
    [actividadesValues],
    (error) => {
      if (error) {
        return callback({ error: 'Error al crear actividades del paquete', details: error.message });
      }
      callback(null);
    }
  );
}

function convertTo24Hour(time12h) {
  const [time, modifier] = time12h.split(' ');
  let [hours, minutes] = time.split(':');
  if (hours === '12') {
    hours = '00';
  }
  if (modifier === 'PM') {
    hours = parseInt(hours, 10) + 12;
  }
  return `${hours}:${minutes}:00`;
}


// Actualizar un paquete
exports.updatePaquete = (req, res) => {
  const paqueteId = req.params.id;
  const { nom_paquete, tipo_paquete, costo_paquete } = req.body;

  if (!nom_paquete || !tipo_paquete || !costo_paquete) {
    return res.status(400).json({ error: 'Datos incompletos para la actualización del paquete' });
  }

  connection.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ error: 'Error al actualizar el paquete' });
    }

    connection.query(`
      UPDATE Paquete
      SET nom_paquete = ?, tipo_paquete = ?, costo_paquete = ?
      WHERE id_paquete = ?
    `, [nom_paquete, tipo_paquete, costo_paquete, paqueteId], (error, result) => {
      if (error) {
        return connection.rollback(() => {
          res.status(500).json({ error: 'Error al actualizar el paquete' });
        });
      }

      if (result.affectedRows === 0) {
        return connection.rollback(() => {
          res.status(404).json({ error: 'Paquete no encontrado' });
        });
      }

      // Si el tipo cambia a 'Predeterminado', eliminar asignaciones
      if (tipo_paquete === 'Predeterminado') {
        connection.query('DELETE FROM Asignacion_Paquete WHERE id_paquete = ?', [paqueteId], (deleteError) => {
          if (deleteError) {
            return connection.rollback(() => {
              res.status(500).json({ error: 'Error al actualizar el paquete' });
            });
          }

          connection.commit((commitError) => {
            if (commitError) {
              return connection.rollback(() => {
                res.status(500).json({ error: 'Error al actualizar el paquete' });
              });
            }
            res.status(200).json({
              message: 'Paquete actualizado correctamente y asignaciones eliminadas',
              updatedPackage: {
                id_paquete: paqueteId,
                nom_paquete,
                tipo_paquete,
                costo_paquete
              }
            });
          });
        });
      } else {
        connection.commit((commitError) => {
          if (commitError) {
            return connection.rollback(() => {
              res.status(500).json({ error: 'Error al actualizar el paquete' });
            });
          }
          res.status(200).json({
            message: 'Paquete actualizado correctamente',
            updatedPackage: {
              id_paquete: paqueteId,
              nom_paquete,
              tipo_paquete,
              costo_paquete
            }
          });
        });
      }
    });
  });
};

// Asignar el Paquete al Turista

exports.assignUserToPaquete = (req, res) => {
  const { id_paquete, id_usr } = req.body;


  if (!id_paquete || !id_usr) {
    return res.status(400).json({ error: 'Se requieren id_paquete e id_usr' });
  }

  // Primero, verificar si ya existe la asignación
  connection.query(
    'SELECT * FROM Asignacion_Paquete WHERE id_usr = ? AND id_paquete = ?',
    [id_usr, id_paquete],
    (selectError, selectResults) => {
      if (selectError) {
        return res.status(500).json({ error: 'Error al verificar asignación existente' });
      }

      if (selectResults.length > 0) {
        return res.status(409).json({ error: 'El usuario ya está asignado a este paquete' });
      }

      // Si no existe, proceder con la inserción
      connection.query(
        'INSERT INTO Asignacion_Paquete (id_usr, id_paquete) VALUES (?, ?)',
        [id_usr, id_paquete],
        (insertError, result) => {
          if (insertError) {
            return res.status(500).json({ error: 'Error al asignar usuario al paquete' });
          }

          res.status(201).json({
            message: 'Usuario asignado al paquete exitosamente',
            id_usr: id_usr,
            id_paquete: id_paquete
          });
        }
      );
    }
  );
};

// Desasignar el Paquete a un Turista, por si se equivoca el Agente(Admin)

exports.desasignarUsuarioPaquete = (req, res) => {
  const { idPaquete, idUsuario } = req.params;

  const query = 'DELETE FROM Asignacion_Paquete WHERE id_paquete = ? AND id_usr = ?';
  
  connection.query(query, [idPaquete, idUsuario], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Error al desasignar usuario del paquete' });
    }
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'No se encontró la asignación especificada' });
    }
    
    res.status(200).json({ message: 'Usuario desasignado del paquete exitosamente' });
  });
};

// Eliminar Paquete

exports.deletePaquete = (req, res) => {
  const paqueteId = req.params.id;

  connection.beginTransaction(error => {
    if (error) {
      return res.status(500).json({ error: 'Error al iniciar la transacción' });
    }

    // Primero, verificamos si el paquete es personalizado
    connection.query('SELECT tipo_paquete FROM Paquete WHERE id_paquete = ?', [paqueteId], (selectError, results) => {
      if (selectError) {
        return connection.rollback(() => {
          res.status(500).json({ error: 'Error al verificar el tipo de paquete' });
        });
      }

      if (results.length > 0 && results[0].tipo_paquete === 'Personalizado') {
        // Si es personalizado, eliminamos las asignaciones
        connection.query('DELETE FROM Asignacion_Paquete WHERE id_paquete = ?', [paqueteId], (asignError) => {
          if (asignError) {
            return connection.rollback(() => {
              res.status(500).json({ error: 'Error al eliminar asignaciones' });
            });
          }
          procederConEliminacion();
        });
      } else {
        procederConEliminacion();
      }
    });

    function procederConEliminacion() {
      connection.query('DELETE FROM Actividad WHERE id_paquete = ?', [paqueteId], actError => {
        if (actError) {
          return connection.rollback(() => {
            res.status(500).json({ error: 'Error al eliminar actividades' });
          });
        }

        connection.query('DELETE FROM Paquete_Servicio WHERE id_paquete = ?', [paqueteId], servError => {
          if (servError) {
            return connection.rollback(() => {
              res.status(500).json({ error: 'Error al eliminar servicios' });
            });
          }

          connection.query('DELETE FROM Paquete WHERE id_paquete = ?', [paqueteId], pkgError => {
            if (pkgError) {
              return connection.rollback(() => {
                res.status(500).json({ error: 'Error al eliminar paquete' });
              });
            }

            connection.commit(commitError => {
              if (commitError) {
                return connection.rollback(() => {
                  res.status(500).json({ error: 'Error al hacer commit' });
                });
              }
              res.status(200).json({ message: 'Paquete eliminado exitosamente' });
            });
          });
        });
      });
    }
  });
};

/* ----------------------------------------- Aqui Termina la parte de Abraham ------------------------------------------------------- */

exports.getAllConsultas = (req, res) => {
  const id_usr = req.usuarioId;

  connection.query('SELECT id_agencia FROM AdminAgencia WHERE id_usr = ?', [id_usr], (error, respuesta) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (respuesta.length === 0) {
      return res.status(404).json({ error: 'No se encontró la agencia para el usuario.' });
    }

    const id_agencia = respuesta[0].id_agencia;

    connection.query(
      'SELECT u.nom_usr, u.app_usr, u.nacionalidad_usr, u.sexo_usr, u.edad_usr, u.email_usr, u.ciudad_usr, c.* FROM Consulta c INNER JOIN Usuario u ON c.id_usr = u.id_usr WHERE c.id_agencia = ?',
      [id_agencia],
      (err, resp) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        // Formatear las fechas en DD-MM-YYYY
        const formattedResp = resp.map(consulta => ({
          ...consulta,
          llegada_cons: new Date(consulta.llegada_cons).toLocaleDateString('es-ES'),
          salida_cons: new Date(consulta.salida_cons).toLocaleDateString('es-ES'),
          fecha_creacion: new Date(consulta.fecha_creacion).toLocaleDateString('es-ES')
        }));

        res.status(200).json(formattedResp);
      }
    );
  });
}
