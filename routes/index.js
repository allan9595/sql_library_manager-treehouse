const express = require('express');
const router = express.Router();
const Book = require('../models').Book;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
let page = 0; 
let count = 0;

/* GET home page. */
router.get('/', (req, res, next) => {
  res.redirect('/books/0')
});

/* GET book page. */
router.get('/books/:page', (req, res, next) => {
  console.log(req.params.page)
  if(req.params.page == -1){
    res.redirect('/books/0')
  }else{
  if(count > req.params.page){
    count -=1; //correct page refresh error
  } 

  if(count < req.params.page){
    count +=1 //correct page refresh error
  }
  Book.findAll({
    order: [["createdAt", "DESC"]],
    limit: 5,
    offset: req.params.page * 5
  }).then((books) => {
    if(books.length ===0){
      res.render('page-not-found')
    }else {
      res.render('index', { 
        page: page+count, 
        pagePrevious: ((page+count)-2),
        books, 
        title:'Books'
      });
      console.log(books)
    }
  })
    console.log(req.params.page);
    console.log(count);
    count += 1;
    console.log(count);
    if((count - req.params.page) === 2){
      count -= 1; //coreect the page counting issue 
    }
  }
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

/* get book search*/
//inspried by this video @Traversy Media

/*https://www.youtube.com/watch?v=6jbrWF3BWM0*/

router.get('/search', (req, res, next) => {
  const term = req.query.term;
  Book.findAll({
    order: [["createdAt", "DESC"]],
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
    res.render(
      'index', 
    {
      books,
      search: true
    })
  })
});



module.exports = router;
