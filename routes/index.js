var express = require('express');
var router = express.Router();

//localhost:3000/api/v1
//->localhost:3000/api/v1/books
router.use('/books',require('./books'));
//->localhost:3000/api/v1/users
router.use('/users',require('./users'));
router.use('/auth',require('./auth'));
router.use('/authors',require('./authors'));
module.exports = router;
