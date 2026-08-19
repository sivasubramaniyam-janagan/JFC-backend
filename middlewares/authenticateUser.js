import jwt from "jsonwebtoken";
export default function authenticateUser(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader!=null){
        const token = authHeader.replace("Bearer ", "");
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(decoded==null){
                return res.status(401).json({ message: "Invalid token" });
            }
            else{
                req.user = decoded;
                next();
            }
        });
    }
    else{
        next();
    }
}