var { check } = require('express-validator');
var util = require('util');
let options = {
    password: {
        minLength: 8,
        minNumbers: 1,
        minSymbols: 1,
        minLowercase: 1,
        minUppercase: 1
    },
    username: {
        max: 40,
        min: 8
    }
}
let notifies = {
    NOTI_USERNAME: 'User name phai dai tu %d ki tu den %d ki tu',
    NOTE_PASSWORD: 'password phai dai toi thieu %d ki tu, trong do co it nhat %d ki tu so, %d ki tu thuong, %d ki tu in hoa, %d ki tu dac biet',
    NOTE_EMAIL: 'email phai dung dinh dang'
}

module.exports = function () {
    return [
        check('email', notifies.NOTE_EMAIL).isEmail(),
        check('password', util.format(notifies.NOTE_PASSWORD, options.password.minLength, options.password.minNumbers, options.password.minLowercase, options.password.minUppercase, options.password.minSymbols)).isStrongPassword(options.password),
        check('username', util.format(notifies.NOTI_USERNAME, options.username.min, options.username.max)).isLength(options.username)
    ]
}