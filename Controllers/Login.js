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

                return res.json({
                    loginStatus: true,
                    token,
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

export { adminLogin };