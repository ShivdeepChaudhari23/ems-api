const validatePayload = (req, res, next, schema) => {
    const { error } = schema.validate(req.body);
    if (error && error.details.length > 0) {
        res.status(400);
        return res.json({
            error: error.details[0].message,
        })
    }
    next();
}

export { validatePayload };