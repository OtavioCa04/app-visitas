const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ error: 'Token não fornecido' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        req.userEmail = decoded.email;
        
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token inválido ou expirado' });
    }
};

module.exports = auth;