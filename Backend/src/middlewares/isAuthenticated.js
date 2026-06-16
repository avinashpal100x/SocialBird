import jwt from 'jsonwebtoken'


const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({
            message: "Invalid token",
            success: false
        })

        const verifyToken = await jwt.verify(token, process.env.SECRET_KEY);

        req.userId = verifyToken.userId;
        next();
    }
    catch (error) {
        console.error(error);
        return res.status(401).json({
            message: "Unauthorized",
            success: false
        });
    }
}

export default isAuthenticated