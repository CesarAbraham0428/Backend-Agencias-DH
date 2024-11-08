// routes/apis/spotifyAuth.routes.js
const express = require('express');
const router = express.Router();
const spotifyAuthService = require('../../services/spotifyAuthService');

router.get('/login', (req, res) => {
    const authUrl = spotifyAuthService.getAuthUrl();
    res.redirect(authUrl);
});

router.get('/callback', async (req, res) => {
    const { code } = req.query;
    
    try {
        const tokens = await spotifyAuthService.getAccessTokenFromCode(code);
        
        // Aquí deberías guardar los tokens en tu base de datos
        // asociados con el usuario actual
        
        res.redirect('/success'); // Redirige a tu frontend
    } catch (error) {
        res.redirect('/error');
    }
});

module.exports = router;