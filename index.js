document.addEventListener("DOMContentLoaded", main);

function fetchBooks(searchQuery) {
  const url = `https://openlibrary.org/search.json?q=${searchQuery}`;
  return fetch(url)
    .then(res => res.json())
    .then(data => data.docs);
}

function displayBooks(books) {
  const bookContainer = document.getElementById('book-container');
  bookContainer.innerHTML = '';
  books.forEach(book => {
    const bookCard = document.createElement('div');
    bookCard.className = 'book-card';
    
    const img = document.createElement('img');
    img.src = `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`;
    img.alt = book.title;
    img.addEventListener('click', () => showDetails(book));
    
    bookCard.appendChild(img);
    bookContainer.appendChild(bookCard);
  });
}

function showDetails(book) {
  const titleElement = document.querySelector('#detail-title');
  const detailImage = document.querySelector('.detail-image');
  const authorElement = document.querySelector('#detail-author');
  const pagesDisplay = document.getElementById('pages-display');
  const plotDisplay = document.getElementById('plot-display');
  
  detailImage.src = `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`;
  titleElement.innerText = book.title;
  authorElement.innerText = book.author_name ? book.author_name.join(", ") : "Unknown";
  pagesDisplay.innerText = `Pages: ${book.number_of_pages ? book.number_of_pages : "Unknown"}`;
  plotDisplay.innerText = book.first_publish_year ? `First Published: ${book.first_publish_year}` : "Publication Year Unknown";
}

const fetchAndDisplayData = () => { //fetch data from db
  fetch('http://localhost:3000/books')
  .then (resp => resp.json())
  .then (data => {
    const container = document.getElementById('rated-container')
    data.forEach(book => {
      const image = document.createElement('img')
      image.classList.add('book-image')
      image.src=`${book.image}`
      image.addEventListener('click', e => {
        const targetTitle = document.getElementById('rated-title')
        const targetAuthor = document.getElementById('rated-author')
        const targetReview = document.getElementById('rated-review')

        targetTitle.textContent = book.title
        targetAuthor.textContent = book.author
        targetReview.textContent = book.review
        targetTitle.setAttribute('alt', `${book.id}`)
        console.log(targetTitle.getAttribute('alt'))
      })

      container.appendChild(image)
    })})
}

const addSubmitListener = () => {
  const newBookReview = document.querySelector('#new-book')
  newBookReview.addEventListener('submit', e => {
    e.preventDefault()

    const newBookObj = {
      title: e.target.title.value,
      author: e.target.author.value,
      image: e.target.image.value,
      review: newBookReview.querySelector('#new-review').value
    }
    console.log(newBookObj)

    fetch('http://localhost:3000/books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(newBookObj)
    })
    .then(resp => resp.json())
    .then(data => fetchAndDisplayData(data))
  })
}

const addUpdateListener = () => {
  const altId = document.getElementById('rated-title').getAttribute('alt')
  console.log(altId)
  const editBook = document.querySelector('#edit-book')
  editBook.addEventListener('submit', e => {
    e.preventDefault()
    const editObj = {
      review: editBook.querySelector('#update-review').value
    }
    fetch('http://localhost:3000/books/' + `${altId}`, {
      method: 'PATCH',
      headers: {
        'Content=type': 'application/json'
      },
      body: JSON.stringify(editObj)
    })
    .then(resp => resp.json())
    .then(data => console.log(data))
    //console.log(editObj)
  })
}

function handleNewBook(event) {
  event.preventDefault();
  const searchQuery = document.querySelector("#search").value;
  
  fetchBooks(searchQuery)
    .then(books => displayBooks(books));
}

function main() {
  fetchAndDisplayData()
  const newBookForm = document.querySelector("#search-book");
  newBookForm.addEventListener('submit', handleNewBook);
  addSubmitListener()
  document.getElementsByClassName('book-image')[0].click()
  addUpdateListener()
}
