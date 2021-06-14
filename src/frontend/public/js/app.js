const bookForm = document.querySelector("form");
const errorMsg = document.getElementById("error");
const resultMsg = document.getElementById("result");
const inputs = document.getElementsByTagName("input");
const books = document.getElementById("all_books");

bookForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const bookTitle = inputs[0].value || undefined,
    bookAuthor = inputs[1].value || undefined,
    bookRating = inputs[2].value || undefined;

  errorMsg.textContent = "Adding book...";
  resultMsg.textContent = "";

  // Fetching from the reative URL
  fetch("/books", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: bookTitle,
      author: bookAuthor,
      rating: bookRating,
    }),
  }).then((res) => {
    res.json().then((data) => {
      if (data.error) {
        errorMsg.textContent = data.error;
        return;
      }
      errorMsg.textContent = "";
      // resultMsg.textContent = data;
      console.log(data);
      leadBooks();
    });
  }).catch((e) => {
    errorMsg.textContent = "Could not add this book.";
  });;
});

document.addEventListener('DOMContentLoaded', (event) => {
  console.log('Fetching books...');
  leadBooks();
});

const leadBooks = () => {
  fetch("/books", {
    method: 'GET',
  }).then((res) => {

    res.json().then((data) => {
      if (data.error) {
        errorMsg.textContent = data.error;
        return;
      }
      errorMsg.textContent = "";
      // resultMsg.textContent = data;
      books.innerHTML = "";
      console.log(data);
      const container = document.getElementById('all_books');
      data.forEach((result, idx) => {
        // Create card element
        const card = document.createElement('div');
        card.classList = 'card-body';

        // Construct card content
        const content = `
          <div class="card" id="card-${idx} data-parent="#all_books">
            <p>${result.title}</p>
            <h4>By ${result.author}</h4>
            <p class="rating">Avg. Rating: ${Math.round(result.avgRating * 100) / 100 }</p>
        </div>
        `;

        // Append newyly created card element to the container
        container.innerHTML += content;
      })
    });
  }).catch((e) => {
    errorMsg.textContent = "No Books Found";
  });
}