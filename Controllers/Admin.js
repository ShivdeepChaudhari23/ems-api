import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import { configDotenv } from "dotenv";

configDotenv();
const adminLogin = async (req, res) => {
    const query = "SELECT * FROM admin WHERE email = ? AND password = ?";
    try {

        const [result, fields] = await con.query(query, [req.body.username, req.body.password]);
        if (result.length > 0) {
            const user = result[0];
            const email = user.email;
            const token = jwt.sign({ role: "admin", email }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.TOKEN_SPAN});
            res.cookie('token', token);

            return res.json({
                loginStatus: true,
            });
        } else {
            return res.json({
                loginStatus: false,
                error: "User not found. Please check credentials.",
            });
        }
    } catch (e) {
        return res.json({
            loginStatus: false,
            error: "Query Error",
        });
    }
};

const addCategory = async (req, res) => {
    const query = "INSERT INTO category (`name`) VALUE (?)";
    try {
        const result = await con.query(query, [req.body.category]);
        if (result[0].insertId) {
            return res.json({
                status: 'Success',
                message: 'Category added successfully'
            })
        } else {
            return res.json({
                status: 'Failed',
                message: "Something went wrong. Pleas try again later",
            })
        }
    } catch (e) {
        return res.json({
            status: 'Failed',
            error: 'Error in Creating Category',
        });
    }
};

const addEmployee = async (req, res) => {
    try { 
        const { name, email, password, address, salary, categoryId } = req.body;
        const query = 'INSERT INTO employees \
            (`name`, `email`, `password`, `address`, `salary`, `category_id`) \
            VALUES (?, ?, ?, ?, ?, ?)';
        const passwordHash = await bcrypt.hash(password, 10);
        const results = await con.query(query, [name, email, passwordHash, address, salary, categoryId]);
        if (results[0].insertId) {
            return res.json({
                status: 'Success',
                message: 'Employee added successfully'
            })
        } else {
            return res.json({
                status: 'Failed',
                message: "Something went wrong. Pleas try again later",
            })
        }
    } catch (e) {
        return res.json({
            status: 'Failed',
            error: 'Error in Adding employee',
        });
    }
};

const getAllEmployees = async (req, res) => {
    try {
        const sql = 'SELECT name, email, address, salary, category_id FROM employees';
        const [results] = await con.query(sql);
        if (results.length > 0) {
            return res.json({
                status: 'Success',
                result: results,
            })
        } else {
            return res.json({
                status: 'Failed',
                message: 'No Employees to Display',
            })
        }
    } catch (e) {
        return res.json({
            status: 'Failed',
            message: 'Try again after some time'
        })
    }
};

const getCategories = async (req, res) => {
    try {
        const sql = 'SELECT * FROM category';
        const [results] = await con.query(sql);
        if (results.length > 0) {
            return res.json({
                status: 'Success',
                result: results,
            })
        } else {
            return res.json({
                status: 'Failed',
                message: 'No Categories to Display',
            })
        }
    } catch (e) {
        return res.json({
            status: 'Failed',
            message: 'Try again after some time'
        })
    }
};

const getEmployee = async (req, res) => {
    try {
        const { id: employeeId } = req.params;
        const sql = 'SELECT name, email, address, salary, category_id from employees WHERE id = ?';
        const [result] = await con.query(sql, [employeeId]);
        if (result.length > 0) {
            return res.json({
                status: 'Success',
                data: result[0],
            })
        } else {
            return res.json({
                status: 'Failed',
                error: "Employee doesn't Exist",
            })
        }
    } catch (e) {
        return res.json({
            status: 'Failed',
            error: "Something went wrong. Please try again later",
        })
    }
};

const updateEmployee = async (req, res) => {
    try {
        const { id: employeeId } = req.params;
        const fields = [];
        const values = [];

        for (const [key, value] of Object.entries(req.body)) {
            fields.push(`${key} = ?`);
            values.push(value);
        }

        const sql = `UPDATE employees SET ${fields.join(', ')} WHERE id = ?`;
        values.push(employeeId);

        const [results] = await con.query(sql, values);
        if (results.affectedRows > 0) {
            return res.json({
                status: "Success",
                message: "Record edited successfully",
            });
        } else {
            return res.json({
                status: "Failed",
                message: "Employee not edited. Please try again",
            });
        }
    } catch (e) {
        return res.json({
            status: 'Failed',
            message: 'Please try again later'
        });
    }
};

const deleteEmployee = async (req, res) => {
    try {
        const { id: employeeId } = req.params;

        const sql = "DELETE FROM employees WHERE id = ?";

        const [results] = await con.query(sql, [employeeId]);

        if (results.affectedRows > 0) {
            return res.json({
                status: 'Success',
                message: 'Employee Deleted',
            })
        } else {
            return res.json({
                status: 'Failed',
                message: 'Failed to delete',
            })
        }
    } catch (e) {
        return res.json({
            status: 'Failed',
            message: 'Failed to delete',
            error: e,
        });
    }
};

const adminLogout = async (req, res) => {
    res.clearCookie('token');
    return res.json({
        status: 'Success'
    });
};

export {
    adminLogin,
    adminLogout,
    addCategory,
    addEmployee,
    getAllEmployees,
    getCategories,
    getEmployee,
    updateEmployee,
    deleteEmployee
};
