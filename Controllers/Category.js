import con from "../utils/db.js";

const addCategory = async (req, res) => {
    const query = "INSERT INTO category (`name`, `description`) VALUE (?, ?)";
    try {
        const result = await con.query(query, [req.body.category, req.body.description]);
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

const deleteCategories = async (req, res) => {
    const { id: categoryId } = req.params;
    try {
        const sql = 'DELETE FROM category WHERE id = ?';
        const [results] = await con.query(sql, [categoryId]);

        if (results.affectedRows > 0) {
            return res.json({
                status: 'Success',
                message: 'Category Deleted',
            })
        } else {
            res.status(500);
            return res.json({error: 'Failed to delete',})
        }
    } catch (e) {
        res.status(500);
        return res.json({error: e});
    }
}

const updateCategory = async (req, res) => {
    try {
        const { id: employeeId } = req.params;
        const fields = [];
        const values = [];

        for (const [key, value] of Object.entries(req.body)) {
            fields.push(`${key} = ?`);
            values.push(value);
        }

        const sql = `UPDATE category SET ${fields.join(', ')} WHERE id = ?`;
        values.push(employeeId);

        const [results] = await con.query(sql, values);
        if (results.affectedRows > 0) {
            return res.json({message: "Record edited successfully"});
        } else {
            res.status(500);
            return res.json({error: "Category not edited. Please try again"});
        }
    } catch (e) {
        res.status(500);
        return res.json({error: 'Please try again later'});
    }
};


export { addCategory, getCategories, deleteCategories, updateCategory };
