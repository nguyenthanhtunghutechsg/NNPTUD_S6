module.exports = function (...roles) {
    return function (req, res, next) {
        let requiredRoles = roles.map(e => e.toLowerCase());
        let userRoles = req.user.role.map(e => e.toLowerCase()); // ["USER"];
        let result = requiredRoles.filter(e => userRoles.includes(e));
        if (result.length > 0) {
            next();
        } else {
            res.status(403).send("ban khong co quyen");
        }
    }
}