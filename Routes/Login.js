import express from "express";
import { adminLogin, verifyToken } from "../Controllers/Login.js";
import { validatePayload } from "../utils/validations.js";
import { loginSchema } from "../constants/validation-schema.js";

const router = express.Router();

router
    .post('/admin', (req, res, next) => validatePayload(req, res, next, loginSchema),  adminLogin)
    .get('/verify', verifyToken)

export { router as loginRouter};
