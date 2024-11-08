const connection = require('../connection');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const jwt = require('jsonwebtoken');
require("dotenv").config();
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// Configuración del transportador con una cuenta de Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL, // tu correo electrónico
        pass: process.env.PASSWORD // tu contraseña de correo electrónico o contraseña de aplicación
    }
});

// Verificar la configuración del transportador
transporter.verify(function(error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take our messages:', success);
    }
});

const requestPasswordReset = (req, res) => {
    const { email_usr } = req.body;
    const query = "SELECT updated_at FROM Usuario WHERE email_usr = ?";

    connection.query(query, [email_usr], (err, results) => {
        if (err) {
            return res.status(500).json(err);
        }

        if (results.length <= 0) {
            return res.status(400).json({ message: "Email no encontrado" });
        } else {
            const lastRequest = results[0].updated_at;
            
            // Obtener la hora actual del servidor de la base de datos
            connection.query("SELECT CURRENT_TIMESTAMP as currentTime", (err, timeResults) => {
                if (err) {
                    return res.status(500).json(err);
                }

                const currentTime = new Date(timeResults[0].currentTime);
                const lastRequestTime = new Date(lastRequest);
                const diffInHours = (currentTime - lastRequestTime) / (1000 * 60 * 60);

                if (lastRequest && diffInHours < 1) {
                    console.log('Recuperación de contraseña denegada. Intento dentro de una hora.');
                    return res.status(429).json({ message: "Por favor, espere una hora antes de solicitar nuevamente" });
                }

                const token = jwt.sign({ email: email_usr }, process.env.ACCESS_TOKEN, { expiresIn: '1h' });
                const resetLink = `https://senderos-dh.vercel.app/reestablecer-contrasena?token=${token}`;

                const mailOptions = {
                    from: process.env.EMAIL,
                    to: email_usr,
                    subject: 'Restablecimiento de Contraseña',
                    html: `<h1>Restablecer Contraseña</h1>
                           <p>Haz clic en el siguiente enlace para restablecer tu contraseña: <a href="${resetLink}">Restablecer Contraseña</a></p>`
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return res.status(500).json({ message: "Error sending email", error: error });
                    } else {
                        console.log('Email sent: ' + info.response);

                        // Actualizar la hora de la última solicitud
                        const updateQuery = "UPDATE Usuario SET updated_at = CURRENT_TIMESTAMP WHERE email_usr = ?";
                        connection.query(updateQuery, [email_usr], (err) => {
                            if (err) {
                                return res.status(500).json({ message: "Error al actualizar la solicitud", error: err });
                            }

                            return res.status(200).json({ message: "Password reset link sent to your email." });
                        });
                    }
                });
            });
        }
    });
};

// Controlador para restablecer la contraseña
const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
        const email = decoded.email;

        const query = "SELECT * FROM Usuario WHERE email_usr = ?";
        connection.query(query, [email], async (err, results) => {
            if (err) {
                return res.status(500).json(err);
            }

            if (results.length <= 0) {
                return res.status(400).json({ message: "User not found" });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            const updateQuery = "UPDATE Usuario SET passwd_usr = ?, updated_at = CURRENT_TIMESTAMP WHERE email_usr = ?";
            connection.query(updateQuery, [hashedPassword, email], (err, results) => {
                if (err) {
                    return res.status(500).json(err);
                }
                return res.status(200).json({ message: "Password successfully updated" });
            });
        });
    } catch (error) {
        return res.status(400).json({ message: "Invalid or expired token" });
    }
};

const registerUser = async (req, res) => {
    let usuario = req.body;
    const query = "SELECT email_usr FROM Usuario WHERE email_usr = ?";

    connection.query(query, [usuario.email_usr], async (err, results) => {
        if (err) {
            return res.status(500).json(err);
        }

        if (results.length <= 0) {
            // Encriptar la contraseña
            usuario.passwd_usr = await bcrypt.hash(usuario.passwd_usr, 10);

            const insertQuery = "INSERT INTO Usuario (nom_usr, app_usr, passwd_usr, nacionalidad_usr, sexo_usr, edad_usr, email_usr, ciudad_usr, status, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'false', 'usuario')";

            connection.query(insertQuery, [usuario.nom_usr, usuario.app_usr, usuario.passwd_usr, usuario.nacionalidad_usr, usuario.sexo_usr, usuario.edad_usr, usuario.email_usr, usuario.ciudad_usr], (err, results) => {
                if (err) {
                    return res.status(500).json(err);
                }

                // Enviar correo de confirmación
                const token = jwt.sign({ email: usuario.email_usr }, process.env.ACCESS_TOKEN, { expiresIn: '1d' });
                const mailOptions = {
                    from: process.env.EMAIL,
                    to: usuario.email_usr,
                    subject: 'Validación de Correo en Agencias Dolores Hidalgo',
                    html: `<h1>Confirmación de email</h1>
                           <p>Ignora este correo si no fuiste tú</p>
                           <p>Click <a href="backend-agencias-dh-production.up.railway.app/usuario/confirm/${token}">aquí</a> para confirmar tu correo electrónico.</p>`
                }; //La líne de la etiqueta p se deberá cambiar si se cambia la direccion de deploy del backend.

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });

                return res.status(200).json({ message: "Successfully Registered. Please confirm your email." });
            });
        } else {
            return res.status(400).json({ message: "Email Already Exists" });
        }
    });
};

