// services\emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

exports.sendSuperToken = async (email, token) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Tu SuperToken',
      text: `Tu código es: ${token}`
    });
    console.log('Correo enviado a:', email); // 👈 Confirmar envío
  } catch (error) {
    console.error('Error enviando correo:', error); // 👈 Verifica credenciales
    throw new Error('No se pudo enviar el token');
  }
};