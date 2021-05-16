export const AccessControl = function (role) {
    return function (req, res, next) {
        if (role != req.user.rol) {
            return res.status(400).json({
                status: "false",
                message: "You don't have permission to access this resource.",
            });
        }

        next();
    };
};
