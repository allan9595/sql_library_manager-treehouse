const express = require('express');
const router = express.Router();
const Book = require('../models').Book;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
let page = 0; 
let count = 0;

/* GET home page. */
router.get('/', (req, res, next) => {
  res.redirect('/books/page/0')
});

/* GET book page. */
router.get('/books/page/:page', (req, res, next) => {
  if(req.params.page == -1){
    res.redirect('/books/page/0') //if the page goes to negative value, redirect to first page
  }
  else{
    if(count > req.params.page){
      count -=1; //correct page refresh error
    } 

    if(count < req.params.page){
      count +=1 //correct page refresh error
    }
    Book.findAll({
      order: [["createdAt", "DESC"]],
      limit: 5, //limit to 5 items
      offset: req.params.page * 5 //skip 5 more items each time 
    }).then((books) => {
      if(books.length ===0){
        res.render('page-not-found'); // if nothing returned or exceeding the page number, render no found and reset the count
        count = 0;
      }else {
        res.render('index', { 
          page: page+count, 
          pagePrevious: ((page+count)-2),
          books, 
          title:'Books'
        });
      }
    }).catch((err) => {
      if(err.name ==='SequelizeDatabaseError'){
        res.render('page-not-found');
        count = 0;
      }
    })
    
      count += 1; //every time after the render, increase the count by 1 
      if((count - req.params.page) === 2){
        count -= 1; //coreect the page counting issue 
      }
    }
  });

  /* GET book new */
  router.get('/books/new', (req, res, next) => {
    res.render('new-book', {book: Book.build()}) //passing a model instance to the form for later submission
  });

  /* POST book new */
  router.post('/books/new', (req, res, next) => {
    Book.create({
      title: req.body.title, 
      author: req.body.author,
      genre: req.body.genre,
      year: req.body.year
    }).then(() => {
      res.redirect('/books/page/0')
    }).catch((err) => {
      // error handling
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
    res.render('update-book',{book}) //rendering update the app
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
    where: {id: req.params.id} //find the book
  }).then(() => {
    res.redirect('/books/page/0')
  }).catch((err) => {
    if(err.name === 'SequelizeValidationError'){
      const book = Book.build(req.body); //get an instance of the modal
      book.id = req.params.id; //get the correct id
      res.render('new-book', {
        book: book, //pass it to the new book to show in the form
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
    res.redirect('/books/page/0')
  })
});

/* get book search*/
//inspried by this video @Traversy Media

/*https://www.youtube.com/watch?v=6jbrWF3BWM0*/

router.get('/search', (req, res, next) => {
  //search the items
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
