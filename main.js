const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';
 
function generateId() {
    return +new Date();
}
 
function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
} 
 
function addBook() {
    const judulbuku = document.getElementById('inputBookTitle').value;
    const Authorbuku = document.getElementById('inputBookAuthor').value;
    const tahunbuku = document.getElementById('inputBookYear').value;
    const isCompleted = document.getElementById('inputBookIsComplete').checked;
 
    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, judulbuku, Authorbuku, tahunbuku, isCompleted);
    books.push(bookObject);
 
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}
 
function makeBook(bookObject) {
    const judulbuku = document.createElement('h3');
    judulbuku.innerText =  bookObject.title;
 
    const Authorbuku = document.createElement('p');
    Authorbuku.innerText = 'Penulis : ' + bookObject.author;
 
    const tahunbuku = document.createElement('p');
    tahunbuku.innerText ='Tahun : ' + bookObject.year;
 
    const textContainer = document.createElement('div');
    textContainer.classList.add('book_item');
    textContainer.append(judulbuku, Authorbuku, tahunbuku);
 
    const container = document.createElement('article');
    container.classList.add('book_item');
    container.append(textContainer);
    container.setAttribute('id', `book-${bookObject.id}`);
 
    const btnAct = document.createElement('div');
        btnAct.classList.add('action');
 
        if (bookObject.isCompleted) {
            const undoButton = document.createElement('button');
            undoButton.classList.add('green');
            undoButton.innerText = 'Belum';
            undoButton.addEventListener('click', function () {
                undoBookFromCompleted(bookObject.id);
            });
 
            const removeButton = document.createElement('button');
            removeButton.classList.add('red');
            removeButton.innerText = 'Hapus';
            removeButton.addEventListener('click', function () {
                removeBooks(bookObject.id);
                alert('Apakah anda yakin untuk menghapus?')
            });
 
            btnAct.append(undoButton, removeButton);
        } else {
            const completeButton = document.createElement('button');
            completeButton.classList.add('green');
            completeButton.innerText = 'Selesai';
            completeButton.addEventListener('click', function () {
                addBookToCompleted(bookObject.id);
            });
 
            const removeButton = document.createElement('button');
            removeButton.classList.add('red');
            removeButton.innerText = 'Hapus';
            removeButton.addEventListener('click', function () {
                removeBooks(bookObject.id);
                alert('Hapus')
            });
 
            btnAct.append(completeButton, removeButton);
        }
    container.append(btnAct);
    return container;
}
 
function addBookToCompleted (bookId) {
    const bookTarget = findBook(bookId);
 
    if (bookTarget == null) return;
 
    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}
 
function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}
 
function removeBooks(bookId) {
    const bookTarget = findBookIndex(bookId);
 
    if (bookTarget === -1) return;
 
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
 
function undoBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId);
 
    if (bookTarget == null) return;
 
    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}
 
function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}
 
function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }
 
    return -1;
}
 
function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
 
    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

 
document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();    
    });
        if (isStorageExist()) {
            loadDataFromStorage();
        } 
});
 
const checkbox = document.getElementById('inputBookIsComplete');
  let check = checkbox;
  
  checkbox.addEventListener('change', function() {
    if (checkbox.checked) {
      check = true;
      
      document.querySelector('span').innerText = 'Selesai dibaca';
    }else {
      check = false;
  
      document.querySelector('span').innerText = 'Belum selesai dibaca';
    }
  });

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBOOKList = document.getElementById('incompleteBookshelfList');
    uncompletedBOOKList.innerHTML = '';
 
    const completedBOOKList = document.getElementById('completeBookshelfList');
    completedBOOKList.innerHTML = '';
 
    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isCompleted) {
            uncompletedBOOKList.append(bookElement);
        } else {
            completedBOOKList.append(bookElement);
        }
    }
});



document.getElementById('searchBook').addEventListener('submit', function (event) {
    event.preventDefault();
    const searchBook2 = document.getElementById('searchBookTitle').value.toLowerCase();
    const bookList = document.querySelectorAll('.book_item > h3');
    for (const buku of bookList) {
      if (buku.innerText.toLowerCase().includes(searchBook2)) {
        buku.parentElement.parentElement.style.display = 'block';
      } else {
        buku.parentElement.parentElement.style.display = 'none';
      }
    }
  });
 
document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});