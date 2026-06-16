import jwt from 'jsonwebtoken'

export const generateToken = (id) => {
    try {
        const token = jwt.sign({ userId:id }, process.env.SECRET_KEY, { expiresIn: "1d" });
        return token;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}