const confirmEmail = (req, res) => {
    const token = req.params.token;

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(400).json({ error: 'No se pudo confirmar el correo. Verifica el enlace e inténte registrarse de nuevo.' }); //REMPLAZAR
        }

        const email = decoded.email;

        const queryCheck = "SELECT * FROM Usuario WHERE email_usr = ? AND status = 'true'";
        connection.query(queryCheck, [email], (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Error en la verificación del estado del usuario.' });
            }
            if (results.length > 0) {
                res.redirect('https://senderos-dh.vercel.app/login');
            }

            const query = "UPDATE Usuario SET status = 'true' WHERE email_usr = ?";
            connection.query(query, [email], (err, result) => {
                if (err) {
                  return res.status(500).json({ error: 'Error al validar. Inténtelo de nuevo más tarde.' });  //REMPLAZAR
                 }

                 // Redirect to the frontend after successful email confirmation
                res.redirect('https://senderos-dh.vercel.app/login');
             });
        });
    });
};

const loginUser = (req, res) => {
    const { email_usr, passwd_usr } = req.body;
    const query = "SELECT * FROM Usuario WHERE email_usr = ?";

    connection.query(query, [email_usr], async (err, results) => {
        if (err) {
            return res.status(500).json(err);
        }

        if (results.length === 0 || results[0].status !== 'true') {
            return res.status(401).json({ message: 'Invalid email or password, or email not confirmed' });
        }

        const usuario = results[0];

        const validPassword = await bcrypt.compare(passwd_usr, usuario.passwd_usr);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: usuario.id_usr, email: usuario.email_usr, role: usuario.role }, process.env.ACCESS_TOKEN, { expiresIn: '8h' });

        res.status(200).json({ token });
    });
};

//se puede usar para crear el perfil supongo
const getProfile = (req, res) => {
    const query = "SELECT * FROM Usuario WHERE id_usr = ?";

    connection.query(query, [req.usuarioId], (err, results) => {
        //el valor de req.usuarioId es any
        if (err) {
            return res.status(500).json(err);
        }

        res.status(200).json(results[0]);
    });
};

