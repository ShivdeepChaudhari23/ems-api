import Joi from "joi";

const loginSchema = Joi.object({
    username: Joi.string().email().min(3).max(40).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+]{3,30}$')).required(),
});

const createEmployeeSchema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().email().min(3).max(30).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+]{3,30}$')).required(),
    address: Joi.string().min(10).max(100).required(),
    salary: Joi.number().required(),
    categoryId: Joi.number(),
});

const editEmployeeSchema = Joi.object({
    name: Joi.string().min(5).max(50),
    email: Joi.string().email().min(3).max(30),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+]{3,30}$')),
    address: Joi.string().min(10).max(100),
    salary: Joi.number(),
    categoryId: Joi.number(),
});

const addCategorySchema = Joi.object({
    category: Joi.string().min(5).max(30).required(), 
    description: Joi.string().min(5).max(150),
});

export {
    addCategorySchema,
    createEmployeeSchema,
    editEmployeeSchema,
    loginSchema,
};
