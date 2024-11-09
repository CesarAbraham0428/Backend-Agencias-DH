// services/spotifyService.js
const axios = require('axios');
require('dotenv').config();

class SpotifyService {
    constructor() {
        this.clientId = process.env.CLIENT_ID_A;
        this.clientSecret = process.env.CLIENT_SECRET_A;
        this.token = null;
        this.tokenExpirationTime = null;
    }

    async getAccessToken() {
        // Verificar si el token actual sigue siendo válido
        if (this.token && this.tokenExpirationTime > Date.now()) {
            return this.token;
        }

        try {
            const response = await axios({
                method: 'post',
                url: 'https://accounts.spotify.com/api/token',
                params: {
                    grant_type: 'client_credentials'
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')
                }
            });

            this.token = response.data.access_token;
            // Establecer tiempo de expiración (1 hora menos 5 minutos por seguridad)
            this.tokenExpirationTime = Date.now() + (response.data.expires_in - 300) * 1000;
            return this.token;
        } catch (error) {
            throw error;
        }
    }

    async getArtistInfo() {
        const artistId = '2T06whb4s6UiufL1j5Qtz9'; // José Alfredo Jiménez ID
        try {
            const token = await this.getAccessToken();
            const response = await axios.get(
                `https://api.spotify.com/v1/artists/${artistId}`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );
            return {
                name: response.data.name,
                images: response.data.images,
                followers: response.data.followers.total,
                popularity: response.data.popularity,
                genres: response.data.genres
            };
        } catch (error) {
            throw error;
        }
    }

    async getTopTracks() {
        const artistId = '2T06whb4s6UiufL1j5Qtz9'; // José Alfredo Jiménez ID
        try {
            const token = await this.getAccessToken();
            const response = await axios.get(
                `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=MX`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );
            
            if (!response.data || !response.data.tracks) {
                throw new Error('No se encontraron tracks para el artista');
            }
    
            return response.data.tracks.slice(0, 10).map(track => ({
                id: track.id,
                name: track.name,
                duration_ms: track.duration_ms,
                preview_url: track.preview_url,
                external_url: track.external_urls.spotify,
                image: track.album.images[0]?.url,
                popularity: track.popularity,
                uri: track.uri // Importante para agregar a playlist
            }));
        } catch (error) {
            throw new Error(error.response?.data?.error?.message || 'Error al obtener las canciones del artista');
        }
    }
}

module.exports = new SpotifyService();