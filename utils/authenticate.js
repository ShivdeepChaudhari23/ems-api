import jwt from "jsonwebtoken";

export const authenticateHeader = (req, res, next) => {
    const authorizationHeader = req.headers.authorization || '';
    const authToken = authorizationHeader.split(' ')[1];
    if (!authToken) {
        res.status(401);
        return res.json({
            error: 'Unauthorized request',
        });
    }

    const authData = jwt.decode(authToken, { complete: true });

    if (!authData) {
        res.status(401);
        return res.json({
            error: 'Invalid Token',
        });
    }

    const tokenExpiry = authData.payload.exp;

    if ((tokenExpiry * 1000) < Date.now()) {
        res.status(401);
        return res.json({
            error: 'Token Expired',
        });
    }

    next();
};
