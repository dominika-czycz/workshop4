$(()=>{
//show book details function
const showBookDetails = (book) => {

    const $bookDetails = $(
        `
            <div id="${'book' + book.id}" 
                class="collapse" 
                aria-labelledby="${'bookHeading' + book.id}"
                data-parent="#booksAccordion">
						<form class="form-inline">
							<div class="form-group mb-2 p-1">
								<label for="${'isbn' + book.id}">ISBN:</label>
								<input type="text" id="${'isbn' + book.id}" value="${book.isbn}" class="form-control">
							</div>
							<div class="form-group mb-2 p-1">
								<label for="${'title' + book.id}">Title:</label>
								<input type="text" id="${'title' + book.id}" value="${book.title}" class="form-control">
							</div>
							<div class="form-group mb-2 p-1">
								<label for="${'author' + book.id}">Author:</label>
								<input type="text" id="${'author' + book.id}" value="${book.author}" class="form-control">
							</div>
							<div class="form-group mb-2 p-1">
								<label for="${'publisher' + book.id}">Publisher:</label>
								<input type="text" id="${'publisher' + book.id}" value="${book.publisher}" class="form-control">
							</div>
							<div class="form-group mb-2 p-1">
								<label for="${'type' + book.id}">Type:</label>
								<input type="text" id="${'type' + book.id}" value="${book.type}" class="form-control">
							</div>
							<button type="submit" data-id="${book.id}" class="btn btn-primary mb-2 editBook">Edit</button>
						</form>
            </div>
            `);

    $(`${'#bookHeading' + book.id}`).after($bookDetails);
    createEditButtonEvent($bookDetails.find('button'))
}
    const createEditButtonEvent = ($button) => {
        $button.on('click', (e) => {
            e.preventDefault();
            const id = $(e.currentTarget).data('id');
            const $isbn = $(`#isbn${id}`)
            const $title = $(`#title${id}`)
            const $author = $(`#author${id}`)
            const $publisher = $(`#publisher${id}`)
            const $type = $(`#type${id}`)

            const newBook = {
                id: id,
                isbn: $isbn.val(),
                title: $title.val(),
                author: $author.val(),
                publisher: $publisher.val(),
                type: $type.val()
            };
            $.ajax({
                url: 'http://localhost:8282/books/' + id,
                method: 'PUT',
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(newBook)
            }).done(() => getBooks())
        })
    }
    const showBookButton = () => {
        $('#booksAccordion').on('click', 'button', (e) => {
            e.stopImmediatePropagation();
            const $this = $(e.currentTarget);
            const $divToShow = $this.closest('.card').find($this.attr('data-target'))
            if ($divToShow.length === 0) {
                $.ajax({
                    url: 'http://localhost:8282/books/' + $this.data('id'),
                    method: 'GET',
                    dataType: 'json'
                }).done((response) => {
                    showBookDetails(response);
                    $this.closest('.card').find($this.attr('data-target')).collapse('show')
                })
            } else {
                $divToShow.collapse('toggle')
            }
        })
    }
    showBookButton();
})