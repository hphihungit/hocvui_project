import jwt from 'jsonwebtoken'

// want to like a post
// clike like button => auth middleware(next) => like controller

const auth = async (req, res, next) => {
    try {

        const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];

        if (!token) return res.status(401).json({ message: "Không thể xác thực" });

        const isCustomAuth = token.length < 500;

        let decodedData;

        if (token && isCustomAuth) {
            decodedData = jwt.verify(token, 'test');

            req.userId = decodedData?.id;
        } else {
            decodedData = jwt.decode(token);

            req.userId = decodedData?.sub;
        }

        next();
    } catch (error) {
        console.log(error)
    }
}

export default auth