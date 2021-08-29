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

//ui class
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

  static showError() {
    const errMsg = document.querySelector(".message__error");

    errMsg.style.display = "block";

    setTimeout(() => (errMsg.style.display = "none"), 3000);
  }

  static showSuccess() {
    const successMsg = document.querySelector(".message__success");

    successMsg.style.display = "block";

    setTimeout(() => (successMsg.style.display = "none"), 3000);
  }
}

//storage class
class Storage {
  static storeNewBook(books) {
    localStorage.setItem("books", JSON.stringify(books));
  }

  static showBooks() {
    const storedBooks = JSON.parse(localStorage.getItem("books"));

    storedBooks.forEach((book) => {
      UI.instantiateBook(book.title, book.author, book.isbn);
    });
  }
}

//show stored books on reload
document.addEventListener("DOMContentLoaded", () => {
  Storage.showBooks();
});

//click submit to add details to table
submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const formTitle = document.querySelector("#title");
  const formAuthor = document.querySelector("#author");
  const formISBN = document.querySelector("#isbn");

  if (
    formTitle.value.trim() !== "" &&
    formAuthor.value.trim() !== "" &&
    formISBN.value.trim() !== ""
  ) {
    UI.instantiateBook(formTitle.value, formAuthor.value, formISBN.value);
    UI.showSuccess();

    formTitle.value = "";
    formAuthor.value = "";
    formISBN.value = "";
  } else {
    UI.showError();
  }
});
