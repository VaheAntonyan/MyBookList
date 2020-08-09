/*jshint esversion: 6 */
class BookService {
    static stringOfBooks = `[
    {
        "id": 1,
        "title": "White Fang",
        "authorId": 1,
        "pageCount": 500,
        "read": 2019
    },
    {
        "id": 2,
        "title": "The Call of the Wild",
        "authorId": 1,
        "pageCount": 356,
        "read": 2018
    },
    {
        "id": 3,
        "title": "Martin Eden",
        "authorId": 1,
        "pageCount": 356,
        "read": 2019
    },
    {
        "id": 4,
        "title": "The Old Man and The Sea",
        "authorId": 2,
        "pageCount": 300,
        "read": 2018
    },
    {
        "id": 5,
        "title": "For Whom the Bell Tolls",
        "authorId": 2,
        "pageCount": 356,
        "read": 2019
    },
    {
        "id": 6,
        "title": "Adventures of Huckleberry Finn",
        "authorId": 3,
        "pageCount": 650,
        "read": 2017
    },
    {
        "id": 7,
        "title": "The Adventures of Tom Sawyer",
        "authorId": 3,
        "pageCount": 500,
        "read": 2017
    },
    {
        "id": 8,
        "title": "Oliver Twist",
        "authorId": 4,
        "pageCount": 630,
        "read": 2017
    },
    {
        "id": 9,
        "title": "Great Expectations",
        "authorId": 4,
        "pageCount": 250,
        "read": 2019
    },
    {
        "id": 10,
        "title": "Little Dorrit",
        "authorId": 4,
        "pageCount": 654,
        "read": 2018
    }]`;

    static getBooks() {
        return Promise.resolve(JSON.parse(this.stringOfBooks).map((book) => Book.fromJson(book)));
    }
}

// BookService.getBooks().then((books) => {books.forEach(book => book.print());});