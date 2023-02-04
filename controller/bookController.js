const express = require('express');
const BookDao  = require('../library-dao');
const router = express.Router();

const bookDao = new BookDao(); 

router.get('/book', async (req, res) => {
    try {
        let code = req.query.code;
        let book = await bookDao.getBook(code);
        res.send(book);
    } catch (error) {
        if (error.message === 'Code attribute not assigned') {
            res.status(400).send({ error: error.message });
        } else if (error.message === 'Book with the specified code does not exist') {
            res.status(400).send({ error: error.message });
        } else {
            res.status(500).send({ error: 'Unexpected error' });
        }
    }
});

router.post('/book', async (req, res) => {
    try {
        let book = req.body;
        await bookDao.createBook(book);
        res.send({ message: 'Book created' });
    } catch (error) {
        if (error.message === 'No attribute code, name or author specified') {
            res.status(400).send({ error:error.message });
        } else if (error.message === 'DUPLICATE_CODE') {
            res.status(400).send({ error: error.message });
        } else {
            res.status(500).send({ error: 'Unexpected error' });
        }
    }
});

module.exports = router