const getAllAgencias = (req, res) => {
    connection.query('SELECT * FROM Agencia', (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.status(200).json(results);
    });
  };

  const getAllHoteles = (req, res) => {
    connection.query(`SELECT * FROM Hosteleria where tipo_hs = 'Hotel'`, (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.status(200).json(results);
    });
  };

  const getAllRestaurantes = (req, res) => {
    connection.query(`SELECT * FROM Hosteleria where tipo_hs = 'Restaurante'`, (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.status(200).json(results);
    });
  };
  
  const mandarConsulta = (req, res) => {
    const id_usr = req.usuarioId;
    const { adults_18_36, adults_37_64, ninos_0_8, ninos_9_17, travel_with, budget, actividades, lugar_deseado, hotel, restaurante, experiencia, nom_agencia } = req.body;
    const { llegada_cons, salida_cons } = req.body;

    // Verificar si el usuario ha enviado una consulta en la última semana
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    connection.query('SELECT * FROM Consulta WHERE id_usr = ? AND fecha_creacion >= ?', [id_usr, oneWeekAgo], (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }

        if (results.length > 0) {
            return res.status(429).json({ error: 'Solo puedes enviar una consulta cada semana.' });
        }

        // Obtener id_agencia
        connection.query('SELECT id_agencia FROM Agencia WHERE nom_ag = ?', [nom_agencia], (error, agenciaResults) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            }

            if (agenciaResults.length === 0) {
                return res.status(404).json({ error: 'Agencia no encontrada' });
            }

            const id_agencia = agenciaResults[0].id_agencia;

            // Insertar nueva consulta
            connection.query(
                'INSERT INTO Consulta (llegada_cons, salida_cons, adults_18_36, adults_37_64, ninos_0_8, ninos_9_17, travel_with, budget, actividades, lugar_deseado, hotel, restaurante, experiencia, id_agencia, id_usr, fecha_creacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
                [llegada_cons, salida_cons, adults_18_36, adults_37_64, ninos_0_8, ninos_9_17, travel_with, budget, actividades, lugar_deseado, hotel, restaurante, experiencia, id_agencia, id_usr],
                (err, result) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }

                    res.status(200).json({ 
                        id_consulta: result.insertId, 
                        llegada_cons, 
                        salida_cons, 
                        adults_18_36, 
                        adults_37_64, 
                        ninos_0_8, 
                        ninos_9_17, 
                        travel_with, 
                        budget, 
                        actividades, 
                        lugar_deseado, 
                        hotel, 
                        restaurante, 
                        experiencia, 
                        id_agencia, 
                        id_usr 
                    });
                }
            );
        });
    });
};



  const getAllAtracTuristico = (req, res) => {
    connection.query('SELECT * FROM AtracTuristico', (error, results) => {
      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }
      res.status(200).json(results);
    });
  };

  //Para obtener los paquetes que tiene el turista
  const getMisPaquetesCompletos= (req, res) => {
    const usuarioId = req.usuarioId;
  
    // Obtener los paquetes asignados al usuario
    connection.query(
      `SELECT DISTINCT p.* 
       FROM Paquete p
       INNER JOIN Asignacion_Paquete ap ON p.id_paquete = ap.id_paquete
       WHERE ap.id_usr = ?`,
      [usuarioId],
      (error, paquetes) => {
        if (error) {
          return res.status(500).json({ error: 'Error al obtener los paquetes del usuario' });
        }
  
        if (paquetes.length === 0) {
          return res.status(200).json([]);
        }
  
        // Obtener los servicios y actividades para cada paquete
        const paquetesIds = paquetes.map(p => p.id_paquete);
        connection.query(`
          SELECT p.id_paquete, ps.id_servicio, ps.tipo_servicio,
            a.id_actividad, a.fecha_actividad, a.hora_actividad, a.descripcion_actividad
          FROM Paquete p
          LEFT JOIN Paquete_Servicio ps ON p.id_paquete = ps.id_paquete
          LEFT JOIN Actividad a ON ps.id_paquete = a.id_paquete AND ps.id_servicio = a.id_servicio AND ps.tipo_servicio = a.tipo_servicio
          WHERE p.id_paquete IN (?)
        `, [paquetesIds], (error, results) => {
          if (error) {
            return res.status(500).json({ error: 'Error al obtener los detalles de los paquetes' });
          }
  
          const paquetesCompletos = paquetes.map(paquete => {
            const paqueteCompleto = {
              ...paquete,
              servicios: []
            };
  
            results.filter(r => r.id_paquete === paquete.id_paquete).forEach(row => {
              let servicio = paqueteCompleto.servicios.find(s => s.id_servicio === row.id_servicio && s.tipo_servicio === row.tipo_servicio);
              if (!servicio && row.id_servicio) {
                servicio = {
                  id_servicio: row.id_servicio,
                  tipo_servicio: row.tipo_servicio,
                  actividades: []
                };
                paqueteCompleto.servicios.push(servicio);
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
  
            return paqueteCompleto;
          });
  
          res.status(200).json(paquetesCompletos);
        });
      }
    );
  };

  const authFacebook = (req, res) => {
    const { authToken } = req.body;
  
    // Valida el token con la API de Facebook
    axios.get(`https://graph.facebook.com/me?access_token=${authToken}`)
      .then(response => {
        const facebookUser = response.data;
  
        // Si el token es válido, genera un token personalizado
        const token = jwt.sign(
          {
            id: facebookUser.id,
            name: facebookUser.name,
            email: facebookUser.email,
            role: 'usuario' // Ajusta esto según sea necesario
          },
          process.env.ACCESS_TOKEN,
          { expiresIn: '1h' }
        );
  
        // Devuelve el token personalizado al frontend
        res.json({ token });
      })
      .catch(error => {
        console.error('Error al validar el token de Facebook:', error);
        res.status(401).json({ error: 'Token inválido' });
      });
  };
  
  const registerUserFacebook = async (req, res) => {
    let usuario = req.body;
    const query = "SELECT email_usr FROM Usuario WHERE email_usr = ?";

    connection.query(query, [usuario.email_usr], async (err, results) => {
        if (err) {
            return res.status(500).json(err);
        }

        if (results.length <= 0) {
            // Encriptar la contraseña
            usuario.passwd_usr = await bcrypt.hash(usuario.passwd_usr, 10);

            const insertQuery = "INSERT INTO Usuario (nom_usr, app_usr, passwd_usr, nacionalidad_usr, sexo_usr, edad_usr, email_usr, ciudad_usr, status, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'false', 'usuario')";

            connection.query(insertQuery, [usuario.nom_usr, usuario.app_usr, usuario.passwd_usr, usuario.nacionalidad_usr, usuario.sexo_usr, usuario.edad_usr, usuario.email_usr, usuario.ciudad_usr], (err, results) => {
                if (err) {
                    return res.status(500).json(err);
                }
                return res.status(200).json({ message: "Successfully Registered." });
            });
        } else {
            // Si el usuario ya existe, actualiza la información del usuario
            const updateQuery = "UPDATE Usuario SET nom_usr = ?, app_usr = ?, nacionalidad_usr = ?, sexo_usr = ?, edad_usr = ?, ciudad_usr = ? WHERE email_usr = ?";

            connection.query(updateQuery, [usuario.nom_usr, usuario.app_usr, usuario.nacionalidad_usr, usuario.sexo_usr, usuario.edad_usr, usuario.ciudad_usr, usuario.email_usr], (err, results) => {
                if (err) {
                    return res.status(500).json(err);
                }
                return res.status(200).json({ message: "User information updated successfully." });
            });
        }
    });
};


const obtenerEmailsUsuarios = (callback) => {
    connection.query('SELECT email_usr FROM Usuario WHERE role = ?', ['usuario'], (error, results) => {
        if (error) {
            return callback(error, null);
        }
        const emails = results.map(row => row.email_usr); // Mapea solo los correos
        callback(null, emails);
    });
};

 //Función para enviar correos a los usuarios obtenidos
 const enviarCorreosATodosLosUsuarios = () => {
    obtenerEmailsUsuarios((error, correos) => {
        if (error) {
            console.error("Error al obtener correos:", error);
            return;
        }

        correos.forEach(correo => {
            const mailOptions = {
                from: process.env.EMAIL, // Dirección de remitente
                to: correo, 
                subject: '¡Promoción Especial!', 
                text: '¡Bienvenido a nuestra promoción especial!', 
                html: `
                    <div style="font-family: Arial, sans-serif; color: #333; text-align: center; padding: 20px;">
                        <h1 style="color: #4CAF50;">¡Bienvenido a nuestra promoción especial!</h1>
                        <p style="font-size: 16px;">Te invitamos a participar en nuestra nueva promoción donde podrás CREAR TUS PROPIOS PAQUETES PARA VIAJAR.</p>
                        <p></p>
                        <p> Haz clic en el botón de abajo para comenzar a diseñar tu próxima aventura.</p>
                        <a href="https://senderos-dh.vercel.app/inicio" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Ver Promoción</a>
                        <p style="font-size: 14px; color: #555; margin-top: 20px;">Si tienes alguna pregunta, no dudes en contactarnos. ¡Gracias por estar con nosotros!</p>
                    </div>
                `
            };

            // Enviar el correo
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error(`Error al enviar correo a ${correo}:`, error);
                } else {
                    console.log(`Correo enviado a: ${correo} - Info: ${info.response}`);
                }
            });
        });
    });
};

