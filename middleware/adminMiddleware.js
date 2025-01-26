//middleware\adminMiddleware.js
require("dotenv").config();

const isAdmin = (req, res, next) => {
    if (req.usuarioRole !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' }); 
    }
    next();
};

module.exports = {
    isAdmin
};
