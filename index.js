const express = require('express');
const cors = require('cors');
const multer = require('multer');
const upload = multer();

// Rutas Users
const usuarioRoute = require('./routes/usuarioRoutes');
const adminRoute = require('./routes/adminRoutes');
const gestorRoute = require('./routes/gestorRoutes');

//Rutas Apis
const geolocationRoutes = require('./routes/apis/geolocationRoutes');
const weatherRoutes = require('./routes/apis/weatherRoutes');
const spotifyRoutes = require('./routes/apis/spotifyRoutes');
const foursquareRoutes = require('./routes/apis/foursquareRoutes');


// Configuración de la aplicación Express
const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:4200', 'https://agencia-dh.vercel.app'], // permite varias fuentes
    optionsSuccessStatus: 200,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
}));

// Middleware para parsear JSON y URL-encoded
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use('/usuario', usuarioRoute);
app.use('/admin', adminRoute);
app.use('/gestor', gestorRoute); 

//Apis

app.get('/api/paypal-client-id', (req, res) => {
    const paypalClientId = process.env.PAYPAL_CLIENT_ID;
    res.json({ clientId: paypalClientId });
  });

  //Apis nuevas
  
  app.use('/api/routes', geolocationRoutes);
  app.use('/api/weather', weatherRoutes);
  app.use('/api/spotify', spotifyRoutes);
  app.use('/api/foursquare', foursquareRoutes);
  
  // Global error handler
app.use((err, res,) => {
    console.error(err.stack);
    res.status(500).send('Algo esta roto!');
});

module.exports = app;