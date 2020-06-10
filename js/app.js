$(() => {
    /**
     * This function takes data from the add book form and sends it to server in order to create new book record.
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
                console.log(isbn);
                console.log(title);
                console.log(author);
                console.log(publisher);
                console.log(type);
                if (isbn.length < 1 || title.length < 1 || author.length < 1
                    || publisher.length < 1 || type.length < 1) {
                    alert('Please, complete all fields');
                } else {
                    const newBook = {
                        isbn: isbn,
                        title: title,
                        author: author,
                        publisher: publisher,
                        type: type
                    };
                    console.log(newBook);
                    $.ajax({
                        url: 'http://localhost:8282/books/',
                        method: 'POST',
                        dataType: 'json',
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify(newBook),
                    }).done(() => {
                        getBooks();
                        alert(`New book ${title} has been added to book shelf`);
                    })
                }
            }
        )
    }

    /**
     * The function to get all books data from server
     */
    const getBooks = () => {
        $('#books').empty();
        $.ajax({
            url: 'http://localhost:8282/books/',
            method: 'GET',
            dataType: 'json',
        }).done((response) => {
            response.forEach(el => {
                createBookDiv(el)
            })
        })
    }
    /**
     * This function creates div with book title button and delete button. Then it adds mouse events on created buttons.
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
                            <button type="button" class="btn btn-info detailsBtn" data-id="${id}">${title}</button>
                        </div>
                         <div class="col-sm-6 darker">
                        <button type="button" data-id="${id}" class="btn btn-danger deleteBtn">delete</button>
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
     * This function add click event on delete button, which deletes book from server
     * @param $button jQuery delete button element
     */
    const addDeleteBtnEvent = ($button) => {
        $button.on('click', function (e) {
            e.preventDefault();
            const id = $(this).data('id');
            $.ajax({
                url: 'http://localhost:8282/books/' + id,
                method: 'DELETE',
            }).done(() => getBooks())
        })
    }
    /**
     * This function add click event on info button
     * @param $button jQuery info button element
     */
    const addDetailsBtnEvent = ($button) => {
        $button.on('click', function (e) {
            e.preventDefault();
            const $bookDetails = $(this).closest('.card').find('.book-details');
            if ($bookDetails.length === 0) {
                $.ajax({
                    url: 'http://localhost:8282/books/' + $(this).data('id'),
                    method: 'GET',
                    dataType: 'json'
                }).done((response) => {
                    showBookDetailsForm(response);
                })
            } else {
                $bookDetails.toggle();
            }
        })
    }

    /**
     * This function creates and adds div with form (filled with book data) to edit book details.
     * The form contains edit button, on which the function adds mouse event (click).
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
                        <button type="button" data-id="${id}" class="btn btn-outline-primary btn-warning editBtn">edit</button>
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
     * This function add click event on edit button
     * @param $button jQuery edit button element
     */
    const addEditButtonEvent = ($button) => {
        $button.on('click', function (e) {
            e.preventDefault();
            const id = $(this).data('id');
            console.log('dupa');
            console.log(id);
            const isbn = $(`#isbn-${id}`).val();
            const title = $(`#title-${id}`).val();
            const author = $(`#author-${id}`).val();
            const publisher = $(`#publisher-${id}`).val();
            const type = $(`#type-${id}`).val();

            const newBook = JSON.stringify({
                id: id,
                isbn: isbn,
                title: title,
                author: author,
                publisher: publisher,
                type: type
            });
            console.log(newBook);
            $.ajax({
                url: 'http://localhost:8282/books/' + id,
                method: 'PUT',
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                data: newBook
            }).done(() => {
                getBooks();
                alert(`Book ${title} updated`);
            })
        })
    }

    addNewBook();
    getBooks();
})