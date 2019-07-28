const express = require('express');
const router = express.Router();
const Book = require('../models').Book;
/* GET home page. */
router.get('/', (req, res, next) => {
  res.redirect('/books')
});

/* GET book page. */
router.get('/books', (req, res, next) => {
  Book.findAll({order: [["createdAt", "DESC"]]}).then((books) => {
    res.render('index', { books, title:'Book' });
  })
  
});

/* GET book new */
router.get('/books/new', (req, res, next) => {
  
});

/* POST book new */
router.post('/books/new', (req, res, next) => {
  
});


/* GET book id */
router.get('/books/:id', (req, res, next) => {
  
});


/* post book id */
router.post('/books/:id', (req, res, next) => {
  
});

/* post book id delete*/
router.post('/books/:id/delete', (req, res, next) => {
  
});
module.exports = router;
