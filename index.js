const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/apis/authRoutes');

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

// Configuración de CORS
app.use(cors({
    origin: [
      'http://localhost:4200', 
      'https://senderosdh.vercel.app',
    ],
    optionsSuccessStatus: 200,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept']
  }));
  
  
// Middleware para parsear JSON y URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/usuario', usuarioRoute);
app.use('/admin', adminRoute);
app.use('/gestor', gestorRoute); 

//Apis

app.use('/api/auth', authRoutes);

//PayPal
app.get('/api/paypal-client-id', (req, res) => {
  const paypalClientId = process.env.PAYPAL_CLIENT_ID;
  res.json({ clientId: paypalClientId });
});

  //Apis de geolocation, weather, spotify y foursquare
  
  app.use('/api/geolocalizacion', geolocationRoutes);
  app.use('/api/weather', weatherRoutes);
  app.use('/api/spotify', spotifyRoutes);
  app.use('/api/foursquare', foursquareRoutes);
  
// Manejo de errores mejorado
app.use((err, res,) => {
    console.error(err.stack);
    res.status(500).send('Algo esta roto!');
});

module.exports = app;