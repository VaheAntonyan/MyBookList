/*jshint esversion: 6 */
var view;
window.onload = () => {view = new View();};

class View {
    constructor() {
        this.init();
    }

    init() {
        Promise.all([BookService.getBooks(), AuthorService.getAuthors()])
        .then(([books, authors]) => {
            this.booksInitialState = books;
            this.booksNonSortedState = this.cloneBooks(this.booksInitialState);
            this.books = this.cloneBooks(this.booksInitialState);
            this.authors = authors;
            this.bookIdAuthorFullNameMap = Library.getBookIdAuthorFullNameMap(books, authors);

            this.tableInit();
        });
    }

    cloneBooks(booksToBeCloned) {
        const clonedBooks = [];
        booksToBeCloned.forEach((book) => clonedBooks.push(book.clone()));
        return clonedBooks;
    }

    tableInit() {
        const body = document.body;

        const tableContainer = document.createElement("div");
        tableContainer.id = "tableContainer";
        body.appendChild(tableContainer);

        this.filtersInit();
        this.popUpInit();
        
        const table = document.createElement("table");
        table.id = "myBookList";
        tableContainer.appendChild(table);

        const caption = document.createElement("caption");
        caption.textContent = "My Book List";
        table.appendChild(caption);

        table.addEventListener("click", (e) => {
            Object.keys(e.target.attributes).forEach((key) => {
                if (e.target.attributes[key].name === "bookid") {
                    this.drawBookPopUp(Library.findBookById(this.books, parseInt(e.target.attributes.bookid.nodeValue)), e.pageX, e.pageY);
                } else {
                    if (e.target.attributes[key].name === "authorid") {
                        this.drawAuthorPopUp(Library.findAuthorById(this.authors, parseInt(e.target.attributes.authorid.nodeValue)), e.pageX, e.pageY);
                    }
                }
            });
        });

        const thead = document.createElement("thead");
        table.appendChild(thead);

        const tr = document.createElement("tr");
        thead.appendChild(tr);

        const colNames = ["Title", "Author", "Page Count", "Read On"];
        const sortFunctions = [this.sortBooksByTitle, this.sortBooksByAuthorFullName, this.sortBooksByPageCount, this.sortBooksByReadOn]; 
        let sortType;
        for (let j = 0; j < colNames.length; j++) {
            let th = document.createElement("th");
            th.appendChild(document.createTextNode(colNames[j]));
            let i = document.createElement("i");
            i.classList.add('fas');
            i.classList.add('fa-sort');
            i.addEventListener("click", (e) => {
                switch(e.target.className) {
                    case "fas fa-sort" : 
                        sortType = SortingType.ASC;
                        this.setIconClass(i, "fa-sort-up");
                        break;
                    case "fas fa-sort-up" : 
                        sortType = SortingType.DESC;
                        this.setIconClass(i, "fa-sort-down");
                        break;
                    case "fas fa-sort-down" : 
                        sortType = SortingType.NO;
                        this.setIconClass(i, "fa-sort");
                        break;
                }
                sortFunctions[j].call(this, sortType);
                this.updateTable(this.books);
            });
            th.appendChild(i);
            tr.appendChild(th);
        }



        this.createTableContent();
    }

    filtersInit() {
        const tableContainer = document.getElementById("tableContainer");
        const filtersDiv = document.createElement("div");
        filtersDiv.id = "filters";
        tableContainer.appendChild(filtersDiv);

        this.filterByAuthorsInit();
        this.filterByReadOnYearInit();
        this.filterByPageCount();
        this.filterButtonInit();
    }

    filterButtonInit() {
        const filtersDiv = document.getElementById("filters");
        const filterButton = document.createElement("button");
        filterButton.id = "filterButton";
        filterButton.appendChild(document.createTextNode("Filter"));
        filtersDiv.appendChild(filterButton);

        filterButton.addEventListener("click", (e) => {
            this.books = this.cloneBooks(this.booksInitialState);

            let anyFilterSelected = false;
            let selectedAuthorId = document.getElementById("filterByAuthorsSelect").value;
            if (selectedAuthorId !== "-- select an option --") {
                selectedAuthorId = parseInt(selectedAuthorId);
                this.filterBooksByAuthorId(selectedAuthorId);
                this.updateTable(this.books);
                anyFilterSelected = true;
            }

            let selectedReadOnYear = document.getElementById("filterByReadOnYearInput").value;
            if (selectedReadOnYear !== "") {
                selectedReadOnYear = parseInt(selectedReadOnYear);
                this.filterBooksByReadOn(selectedReadOnYear);
                this.updateTable(this.books);
                anyFilterSelected = true;
            }

            let selectedPageCount = document.getElementById("filterByPageCountInput").value;
            if (selectedPageCount !== "") {
                selectedPageCount = parseInt(selectedPageCount);
                let filterType = document.getElementById("filterByPageCountSelect").value;
                filterType = filterType === "=" ? "==" : filterType;
                this.filterBooksByPageCount(selectedPageCount, filterType);
                this.updateTable(this.books);
                anyFilterSelected = true;
            }

            if (!anyFilterSelected) {
                this.updateTable(this.booksInitialState);
            }

            this.booksNonSortedState = this.cloneBooks(this.books);
            this.resetIconsClass();
        });

    }

