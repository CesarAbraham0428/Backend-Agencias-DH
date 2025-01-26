// controllers\apis\authController.js

const connection = require("../../connection");

const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const bcrypt = require("bcryptjs");


const { saveSuperToken, validateSuperToken } = require('../../services/tokenStore');
const { sendSuperToken } = require('../../services/emailService');

// Nuevo método para solicitar SuperToken (sin contraseña)
exports.requestSuperToken = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Buscar usuario por email
    const [results] = await connection.promise().query('SELECT * FROM Usuario WHERE email_usr = ?', [email]);
    if (results.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // 2. Generar y enviar SuperToken
    const superToken = crypto.randomBytes(4).toString('hex');
    saveSuperToken(email, superToken);
    await sendSuperToken(email, superToken);

    res.json({ message: "Token enviado a tu correo" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Método login tradicional (JWT)
exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;

    // 1. Buscar usuario en MySQL
    const query = 'SELECT * FROM Usuario WHERE email_usr = ?';
    const [results] = await connection.promise().query(query, [email]);

    if (results.length === 0) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const user = results[0];

    // 2. Validar contraseña con bcrypt
    const validPassword = await bcrypt.compare(password, user.passwd_usr);
    if (!validPassword) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // 3. Generar SuperToken
    const superToken = crypto.randomBytes(4).toString('hex'); // Ej: "a3f8"
    saveSuperToken(email, superToken); // Guardar en memoria

    // 4. Enviar por email
    await sendSuperToken(email, superToken);

    res.json({ message: "Token enviado a tu correo" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifySuperToken = async (req, res) => {
  try {
    const { email, superToken } = req.body;

    if (!validateSuperToken(email, superToken)) {
      return res.status(401).json({ error: "Token inválido o expirado" });
    }

    // Obtener usuario de MySQL
    const query = "SELECT * FROM Usuario WHERE email_usr = ?";
    const [results] = await connection.promise().query(query, [email]);

    if (results.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const user = results[0];
    const token = jwt.sign(
      { id: user.id_usr, role: user.role }, // Ajusta "id_usr" al nombre real de tu columna
      process.env.ACCESS_TOKEN,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
