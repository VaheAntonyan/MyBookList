/*jshint esversion: 6 */
class AuthorService {
    static stringOfAuthors = `[
  {
    "id": 1,
    "firstName": "Jack",
    "lastName": "London",
    "birthDate": -2965431480000 
  },
  {
    "id": 2,
    "firstName": "Ernest",
    "lastName": "Hemingway",
    "birthDate": -2223169080000
  },
  {
    "id": 3,
    "firstName": "Mark",
    "lastName": "Twain",
    "birthDate": -4231450680000
  },
  {
    "id": 4,
    "firstName": "Charles",
    "lastName": "Dickens",
    "birthDate": -4982871480000
  }
]`;

    static getAuthors() {
        return Promise.resolve(JSON.parse(this.stringOfAuthors).map((author) => Author.fromJson(author)));
    }
}

// AuthorService.getAuthors().then((authors) => {authors.forEach(author => author.print())});
