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
import { validateAddCategoryPayload, validateCreateUserPayload, validateEditUserPayload } from "../utils/validations.js";
import { authenticateHeader } from "../utils/authenticate.js";

const router = express.Router();

router.use(authenticateHeader);
router
    .post('/add-category', validateAddCategoryPayload, addCategory)
    .post('/add-employee', validateCreateUserPayload, addEmployee)
    .get('/employees', getAllEmployees)
    .get('/categories', getCategories)
    .get('/employee/:id', getEmployee)
    .get('/logout', adminLogout)
    .put('/employee/:id', validateEditUserPayload, updateEmployee)
    .delete('/employee/:id', deleteEmployee);

export { router as adminRouter};
