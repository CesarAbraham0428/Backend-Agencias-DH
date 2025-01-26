//middleware\gestorMiddleware.js
require("dotenv").config();

const isGestor = (req, res, next) => {
    if (req.usuarioRole !== 'gestor') {
        return res.status(403).json({ error: 'Forbidden' }); 
    }
    next();
};

module.exports = {
    isGestor
};
