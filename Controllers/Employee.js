import con from "../utils/db.js";
import { transformDateTimeForDb } from "../utils/helpers.js";

const addEmployee = async (req, res) => {
    try { 
        const payload = req.body;
        const fieldNames = [];
        const values = [];

        for (const [key, value] of Object.entries(payload)) {
            fieldNames.push(key);
            values.push(key === 'joiningDate' ? transformDateTimeForDb(value) : value);
        }
        let valueVariables = `(`;
        values.forEach((item, index) => {
            if (index === values.length - 1) {
                valueVariables += '?)';
            } else {
                valueVariables += '?, ';
            }
        });
        const query = `INSERT INTO employees (${fieldNames.join(', ')}) value ${valueVariables}`;

        const results = await con.query(query, values);
        if (results[0].insertId) {
            return res.json({
                status: 'Success',
                message: 'Employee added successfully'
            })
        } else {
            res.status(400);
            return res.json({error: "Something went wrong. Please try again later"});
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
        const sql = 'SELECT e.*, ct.name as categoryName FROM employees e JOIN category ct ON e.categoryId = ct.id';
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
        const sql = 'SELECT * from employees WHERE id = ?';
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

export { getAllEmployees, getEmployee, addEmployee, updateEmployee, deleteEmployee };