// services/spotifyAuthService.js
const axios = require('axios');
require('dotenv').config();

class SpotifyAuthService {
    constructor() {
        this.clientId = process.env.CLIENT_ID_A;
        this.clientSecret = process.env.CLIENT_SECRET_A;
    }

    getAuthUrl() {
        const scopes = [
            'playlist-modify-public',
            'playlist-modify-private',
            'user-read-private'
        ];

        return 'https://accounts.spotify.com/authorize?' + 
            `client_id=${this.clientId}&` +
            `response_type=code&` +
            `redirect_uri=${encodeURIComponent(this.redirectUri)}&` +
            `scope=${encodeURIComponent(scopes.join(' '))}`;
    }

    async getAccessTokenFromCode(code) {
        try {
            const response = await axios({
                method: 'post',
                url: 'https://accounts.spotify.com/api/token',
                params: {
                    grant_type: 'authorization_code',
                    code,
                    redirect_uri: this.redirectUri
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')
                }
            });

            return {
                accessToken: response.data.access_token,
                refreshToken: response.data.refresh_token,
                expiresIn: response.data.expires_in
            };
        } catch (error) {
            throw error;
        }
    }

    async refreshAccessToken(refreshToken) {
        try {
            const response = await axios({
                method: 'post',
                url: 'https://accounts.spotify.com/api/token',
                params: {
                    grant_type: 'refresh_token',
                    refresh_token: refreshToken
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')
                }
            });

            return {
                accessToken: response.data.access_token,
                expiresIn: response.data.expires_in
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new SpotifyAuthService();