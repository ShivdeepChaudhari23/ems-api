import express from "express";
import {
    adminLogin,
    addCategory,
    addEmployee,
    getAllEmployees,
    getCategories,
    getEmployee,
    updateEmployee,
    adminLogout,
    deleteEmployee
} from "../Controllers/Admin.js";

const router = express.Router();

router
    .post('/login', adminLogin)
    .post('/add-category', addCategory)
    .post('/add-employee', addEmployee)
    .get('/employees', getAllEmployees)
    .get('/categories', getCategories)
    .get('/employee/:id', getEmployee)
    .get('/logout', adminLogout)
    .put('/employee/:id', updateEmployee)
    .delete('/employee/:id', deleteEmployee);
export { router as adminRouter};
