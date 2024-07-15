import express from "express";
import {
    addCategory,
    addEmployee,
    getAllEmployees,
    getCategories,
    getEmployee,
    updateEmployee,
    adminLogout,
    deleteEmployee
} from "../Controllers/Admin.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const authenticateHeader = (req, res, next) => {
    const authorizationHeader = req.headers.authorization;
    const authToken = authorizationHeader.split(' ')[1];
    if (!authToken) {
        res.status(401);
        return res.json({
            error: 'Unauthorized request',
        });
    }

    const authData = jwt.decode(authToken, { complete: true });

    if (!authData) {
        res.status(401);
        return res.json({
            error: 'Invalid Token',
        });
    }


    const tokenExpiry = authData.payload.exp;

    if ((tokenExpiry * 1000) < Date.now()) {
        res.status(401);
        return res.json({
            error: 'Token Expired',
        });
    }

    next();
};

router.use(authenticateHeader);
router
    .post('/add-category', addCategory)
    .post('/add-employee', addEmployee)
    .get('/employees', getAllEmployees)
    .get('/categories', getCategories)
    .get('/employee/:id', getEmployee)
    .get('/logout', adminLogout)
    .put('/employee/:id', updateEmployee)
    .delete('/employee/:id', deleteEmployee);
export { router as adminRouter};
