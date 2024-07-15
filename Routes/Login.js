import express from "express";
import { adminLogin } from "../Controllers/Login.js";

const router = express.Router();

router.post('/admin', adminLogin)
export { router as loginRouter};