// controllers/apis/spotifyController.js
const spotifyService = require('../../services/spotifyService');

const spotifyController = {
    async getArtistTracks(req, res) {
        try {
            const tracks = await spotifyService.getTopTracks();
            res.json({ 
                success: true, 
                data: tracks 
            });
        } catch (error) {
            res.status(500).json({ 
                success: false,
                error: 'Error al obtener las canciones del artista'
            });
        }
    },
};

module.exports = spotifyController;