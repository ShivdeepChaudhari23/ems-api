import express from "express";
import { adminLogin, verifyToken } from "../Controllers/Login.js";
import { validateLoginPayload } from "../utils/validations.js";

const router = express.Router();

router
    .post('/admin', validateLoginPayload,  adminLogin)
    .get('/verify', verifyToken)

export { router as loginRouter};
