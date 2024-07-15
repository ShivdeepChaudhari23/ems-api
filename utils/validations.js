import { addCategorySchema, createEmployeeSchema, editEmployeeSchema, loginSchema } from "../constants/validation-schema.js";

const validateCreateUserPayload = (req, res, next) => {
    const { error } = createEmployeeSchema.validate(req.body);

    if (error && error.details.length > 0) {
        res.status(400);
        return res.json({
            error: error.details[0].message
        });
    }

    next();
};

const validateEditUserPayload = (req, res, next) => {
    const { error } = editEmployeeSchema.validate(req.body);

    if (error && error.details.length > 0) {
        return res.json({
            error: error.details[0].message
        });
    }
}

const validateAddCategoryPayload = (req, res, next) => {

    const { error } = addCategorySchema.validate(req.body);

    if (error && error.details.length > 0) {
        return res.json({
            error: error.details[0].message
        });
    }

    next();
}

const validateLoginPayload = (req, res, next) => {
    const { error } = loginSchema.validate(req.body);
    if (error && error.details.length > 0) {
        res.status(400);
        return res.json({
            error: error.details[0].message,
        })
    }
    next();
};

export {
    validateAddCategoryPayload,
    validateEditUserPayload,
    validateCreateUserPayload,
    validateLoginPayload,
};