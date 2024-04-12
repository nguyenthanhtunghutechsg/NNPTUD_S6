var jwt = require('jsonwebtoken')
var userModel = require('../schemas/user')
var resHand = require('../helpers/resHandle');
const config = require('../configs/config');

module.exports = async function (req, res, next) {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else {
        if (req.cookies.token) {
            token = req.cookies.token;
        }
    }
    if (!token) {
        resHand(res, false, "vui long dang nhap");
    }
    try {
        let info = jwt.verify(token, config.JWT_SECRETKEY)
        if (info.exp * 1000 > Date.now()) {
            let id = info.id;
            let user = await userModel.findById(id);
            req.user = user
            next();
        } else {
            resHand(res, false, "vui long dang nhap");
        }
    } catch (error) {
        resHand(res, false, "vui long dang nhap");
    }
}