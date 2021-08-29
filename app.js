"use strict";

const submitBtn = document.querySelector(".form__submit");
const table = document.querySelector(".table");

let books = [];

//book class
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }

  addBookToTable() {
    const html = `
          <tr class="table__data">
            <td class="table__info" id="title-data">${this.title}</td>
            <td class="table__info" id="author-data">${this.author}</td>
            <td class="table__info" id="isbn-data">${this.isbn}</td>
            <td class="table__info" id="delete-data">
              <button class="delete">X</button>
            </td>
          </tr>`;

    document.querySelector(".table").insertAdjacentHTML("beforeend", html);
  }
}

class UI {
  static deleteBook(isbn) {
    //delete book on click
    document.querySelectorAll(".table__data").forEach((data) =>
      data.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete")) {
          this.removeFromArray(isbn);
          e.target.parentElement.parentElement.remove();
        }
      })
    );
  }

  static removeFromArray(isbn) {
    books.forEach((data) => {
      if (data.isbn === isbn) {
        books.pop(data);
        Storage.storeNewBook(books);
      }
    });
  }

  static instantiateBook(formTitle, formAuthor, formISBN) {
    const newBook = new Book(formTitle, formAuthor, formISBN);

    books.push(newBook);
    Storage.storeNewBook(books);
    newBook.addBookToTable();
    this.deleteBook(formISBN);
  }
}

class Storage {
  static storeNewBook(books) {
    console.log(books);
    localStorage.setItem("books", JSON.stringify(books));
  }

  static showBooks() {
    const storedBooks = JSON.parse(localStorage.getItem("books"));
    console.log(storedBooks);
    storedBooks.forEach((book) => {
      UI.instantiateBook(book.title, book.author, book.isbn);
    });
  }
}

//fill out form and create new book object

//show stored books on reload
document.addEventListener("DOMContentLoaded", () => {
  Storage.showBooks();
});

//click submit to add details to table
submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const formTitle = document.querySelector("#title").value;
  const formAuthor = document.querySelector("#author").value;
  const formISBN = document.querySelector("#isbn").value;

  if (
    formTitle.trim() !== "" &&
    formAuthor.trim() !== "" &&
    formISBN.trim() !== ""
  ) {
    UI.instantiateBook(formTitle, formAuthor, formISBN);
  } else alert("Fill in all fields!");
});

//save to local storage
