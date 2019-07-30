const express = require('express');
const router = express.Router();
const Book = require('../models').Book;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
/* GET home page. */
router.get('/', (req, res, next) => {
  res.redirect('/books')
});

/* GET book page. */
router.get('/books', (req, res, next) => {
  Book.findAll({order: [["createdAt", "DESC"]]}).then((books) => {
    res.render('index', { books, title:'Books'});
  })
  
});

/* GET book new */
router.get('/books/new', (req, res, next) => {
  res.render('new-book', {book: Book.build()})
});

/* POST book new */
router.post('/books/new', (req, res, next) => {
  Book.create({
    title: req.body.title, 
    author: req.body.author,
    genre: req.body.genre,
    year: req.body.year
  }).then(() => {
    res.redirect('/books')
  }).catch((err) => {
    if(err.name === 'SequelizeValidationError'){
      res.render('new-book', {
        book: Book.build,
        errors: err.errors
      })
    } else {
      throw err;
    }
  }).catch((err) => {
    res.send(500)
  })
});


/* GET book id */
router.get('/books/:id', (req, res, next) => {
  Book.findByPk(req.params.id).then((book) => {
    res.render('update-book',{book})
  })
});


/* post book id */
router.post('/books/:id', (req, res, next) => {
  Book.update({
    title: req.body.title, 
    author: req.body.author,
    genre: req.body.genre,
    year: req.body.year
  }, {
    where: {id: req.params.id}
  }).then(() => {
    res.redirect('/books')
  }).catch((err) => {
    if(err.name === 'SequelizeValidationError'){
      const book = Book.build(req.body);
      book.id = req.params.id;
      res.render('new-book', {
        book: book,
        errors: err.errors
      })
    } else {
      throw err;
    }
  }).catch((err) => {
    res.send(500)
  })
});

/* post book id delete*/
router.post('/books/:id/delete', (req, res, next) => {
  Book.destroy({where: {id: req.params.id}}).then(() => {
    res.redirect('/books')
  })
});

/* post book id search*/
//inspried by this video @Traversy Media

/*https://www.youtube.com/watch?v=6jbrWF3BWM0*/

router.get('/search', (req, res, next) => {
  const term = req.query.term;
  Book.findAll({
    where: {
      [Op.or]:[
        {title: {
          [Op.like] : '%' + term + '%'
        }},
        {author: {
          [Op.like] : '%' + term + '%'
        }},
        {genre: {
          [Op.like] : '%' + term + '%'
        }},
        {year: {
          [Op.like] : '%' + term + '%'
        }}
      ]
    }
  }).then((books) => {
    res.render('index', {books})
  })
});

module.exports = router;
