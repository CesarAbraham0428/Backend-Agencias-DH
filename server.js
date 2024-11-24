require('dotenv').config();
const http = require('http');
const app = require('./index');

// Crear servidor HTTP y pasar la aplicación Express
const server = http.createServer(app);

// Escuchar en el puerto especificado en las variables de entorno
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Servidor esta corriendo en el puerto ${port}`);
});

