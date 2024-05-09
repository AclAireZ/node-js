const jwt = require('jsonwebtoken');

const authorizationUser = (req, res, next) => {
    try {
        // Extract token from the Authorization header
        const token = req.headers.authorization.split("Bearer ")[1];
        if (!token) {
            throw new Error("Authorization token not provided.");
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        // Check if the user has the 'admin' role
        if (decoded && decoded.role === 'admin'|| decoded && decoded.role === 'user') {
            // If admin, attach the decoded token to the request for further use
            req.auth = decoded;
            next(); // Call the next middleware or route handler
        } else {
            throw new Error("Unauthorized access.");
        }
    } catch (error) {
        return res.status(400).json({
            status: 400,
            message: "Unauthorized access. Admin role required or invalid token."
        });
    }
}

module.exports = authorizationUser;
