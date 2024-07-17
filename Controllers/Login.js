import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import { configDotenv } from "dotenv";

configDotenv();
const adminLogin = async (req, res) => {
    const query = "SELECT password FROM admin WHERE email = ?";
    try {

        const [result, fields] = await con.query(query, [req.body.username, req.body.password]);
        if (result.length > 0) {
            const isPasswordCorrect = await bcrypt.compare(req.body.password, result[0].password);
            
            if (isPasswordCorrect) {
                const user = result[0];
                const email = user.email;
                const token = jwt.sign({ role: "admin", email }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.TOKEN_SPAN});

                res.cookie('token', token);
                return res.json({
                    loginStatus: true,
                });
            } else {
                res.status(401);
                return res.json({
                    loginStatus: false,
                    error: 'Invalid Credentials'
                })
            }
        } else {
            res.status(401);
            return res.json({
                loginStatus: false,
                error: "User not found. Please check credentials.",
            });
        }
    } catch (e) {
        res.status(500);
        return res.json({
            loginStatus: false,
            error: e,
        });
    }
};

const verifyToken = async (req, res) => {
    try {
        const authorizationHeader = req.headers.authorization;
        const authToken = authorizationHeader.split(' ')[1];
        if (!authToken) {
            res.status(400);
            return res.json({
                error: 'Token Not Found',
                isSessionValid: false,
            })
        }

        const authData = jwt.decode(authToken, { complete: true });

        if (!authData) {
            res.status(400);
            return res.json({
                error: 'Invalid Token',
                isSessionValid: false,
            });
        }

        const tokenExpiry = authData.payload.exp;

        if ((tokenExpiry * 1000) < Date.now()) {
            res.status(401);
            return res.json({
                error: 'Token Expired',
                isSessionValid: false,
            });
        }

        return res.json({
            isSessionValid: true,
        })
    } catch (e) {
        res.status(500);
        return res.json({
            error: 'Something went wrong',
        })
    }
}

export { adminLogin, verifyToken };