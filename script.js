// Array for books
let library = [];

// Constructor function for book
function Book(title, author, pages, read, id) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = Boolean(read) ? "Read" : "Not read";
    this.id = id;
};

function addBookToLibrary(book) {
    library.push(book);
    saveLibrary();
};

function removeBookFromLibrary(id) {
    library.splice(library.findIndex(book => book.id === id), 1);
    saveLibrary();
};

function toggleReadStatus(id) {
    const book = library[library.findIndex(item => item.id === id)];
    if (book.read === "Read") {
        book.read = "Not Read";
    }
    else {
        book.read = "Read";
    }
    saveLibrary()
}

// Display book/s in HTML
function displayBooks() {
    const bookCtn = document.querySelector(".book-ctn");
    bookCtn.innerHTML = "";

    // Retrieve saved library, or assign an empty array if library is null
    library = retrieveLibrary() ? retrieveLibrary() : [];

    library.forEach(item => {
        bookCtn.insertAdjacentHTML("afterbegin", `
        <div class="book" data-book-id="${item.id}">
            <div class="book-description">
                <h1 class="title">${item.title}</h1>
                <p class="author">${item.author}</p>
                <p>Pages: ${item.pages}</p>
            </div>

            <div class="button-ctn">
            <button type="button" class="read-btn ${item.read === "Read" ? "read" : "not-read"}">${item.read}</button>
                <button type="button" class="dlt-btn">Delete</button>
            </div>
        </div>
        `);
    });
};

const modal = document.getElementById("modal");
const form = document.getElementById("book-form");

document.getElementById("open-modal").addEventListener("click", function() {
  modal.style.display = "block";
});

document.getElementById("close-modal").addEventListener("click", function() {
  modal.style.display = "none";
});

form.addEventListener("submit", function(event) {
  event.preventDefault();

  // Check if input fields are filled
  if (form.checkValidity()) {
    modal.style.display = "none"; 

    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const pages = document.getElementById("pages").value;
    const isRead = document.getElementById("is-read").checked;

    const bookId = generateUniqueId();

    const book = new Book(title, author, pages, isRead, bookId);

    addBookToLibrary(book);
    displayBooks();
    }

    // Reset the form to clear the input fields
    this.reset();
});

const bookCtn = document.querySelector(".book-ctn");

// Used event delegation by adding one event listener to a parent element instead of every .dlt-btn and .read-btn for better efficiency 
bookCtn.addEventListener("click", (event) => {
    const bookEl = event.target.closest(".book");

    if (event.target.classList.contains("dlt-btn")) {
        if (confirm('Confirm to delete')) {
            // Delete the book element
            bookEl.remove();

            // Remove book item from library array
            removeBookFromLibrary(parseInt(bookEl.dataset.bookId));
        }
    }

    const readBtn = event.target.closest(".read-btn");

    if (event.target.classList.contains("read-btn")) {
        if (readBtn.innerHTML == "Read") {
            readBtn.innerHTML = "Not Read"
            readBtn.classList.toggle("not-read");
            readBtn.classList.toggle("read");
        }
        else {
            readBtn.innerHTML = "Read"
            readBtn.classList.toggle("not-read");
            readBtn.classList.toggle("read");
        }

        toggleReadStatus(parseInt(bookEl.dataset.bookId));
    }
});

// Retrieve the idCounter value from localStorage, or set it to 0 if it doesn't exist
let idCounter = localStorage.getItem('idCounter') ? parseInt(localStorage.getItem('idCounter')) : 1;

function generateUniqueId() {
    const uniqueId = idCounter;
    idCounter++;

    // Save updated idCounter so book ids are consistent
    localStorage.setItem('idCounter', idCounter);
    return uniqueId;
};

// Save stringified library array
function saveLibrary() {
    localStorage.setItem("data", JSON.stringify(library));
};

// Retrieve saved user data
function retrieveLibrary() {
    return JSON.parse(localStorage.getItem("data"));
};

displayBooks();