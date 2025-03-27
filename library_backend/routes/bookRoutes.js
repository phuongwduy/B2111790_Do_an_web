const express = require('express');
const bookController = require('../controllers/bookController.js');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
    .get(authMiddleware, bookController.getAllBooks)  
    .post(bookController.addBook)  
    .delete(bookController.deleteAllBooks); 

router.route('/:id')
    .get(bookController.getBookById)
    .put(bookController.updateBook) 
    .delete(bookController.deleteBook);  

module.exports = router;

