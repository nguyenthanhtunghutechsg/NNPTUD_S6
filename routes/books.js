
var express = require('express');
var router = express.Router();
var bookModel = require('../schemas/book')
var resHandle = require('../helpers/resHandle');
const book = require('../schemas/book');
const validationError = require('../Errors/validationError')
require('express-async-errors')


/*
Viết mã nguồn để thực hiện chuôi query với yêu cầu như sau
ngoại trừ các thuộc tính như sort,page,limit 
thì các trường còn lại sẽ check contain
*/
router.get('/', async function (req, res, next) {
    let queries = {};
    let exclude = ["sort", "page", "limit"];
    let stringArray = ["name", "author"];
    let numberArray = ["year"]
    for (const [key, value] of Object.entries(req.query)) {
        if (!exclude.includes(key)) {
            if (stringArray.includes(key)) {
                queries[key] = new RegExp(value.replace(',', '|'), 'i');
            }
            if (numberArray.includes(key)) {
                let string = JSON.stringify(value);
                let index = string.search(new RegExp('lte|lt|gte|gt', 'g'));
                if (index < 0) {
                    queries[key] = value;
                } else {
                    queries[key] = JSON.parse(string.replaceAll(new RegExp('lte|lt|gte|gt', 'g'), (res) => '$' + res));
                }
            }
        }
    }
    queries.isDeleted = false;
    let limit = req.query.limit ? req.query.limit : 5;
    let page = req.query.page ? req.query.page : 1;
    let sort = {};
    if (req.query.sort) {
        if (req.query.sort.startsWith('-')) {
            sort[req.query.sort.substring(1, req.query.sort.length)] = -1;
        } else {
            sort[req.query.sort] = 1;
        }
    }
    var books = await bookModel.find(
        queries).populate({ path: 'author', select: "_id name" }).lean()
        .skip((page - 1) * limit)
        .limit(limit)
        .sort(sort)
        .exec();
    resHandle(res, true, books);

});

router.get('/:id', async function (req, res, next) {
    throw new validationError("heheehehehe")
    // let book = await bookModel.find({ _id: req.params.id }).exec();
    // resHandle(res, true, book);
});

router.post('/', async function (req, res, next) {
    try {
        var newBook = new bookModel({
            name: req.body.name,
            year: req.body.year,
            author: req.body.author
        })
        await newBook.save();
        resHandle(res, true, newBook);
    } catch (error) {
        resHandle(res, false, error);
    }
});

router.put('/:id', async function (req, res, next) {
    try {
        var book = await bookModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });
        resHandle(res, true, book);
    } catch (error) {
        resHandle(res, false, error);
    }

});

router.delete('/:id', async function (req, res, next) {
    try {
        var book = await bookModel.findByIdAndUpdate(req.params.id,
            { isDeleted: true }, {
            new: true
        });
        resHandle(res, true, book);
    } catch (error) {
        resHandle(res, false, error);
    }
});

module.exports = router;