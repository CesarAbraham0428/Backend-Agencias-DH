// controllers\apis\authController.js

const connection = require("../../connection");

const {
  saveSuperToken,
  validateSuperToken,
} = require("../../services/tokenStore");

const { sendSuperToken } = require("../../services/emailService");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Buscar usuario en MySQL
    const query = "SELECT * FROM Usuario WHERE email_usr = ?";
    const [results] = await connection.promise().query(query, [email]);

    if (results.length === 0) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const user = results[0];

    // 2. Comparar contraseña con bcrypt
    const validPassword = await bcrypt.compare(password, user.passwd_usr); // Usar passwd_usr (nombre de tu columna)
    if (!validPassword) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // 3. Generar y enviar SuperToken (el resto del código sigue igual)
    const superToken = crypto.randomBytes(4).toString("hex");
    saveSuperToken(user.email_usr, superToken);
    await sendSuperToken(user.email_usr, superToken);

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
