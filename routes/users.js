var express = require('express');
var router = express.Router();
var userModel = require('../schemas/user')
var checkvalid = require('../validators/user')
var { validationResult } = require('express-validator');
var protectLogin = require('../middlewares/protectLogin')
var protectRole = require('../middlewares/protectRole')
require('express-async-errors')

router.get('/', protectLogin, protectRole("ADMIN", "MODIFIER"), async function (req, res, next) {
  let users = await userModel.find({}).exec();
  res.status(200).send(users);
});

router.get('/:id', async function (req, res, next) {
  try {
    let user = await userModel.find({ _id: req.params.id }).exec();
    res.status(200).send(user);
  } catch (error) {
    res.status(404).send(error);
  }
});

router.post('/', checkvalid(), protectLogin, protectRole("ADMIN"), async function (req, res, next) {
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
      role: req.body.role
    })
    await newUser.save();
    res.status(200).send({
      success: true,
      data: newUser
    });
    throw new Error("heheehehehe")
  } catch (error) {
    res.status(404).send({
      success: false,
      data: error
    });
  }
});
router.put('/:id', async function (req, res, next) {
  try {
    let user = await userModel.findByIdAndUpdate
      (req.params.id, req.body).exec()
    res.status(404).send(user);
  } catch (error) {
    res.status(404).send(error);
  }
});


router.delete('/:id', async function (req, res, next) {
  try {
    let user = await userModel.findByIdAndUpdate
      (req.params.id, {
        status: false
      }, {
        new: true
      }).exec()
    res.status(200).send(user);
  } catch (error) {
    res.status(404).send(error);
  }
});

module.exports = router;