enviarCorreosATodosLosUsuarios(); 


// Programar el envío de correos cada 2 días
cron.schedule('0 0 */2 * *', () => {
    console.log('Enviando correos cada 2 días...');
    enviarCorreosATodosLosUsuarios();
});



const enviarTicket = async (req, res) => {
    try {
          const { email } = req.body;
    const ticket = req.file;
    // Agrega estos logs para inspeccionar los datos
    console.log('Datos recibidos en el body:', req.body);
    console.log('Email:', email);
    console.log('Archivo recibido (ticket):', ticket);
    
    if (!email) {
        return res.status(400).json({ error: 'Email es requerido.' });
    }
    if (!ticket) {
        return res.status(400).json({ error: 'Ticket es requerido.' });
    }
    console.log('Email:', email);
  console.log('Ticket:', ticket); // <-- Verifica los valores recibidos

      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Tu ticket de compra',
        text: 'Adjunto encontrarás tu ticket de compra.',
        attachments: [
          {
            filename: 'ticket.pdf',
            content: ticket.buffer,
            contentType: 'application/pdf'
          }
        ]
      };

      // Enviar el correo
      await transporter.sendMail(mailOptions);

      // Responder con éxito si se envió el correo
      res.status(200).send('Correo enviado con éxito');
    } catch (error) {
        res.status(500).send('Error al enviar info', error);
    }
  };



module.exports = {
    authFacebook,
    registerUserFacebook,
    registerUser,
    confirmEmail,
    loginUser,
    getProfile, //No se si se vaya a usar
    requestPasswordReset,
    resetPassword,
    getAllAgencias,
    getAllHoteles,
    getAllRestaurantes,
    mandarConsulta,
    getAllAtracTuristico,
    getMisPaquetesCompletos,
    enviarTicket
};