    filterByPageCount() {
        const filterByPageCountDiv = `
        <div id="filterByPageCount">
            <label for="filterByPageCountInput">Filter By Page Count</label><br>
            <input id="filterByPageCountInput" type="number">
            <select id="filterByPageCountSelect">
                <option selected>&gt=</option>
                <option>&lt=</option>
                <option>=</option>
            </select>
        </div>
        `;
        const filtersDiv = document.getElementById("filters");
        filtersDiv.insertAdjacentHTML('beforeend', filterByPageCountDiv);
    }

    filterByReadOnYearInit() {
        const filterByReadOnYearDiv = `
        <div id="filterByReadOnYear">
            <label for="filterByReadOnYearInput">Filter By Read On Year</label><br>
            <input id="filterByReadOnYearInput" type="number"><br>
        </div>
        `;
        const filtersDiv = document.getElementById("filters");
        filtersDiv.insertAdjacentHTML('beforeend', filterByReadOnYearDiv);
    }
    
    filterByAuthorsInit() {
        const filterByAuthorsDiv = `
        <div id="filterByAuthors">
            <label for="filterByAuthorsSelect">Filter By Authors</label><br>
            <select id="filterByAuthorsSelect"></select>
        </div>
        `;
        const filtersDiv = document.getElementById("filters");
        filtersDiv.insertAdjacentHTML('beforeend', filterByAuthorsDiv);

        const filterByAuthorsSelect = document.getElementById("filterByAuthorsSelect");
        
        const authorsIdAndFullName = [];
        Library.sortAuthorsByFullName(this.authors, SortingType.ASC).forEach((author) => {
            authorsIdAndFullName.push([author.id, author.getFullName()]);
        });

        filterByAuthorsSelect.insertAdjacentHTML('beforeend', `<option selected>-- select an option --</option>`);
        authorsIdAndFullName.forEach(([authorId, authorFullName]) => {
            filterByAuthorsSelect.insertAdjacentHTML('beforeend', `<option value="${authorId}">${authorFullName}</option>`);
        });
    }
    
    updateTable(books) {
        const table = document.getElementById("myBookList");
        let tbody = document.getElementById("myBookListTbody");
        if (table.contains(tbody)) {
            table.removeChild(tbody);
        }
        tbody = document.createElement("tbody");
        tbody.id = "myBookListTbody";
        table.appendChild(tbody);
        let tr;
        let td;

        let renderedRowCount = 0;
        books.forEach((book) => {
            tr = document.createElement("tr");
            tbody.appendChild(tr);

            td = document.createElement("td");
            td.setAttribute("bookId", book.id);
            td.appendChild(document.createTextNode(book.title));
            tr.appendChild(td);

            td = document.createElement("td");
            td.setAttribute("authorId", book.authorId);
            td.appendChild(document.createTextNode(this.bookIdAuthorFullNameMap.get(book.id)));
            tr.appendChild(td);

            td = document.createElement("td");
            td.appendChild(document.createTextNode(book.pageCount));
            tr.appendChild(td);
            
            td = document.createElement("td");
            td.appendChild(document.createTextNode(book.read));
            tr.appendChild(td);

            ++renderedRowCount;
        });

        let renderedRowCountDiv = document.getElementById("renderedRowCount");
        if (renderedRowCountDiv === null) {
            renderedRowCountDiv = document.createElement("div");
            renderedRowCountDiv.id = "renderedRowCount";
        }
        renderedRowCountDiv.textContent = `Rendered row count: ${renderedRowCount}`;

        const tableContainer = document.getElementById("tableContainer");
        tableContainer.appendChild(renderedRowCountDiv);
    }

