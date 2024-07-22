import con from "../utils/db.js";
import bcrypt from 'bcrypt';

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
    adminLogout,
    addEmployee,
    getAllEmployees,
    getEmployee,
    updateEmployee,
    deleteEmployee
};
