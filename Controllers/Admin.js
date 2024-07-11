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
                    error: 'Password did not match'
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

const addCategory = async (req, res) => {
    const query = "INSERT INTO category (`name`) VALUE (?)";
    try {
        const result = await con.query(query, [req.body.category]);
        if (result[0].insertId) {
            return res.json({message: 'Category added successfully'})
        } else {
            res.status(500);
            return res.json({message: "Something went wrong. Pleas try again later",})
        }
    } catch (e) {
        res.status(500);
        return res.json({
            status: 'Failed',
            error: e,
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
            res.status(400);
            return res.json({error: "Something went wrong. Pleas try again later"});
        }
    } catch (e) {
        if (e.code && e.code === 'ER_DUP_ENTRY') {
            res.status(409)
            return res.json({error: 'Employee with this name or email id already exists'});
        }
        res.status(500);
        return res.json({error: e});
    }
};

const getAllEmployees = async (req, res) => {
    try {
        const sql = 'SELECT name, email, address, salary, category_id FROM employees';
        const [results] = await con.query(sql);
        if (results.length > 0) {
            return res.json({results})
        } else {
            return res.json({ results: []})
        }
    } catch (e) {
        res.status(500);
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
            return res.json({results});
        } else {
            res.status(400);
            return res.json({error: 'No Categories to Display'});
        }
    } catch (e) {
        res.status(500);
        return res.json({error: 'Try again after some time'});
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
            res.status(404);
            return res.json({error: "Employee doesn't Exist"});
        }
    } catch (e) {
        res.status(500);
        return res.json({error: "Something went wrong. Please try again later"});
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
            return res.json({message: "Record edited successfully"});
        } else {
            res.status(500);
            return res.json({error: "Employee not edited. Please try again"});
        }
    } catch (e) {
        res.status(500);
        return res.json({error: 'Please try again later'});
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
            res.status(500);
            return res.json({error: 'Failed to delete',})
        }
    } catch (e) {
        res.status(500);
        return res.json({error: e});
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
