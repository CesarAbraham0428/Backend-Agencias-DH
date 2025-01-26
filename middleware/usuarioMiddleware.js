//middleware\usuarioMiddleware.js
require("dotenv").config();

const isUsuario = (req, res, next) => {
    if (req.usuarioRole !== 'usuario') {
        return res.status(403).json({ error: 'Forbidden' }); 
    }
    next();
};

module.exports = {
    isUsuario
};
