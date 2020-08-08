const name = document.getElementById('name'),
  author = document.getElementById('author'),
  isbn = document.getElementById('isbn'),
  form = document.getElementById('book-form'),
  bookList = document.getElementById('bookList'),
  heading = document.getElementById('heading'),
  alertDiv = document.getElementById('alert')

class Book {
  constructor(name, author, isbn) {
    this.name = name
    this.author = author
    this.isbn = isbn
  }
}

class UI {
  showAlert(message, className) {
    alertDiv.style.display = 'block'
    heading.style.padding = '0'
    const h2 = document.createElement('h2')
    h2.textContent = message
    alertDiv.appendChild(h2)
    alertDiv.classList = `alert ${className}`
    setTimeout(() => {
      alertDiv.style.display = 'none'
      heading.style.padding = '1rem 0'
      h2.textContent = ''
    }, 2000);
  }

  clearFields() {
    name.value = ''
    author.value = ''
    isbn.value = ''
  }

  addBookToList(book) {
    const div = document.createElement('div'),
      bookName = document.createElement('h2'),
      authorName = document.createElement('h2'),
      isbnNumber = document.createElement('h2'),
      deleteIcon = document.createElement('i')
    div.className = 'book-card'
    bookName.textContent = book.name
    authorName.textContent = book.author
    isbnNumber.textContent = book.isbn
    deleteIcon.className = 'fas fa-trash-alt'
    div.appendChild(bookName)
    div.appendChild(authorName)
    div.appendChild(isbnNumber)
    div.appendChild(deleteIcon)
    bookList.appendChild(div)
  }

  deleteBook(target) {
    target.parentElement.remove()
  }
}

class LocalStorage {
  static getBooks() {
    let books
    if (localStorage.getItem('books') === null) {
      books = []
    } else {
      books = JSON.parse(localStorage.getItem('books'))
    }
    return books
  }

  static displayBooks() {
    const books = LocalStorage.getBooks()
    books.forEach((book) => {
      const ui = new UI()
      ui.addBookToList(book)
    })
  }

  static addBooks(book) {
    const books = LocalStorage.getBooks()
    books.push(book)
    localStorage.setItem('books', JSON.stringify(books))
  }

  static removeBook(target) {
    const isbn = target.parentElement.childNodes[2].textContent,
      books = LocalStorage.getBooks()
    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1)
      }
    })
    localStorage.setItem('books', JSON.stringify(books))
  }
}

document.addEventListener('DOMContentLoaded', LocalStorage.displayBooks())

form.addEventListener('submit', (e) => {
  const ui = new UI()
  if (name.value === '' | author.value === '' | isbn.value === '') {
    ui.showAlert('Fill in all the fields !', 'error')
  } else {
    const book = new Book(name.value, author.value, isbn.value)
    ui.addBookToList(book)
    LocalStorage.addBooks(book)
    ui.showAlert('Book Added !', 'success')
  }
  ui.clearFields()
  e.preventDefault()
})

bookList.addEventListener('click', (e) => {
  if (e.target.className === 'fas fa-trash-alt' && e.target.parentElement.className === 'book-card') {
    const ui = new UI()
    ui.deleteBook(e.target)
    LocalStorage.removeBook(e.target)
    ui.showAlert('Book Removed !', 'success')
    e.preventDefault()
  }
})