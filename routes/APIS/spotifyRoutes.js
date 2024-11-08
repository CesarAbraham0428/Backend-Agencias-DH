// routes/apis/spotify.routes.js
const express = require('express');
const router = express.Router();
const spotifyController = require('../../controllers/apis/spotifyController');
const spotifyAuthService = require('../../services/spotifyAuthService');

// Rutas de autenticación
router.get('/auth/login', (req, res) => {
    const authUrl = spotifyAuthService.getAuthUrl();
    res.redirect(authUrl);
});

router.get('/auth/callback', async (req, res) => {
    const { code } = req.query;
    try {
        const tokens = await spotifyAuthService.getAccessTokenFromCode(code);
        // Almacena los tokens o envíalos al frontend
        res.redirect(`${process.env.FRONTEND_URL}/success?access_token=${tokens.access_token}`);
    } catch (error) {
        res.redirect(`${process.env.FRONTEND_URL}/error`);
    }
});

//Rutas principales de la API
router.get('/tracks', spotifyController.getArtistTracks);


module.exports = router;