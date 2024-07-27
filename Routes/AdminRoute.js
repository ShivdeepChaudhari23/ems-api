import express from "express";

import { adminLogout } from "../Controllers/Admin.js";
import { validatePayload } from "../utils/validations.js";
import { authenticateHeader } from "../utils/authenticate.js";
import { addCategory, deleteCategories, getCategories, updateCategory } from "../Controllers/Category.js";
import { addCategorySchema, createEmployeeSchema, editCategorySchema, editEmployeeSchema } from "../constants/validation-schema.js";
import { addEmployee, deleteEmployee, getAllEmployees, getEmployee, updateEmployee } from "../Controllers/Employee.js";

const router = express.Router();

router.use(authenticateHeader);
router
    .post('/add-category', (req, res, next) => validatePayload(req, res, next, addCategorySchema), addCategory)
    .post('/add-employee', (req, res, next) => validatePayload(req, res, next, createEmployeeSchema), addEmployee)
    .get('/employees', getAllEmployees)
    .get('/categories', getCategories)
    .get('/employee/:id', getEmployee)
    .get('/logout', adminLogout)
    .put('/employee/:id', (req, res, next) => validatePayload(req, res, next, editEmployeeSchema), updateEmployee)
    .put('/categories/:id', (req, res, next) => validatePayload(req, res, next, editCategorySchema), updateCategory)
    .delete('/employee/:id', deleteEmployee)
    .delete('/categories/:id', deleteCategories);
export { router as adminRouter};
