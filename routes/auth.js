var express = require('express');
var router = express.Router();
var userModel = require('../schemas/user')
var checkvalid = require('../validators/auth')
var { validationResult } = require('express-validator');
var bcrypt = require('bcrypt')
var protect = require('../middlewares/protectLogin')
let sendmail = require('../helpers/sendmail')
let resHandle = require('../helpers/resHandle')
let config = require('../configs/config')

router.post('/changepassword', protect, async function (req, res, next) {
  let result = bcrypt.compareSync(req.body.oldpassword, req.user.password);
  if (result) {
    let user = req.user;
    user.password = req.body.newpassword;
    await user.save();
    resHandle(res, true, "doi pass thanh cong");
  } else {
    resHandle(res, false, "password khong dung");
  }

})



router.post('/forgotpassword', async function (req, res, next) {
  let email = req.body.email;
  let user = await userModel.findOne({ email: email });
  if (!user) {
    resHandle(res, false, "email chua ton tai trong he thong")
    return;
  }
  let token = user.genResetPassword();
  await user.save();
  //let url = `http://localhost:3000/api/v1/auth/resetpassword/${token}`
  //doi link sang form nham passsword
  //link post dc gan vao  button
  try {
    await sendmail(user.email, url);
    resHandle(res, true, "gui mail thanh cong");
  } catch (error) {
    user.tokenResetPasswordExp = undefined;
    user.tokenResetPassword = undefined;
    await user.save();
    resHandle(res, false, error);
  }
});

router.post('/resetpassword/:token', async function (req, res, next) {
  let user = await userModel.findOne({
    tokenResetPassword: req.params.token
  })
  if (!user) {
    resHandle(res, false, "URL khong hop le");
    return;
  }
  if (user.tokenResetPasswordExp > Date.now()) {
    user.password = req.body.password;
    user.tokenResetPasswordExp = undefined;
    user.tokenResetPassword = undefined;
    await user.save();
    resHandle(res, true, "doi mat khau thanh cong");
  } else {
    resHandle(res, false, "URL khong hop le");
    return;
  }

});


router.post('/register', checkvalid(), async function (req, res, next) {
  var result = validationResult(req);
  if (result.errors.length > 0) {
    res.status(404).send(result.errors);
    return;
  }
  try {
    var newUser = new userModel({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      role: ["USER"]
    })
    await newUser.save();
    res.status(200).send({
      success: true,
      data: newUser
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      data: error
    });
  }
});
router.post('/login', async function (req, res, next) {
  let password = req.body.password;
  let username = req.body.username;
  if (!password || !username) {
    resHandle(res, false, "username va password khong duoc de trong");
    return;
  }
  var user = await userModel.findOne({ username: username });
  if (!user) {
    resHandle(res, false, "username khong ton tai");
    return;
  }
  let result = bcrypt.compareSync(password, user.password);
  if (result) {
    var tokenUser = user.genJWT();
    res.status(200).cookie('token', tokenUser, {
      expires: new Date(Date.now() + config.COOKIES_EXP_HOUR * 3600 * 1000),
      httpOnly: true
    }).send({
      success: false,
      data: tokenUser
    })
  } else {
    resHandle(res, false, "password sai");
  }
});
router.get('/me', protect, async function (req, res, next) {
  resHandle(res, true, req.user);
});
router.post('/logout', async function (req, res, next) {
  resHandle(res, true, "dang xuat thanh cong");
});


module.exports = router;