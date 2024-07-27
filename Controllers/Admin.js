import con from "../utils/db.js";
import bcrypt from 'bcrypt';

const adminLogout = async (req, res) => {
    res.clearCookie('token');
    return res.json({
        status: 'Success'
    });
};

export { adminLogout };