    drawBookPopUp(book, pageX, pageY) {
        const popUp = document.getElementById("popUp");

        const popUpName = document.getElementById("popUpName");
        popUpName.textContent = book.title;

        const popUpContent = document.getElementById("popUpContent");

        //delete popUpContent childs
        popUpContent.textContent = "";

        const pageCountDiv = document.createElement("div");
        pageCountDiv.textContent = `Page Count: ${book.pageCount}`;
        popUpContent.appendChild(pageCountDiv);

        const authorDiv = document.createElement("div");
        authorDiv.textContent = `Author: ${this.bookIdAuthorFullNameMap.get(book.id)}`;
        popUpContent.appendChild(authorDiv);

        const readOnDiv = document.createElement("div");
        readOnDiv.textContent = `Read On: ${book.read}`;
        popUpContent.appendChild(readOnDiv);

        popUp.style.left = pageX + "px";
        popUp.style.top = pageY + "px";
        popUp.style.display = "block";
    }

    drawAuthorPopUp(author, pageX, pageY) {
        const popUp = document.getElementById("popUp");

        const popUpName = document.getElementById("popUpName");
        popUpName.textContent = author.getFullName();

        const popUpContent = document.getElementById("popUpContent");

        //delete popUpContent childs
        popUpContent.textContent = "";

        const firstNameDiv = document.createElement("div");
        firstNameDiv.textContent = `First Name: ${author.firstName}`;
        popUpContent.appendChild(firstNameDiv);

        const lastNameDiv = document.createElement("div");
        lastNameDiv.textContent = `Last Name: ${author.lastName}`;
        popUpContent.appendChild(lastNameDiv);

        const birthDateDiv = document.createElement("div");
        birthDateDiv.textContent = `Birth Date: ${author.getFormattedBirthDate()}`;
        popUpContent.appendChild(birthDateDiv);

        popUp.style.left = pageX + "px";
        popUp.style.top = pageY + "px";
        popUp.style.display = "block";
    }

    popUpInit() {
        const popUp = `
        <div id="popUp">
            <div id="popUpName"></div>
            <div id="popUpContent"></div>
            <div id="popUpClose"></div>
        </div>
        `;

        const tableContainer = document.getElementById("tableContainer");
        tableContainer.insertAdjacentHTML('beforeend', popUp);
        
        const popUpClose = document.getElementById("popUpClose");
        popUpClose.addEventListener("click", (e) => {
            document.getElementById("popUp").style.display = "none";
        });


        // const popUp = document.createElement("div");
        // popUp.id = "popUp";

        // const popUpName = document.createElement("div");
        // popUpName.id = "popUpName";
        // popUp.appendChild(popUpName);

        // const popUpContent = document.createElement("div");
        // popUpContent.id = "popUpContent";
        // popUp.appendChild(popUpContent);

        // const popUpClose = document.createElement("div");
        // popUpClose.id = "popUpClose";
        // popUpClose.textContent = "X";
        // popUpClose.addEventListener("click", (e) => {
        //     document.getElementById("popUp").style.display = "none";
        // });
        // popUp.appendChild(popUpClose);

        // const tableContainer = document.getElementById("tableContainer");
        // tableContainer.appendChild(popUp);
    }

    setIconClass(i, className) {
        this.resetIconsClass();
        
        i.classList.remove(i.classList.item(1));
        i.classList.add(className);
    }

    resetIconsClass() {
        const table = document.querySelector("#myBookList");
        const iTags = table.querySelectorAll("i.fas");

        iTags.forEach((i) => {
            i.classList.remove(i.classList.item(1));
            i.classList.add("fa-sort");
        });
    }

    createTableContent() {
        this.updateTable(this.books);
    }

    sortBooksByTitle(sortType) {
        Library.sortBooksByTitle(this.books, sortType);
        if (sortType === SortingType.NO) {
            this.books = this.cloneBooks(this.booksNonSortedState);
        }
    }

    sortBooksByPageCount(sortType) {
        Library.sortBooksByPageCount(this.books, sortType);
        if (sortType === SortingType.NO) {
            this.books = this.cloneBooks(this.booksNonSortedState);
        }
    }

    sortBooksByReadOn(sortType) {
        Library.sortBooksByReadOn(this.books, sortType);
        if (sortType === SortingType.NO) {
            this.books = this.cloneBooks(this.booksNonSortedState);
        }
    }

    sortBooksByAuthorFullName(sortType) {
        Library.sortBooksByAuthorFullName(this.books, this.authors, sortType);
        if (sortType === SortingType.NO) {
            this.books = this.cloneBooks(this.booksNonSortedState);
        }
    }

    filterBooksByAuthorId(authorId) {
        this.books = Library.filterBooksByAuthorId(this.books, authorId);
    }

    filterBooksByReadOn(readOn) {
        this.books = Library.filterBooksByReadOn(this.books, readOn);
    }

    filterBooksByPageCount(pageCount, filterType) {
        this.books = Library.filterBooksByPageCount(this.books, pageCount, filterType);   
    }
}