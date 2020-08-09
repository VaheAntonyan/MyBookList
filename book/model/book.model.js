/*jshint esversion: 6 */
class Book {
    constructor(id, title, authorId, pageCount, read) {
        this.id = id;
        this.title = title;
        this.authorId = authorId;
        this.pageCount = pageCount;
        this.read = read;
    }

    static fromJson(json) {
        return new Book(json.id, json.title, json.authorId, json.pageCount, json.read);
    }

    toJSONString() {
        return JSON.stringify(this);
    }

    clone() {
        return new Book(this.id, this.title, this.authorId, this.pageCount, this.read);
    }

    print() {
        console.log("book id - ", this.id);
        console.log("book title - ", this.title);
        console.log("book authorId - ", this.authorId);
        console.log("book pageCount - ", this.pageCount);
        console.log("book read - ", this.read);
    }
}