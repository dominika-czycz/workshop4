$(() => {
        /**
         * This function takes data from the add book form and connect with REST API in order to create new book record.
         * Then it calls getBook() method to refresh books's data on the page.
         */
        const addNewBook = () => {
            const $button = $('#addBook');
            $button.on('click', function (e) {
                    e.preventDefault();
                    const isbn = $('#isbn').val();
                    const title = $('#title').val();
                    const author = $('#author').val();
                    const publisher = $('#publisher').val();
                    const type = $('#type').val();
                    if (isbn.length < 1 || title.length < 1 || author.length < 1
                        || publisher.length < 1 || type.length < 1) {
                        alert('Please, complete all fields');
                    } else {
                        const $ajax = connectWithREST($(this));
                        $ajax.done(() => {
                            getBooks();
                            alert('New book added successfully');
                        })
                    }
                }
            )
        }

        /**
         * This function by calling another functions get necessary data from REST API and creates divs with
         * book title and delete buttons
         */
        const getBooks = () => {
            $('#books').empty();
            const $ajax = connectWithREST();
            $ajax.done((response) => {
                response.forEach(el => {
                    createBookDiv(el)
                })
            })
        }

        /**
         * This function creates div with book title button and delete button. Then it calls another functions
         * to add mouse events on created buttons.
         * @param book object containing book details
         */
        const createBookDiv = (book) => {
            const id = book.id;
            const title = book.title;
            const $newDiv = $(`
            <div class="card" id="book + ${id}">
                <div class="card-header" id="header-${id}">
                    <div class="row">
                        <div class="col-sm-6 darker">
                            <button type="button" class="btn btn-info detailsBtn" data-method="GET" data-id="${id}">${title}</button>
                        </div>
                         <div class="col-sm-6 darker">
                        <button type="button"  data-method="DELETE" data-id="${id}" class="btn btn-danger deleteBtn">delete</button>
                        </div>
                    </div>
                </div>
            </div>
        `);
            $('#books').append($newDiv);
            addDeleteBtnEvent($newDiv.find('.deleteBtn'));
            addDetailsBtnEvent($newDiv.find('.detailsBtn'));
        }

        /**
         * This function creates and adds div with form (filled with book data) to edit book details.
         * The form contains edit button, on which the called function adds mouse event (click).
         * @param book object containing book details
         */
        const showBookDetailsForm = (book) => {
            const id = book.id;
            const $bookDetails = $(`
                                    <div class="row text-center book-details">
                                        <div class="card-body text-center">
                                            <form>
                                                <div class="col-auto mr-auto text-center">
                                                    <div class="card">
                                                        <div class="form-group">
                                                            <label for="isbn-${id}"></label><input type="text" name="isbn" id="isbn-${id}"
                                                                   class="form-control" value="${book.isbn}">
                                                            <small id="helpISBN-${id}" class="text-muted">ISBN</small>
                                                            <label for="title-${id}"></label><input type="text" name="title" id="title-${id}"
                                                                    class="form-control"
                                                                    value="${book.title}">
                                                            <small id="helpTitle-${id}" class="text-muted">title</small>
                                                            <label for="author-${id}"></label><input type="text" name="author" id="author-${id}"
                                                                     class="form-control"
                                                                     value="${book.author}">
                                                            <small id="helpAuthor-${id}" class="text-muted">Author</small>
                                                            <label for="publisher-${id}"></label><input type="text" name="publisher"
                                                                        id="publisher-${id}"
                                                                        class="form-control" value="${book.publisher}">
                                                            <small id="helpPublisher-${id}" class="text-muted">Publisher</small>
                                                            <label for="type-${id}"></label><input type="text" name="type" id="type-${id}"
                                                                   class="form-control" value="${book.type}">
                                                            <small id="helpType-${id}" class="text-muted">Type</small>
                                                        </div>
                                                        <button type="button" data-method="PUT" data-id="${id}" class="btn btn-outline-primary btn-warning editBtn">edit</button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                    `);
            $(`#header-${id}`).after($bookDetails);
            addEditButtonEvent($bookDetails.find('.editBtn'))
        }
        /**
         * This function add click event on delete button and calls the another function to allow connection with REST API
         * @param $button jQuery delete button element
         */
        const addDeleteBtnEvent = ($button) => {
            $button.on('click', function (e) {
                e.preventDefault();
                const $ajax = connectWithREST($(this));
                $ajax.done(() => {
                    getBooks();
                    alert('Book deleted successfully');
                })
            })
        }

        /**
         * This function add click event on 'info button' and calls the another function to allow connection with REST API
         * @param $button jQuery info button element
         */
        const addDetailsBtnEvent = ($button) => {
            $button.on('click', function (e) {
                e.preventDefault();
                const $bookDetails = $(this).closest('.card').find('.book-details');
                if ($bookDetails.length === 0) {
                    const $ajax = connectWithREST($(this));
                    $ajax.done((response) => {
                        showBookDetailsForm(response);
                    })
                } else {
                    $bookDetails.toggle();
                }
            })
        }

        /**
         * This function add click event on 'add button' and calls the another function to allow connection with REST API
         * @param $button jQuery button element
         */
        const addEditButtonEvent = ($button) => {
            $button.on('click', function (e) {
                    e.preventDefault();
                    const ajax = connectWithREST($(this));
                    ajax.done(() => {
                        getBooks();
                        alert('Book updated successfully');
                    })
                }
            )
        }

        /**
         *This function retrieves from datasets (data-method) what to do (GET, POST, etc.) as well as any book ID
         * and all necessary data from relevant elements of the page. Based on the method from dataset, it communicates
         * with the REST API and sends/receives the necessary data.
         * @param button jQuery element
         * @return AJAX function
         */
        function connectWithREST(button) {
            let method = $(button).data('method');
            let newBook;
            let id;
            if (button !== null) {
                id = $(button).data('id');
                let isbn;
                let title;
                let author;
                let publisher;
                let type;
                if (id == null) {
                    id = '';
                    isbn = $('#isbn').val();
                    title = $('#title').val();
                    author = $('#author').val();
                    publisher = $('#publisher').val();
                    type = $('#type').val();
                } else {
                    isbn = $(`#isbn-${id}`).val();
                    title = $(`#title-${id}`).val();
                    author = $(`#author-${id}`).val();
                    publisher = $(`#publisher-${id}`).val();
                    type = $(`#type-${id}`).val();
                }
                newBook = {
                    id: id,
                    isbn: isbn,
                    title: title,
                    author: author,
                    publisher: publisher,
                    type: type
                };
            } else {
                newBook = null;
                id = '';
                method = 'GET';
            }
            let ajaxObj;
            if (method === 'DELETE') {
                ajaxObj = {
                    url: 'http://localhost:8282/books/' + id,
                    method: method,
                }
            } else {
                ajaxObj = {
                    url: 'http://localhost:8282/books/' + id,
                    method: method,
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify(newBook)
                }
            }
            return $.ajax(ajaxObj);
        }

        addNewBook();
        getBooks();
    }
)