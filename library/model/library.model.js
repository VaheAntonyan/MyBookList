/*jshint esversion: 6 */
const SortingType = Object.freeze({
    ASC: 1,
    DESC: -1,
    NO: 0
});

const FilterType = Object.freeze({
    '>=': '>=',
    '<=': '<=',
    '==': '=='
});

class Library {
    static sortBooksByTitle(books, sortType) {
        return sortType === SortingType.NO ? books : books.sort((a, b) => Library.sortingBySortType(a.title, b.title, sortType));
    }

    static sortBooksByPageCount(books, sortType) {
        return sortType === SortingType.NO ? books : books.sort((a, b) => Library.sortingBySortType(a.pageCount, b.pageCount, sortType));
    }

    static sortBooksByReadOn(books, sortType) {
        return sortType === SortingType.NO ? books : books.sort((a, b) => Library.sortingBySortType(a.read, b.read, sortType));
    }

    static sortBooksByAuthorFullName(books, authors, sortType) {
        if (sortType === SortingType.NO) {
            return books;
        }

        const bookIdAuthorFullNameMap = Library.getBookIdAuthorFullNameMap(books, authors);

        books.sort((book1, book2) => Library.sortingBySortType(
            bookIdAuthorFullNameMap.get(book1.id), 
            bookIdAuthorFullNameMap.get(book2.id), 
            sortType
        ));

        return books;
        
        // // Not readable :)
        // 
        // return sortType === SortingType.NO ? books : (function (bookIdAuthorFullNameMap) {
        //     books.sort((book1, book2) => Library.sortingBySortType(
        //         bookIdAuthorFullNameMap.get(book1.id), 
        //         bookIdAuthorFullNameMap.get(book2.id), 
        //         sortType
        //     ));
        // })(Library.getBookIdAuthorFullNameMap(books, authors));
    }

    static sortAuthorsByFullName(authors, sortType) {
        return sortType === SortingType.NO ? authors : authors.sort((a, b) => Library.sortingBySortType(a.getFullName(), b.getFullName(), sortType));
    }

    static sortAuthorsByBirthDate(authors, sortType) {
        return sortType === SortingType.NO ? authors : authors.sort((a, b) => Library.sortingBySortType(a.birthDate, b.birthDate, sortType));
    }

    static filterBooksByAuthorId(books, authorId) {
        return books.filter((book) => { return book.authorId === authorId; });
    }

    static filterBooksByReadOn(books, read) {
        return books.filter((book) => { return book.read === read; });
    }

    static filterBooksByPageCount(books, pageCount, filterType) {
        return books.filter((book) => { return Library.filterBy(book.pageCount, pageCount, filterType); });
    }

    static findBookById(books, id) {
        return books.find((book) => { return book.id === id; });
    }

    static findAuthorById(authors, id) {
        return authors.find((author) => { return author.id === id; });
    }
    
    static getBookIdAuthorFullNameMap(books, authors) {
        if (Library.bookIdAuthorFullNameMap === undefined) {
            let bookIdAuthorFullNameMap = new Map();
            books.forEach((book) => {
                let bookAuthorId = book.authorId;
                bookIdAuthorFullNameMap.set(book.id, (function (authors, bookAuthorId) {
                    return authors.find((author) => { return author.id === bookAuthorId; }).getFullName();
                })(authors, book.authorId));
            });
            Library.bookIdAuthorFullNameMap = bookIdAuthorFullNameMap;
        }
        return Library.bookIdAuthorFullNameMap;
    }
    
    static sortingBySortType(a, b, sortType) {
        return (a < b) ? -sortType : (a > b) ? sortType : 0;
    }

    static filterBy(a, b, filterType) {
        return eval(a + filterType + b);
    }
}