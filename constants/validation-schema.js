import Joi from "joi";

const loginSchema = Joi.object({
    username: Joi.string().email().min(3).max(40).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+]{3,30}$')).required(),
});

const createEmployeeSchema = Joi.object({
    firstName: Joi.string().max(50).required(),
    lastName: Joi.string().max(100).required(),
    address: Joi.string().min(5).max(150),
    salary: Joi.number().required(),
    emailAddress: Joi.string().email().min(3).max(30).required(),
    pincode: Joi.number().required(),
    joiningDate: Joi.number().required(),
    imageUrl: Joi.string().max(512),
    categoryId: Joi.number().required(),
});

const editEmployeeSchema = Joi.object({
    firstName: Joi.string().min(5).max(50),
    lastName: Joi.string().min(5).max(100),
    address: Joi.string().min(5).max(150),
    salary: Joi.number(),
    emailAddress: Joi.string().email().min(3).max(30),
    pincode: Joi.number(),
    joiningDate: Joi.number(),
    imageUrl: Joi.string().max(512),
    categoryId: Joi.number(),
});

const addCategorySchema = Joi.object({
    category: Joi.string().min(5).max(30).required(), 
    description: Joi.string().min(5).max(150),
});

const editCategorySchema = Joi.object({
    name: Joi.string().min(5).max(30), 
    description: Joi.string().min(0).max(150),
});

export {
    addCategorySchema,
    createEmployeeSchema,
    editEmployeeSchema,
    loginSchema,
    editCategorySchema,
};
