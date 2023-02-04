const fs = require('fs').promises;
const LRU = require('lru-cache');

class BookDao {
    
    constructor() {
        this.booksCache = new LRU({ max: 10 });
        this.path = 'books.json'
    }

    async getAllBooks() {

        try {
            const data = await fs.readFile(this.path, 'utf8');
            const books = JSON.parse(data);
            return books

        } catch (error) {
            console.log(error.message);
            return [];
        }
    }

    async createBook(book) {
        
        try {

            if (!book.code || !book.name || !book.author) {
                throw new Error('No attribute code, name or author specified');
            }

            let books = await this.getAllBooks();
            
            if (books.find(b => b.code == book.code)) {
                throw new Error('DUPLICITE_CODE!');
            }
            books.push(book);
            await fs.writeFile(this.path, JSON.stringify(books), 'utf8');
            this.booksCache.set(book.code, book);
            
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async getBook(code) {

        try {

            let foundBook = this.booksCache.get(code);

            if (!foundBook) {
                let books = await this.getAllBooks();
                foundBook = books.find(b => b.code === code);
                if (!foundBook) {
                    throw new Error('Book with the specified code does not exist');
                }
                this.booksCache.set(code, foundBook);
            }
            return foundBook;

        } catch (error) {
            console.log(error.message)
            throw error;
        }
    }
}

module.exports = BookDao