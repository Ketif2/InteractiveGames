import jwt from 'jsonwebtoken';

const authenticate = (req, res, next) => {
    // Primero intentar obtener el token de la cookie
    let token = req.cookies.token;
    
    // Si no hay token en las cookies, verificar el encabezado Authorization
    if (!token && req.headers.authorization) {
        const authHeader = req.headers.authorization;
        if (authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7); // Extraer el token después de "Bearer "
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        // Si el token vino de una cookie, borrarla
        if (req.cookies.token) {
            res.clearCookie('token', {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                path: '/'
            });
        }
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

export default authenticate;