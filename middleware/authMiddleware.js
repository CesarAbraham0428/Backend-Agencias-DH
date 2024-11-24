const jwt = require('jsonwebtoken');
require("dotenv").config();

const verifyToken = (req, res, next) => {
    let token = req.headers['authorization'] ||  req.headers['x-access-token'];
    if (!token) {
        return res.status(403).json({ error: 'No token provided' });
    }
    if (token.startsWith('Bearer ')) {
        token = token.slice(7); // Remove 'Bearer ' prefix
    }    

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        req.usuarioId = decoded.id;
        req.usuarioRole = decoded.role; // Añadir el role del usuario al request
        next();
    });
};

module.exports = {
    verifyToken
};
