const searchForm = document.querySelector('.search');
const searchInput = document.querySelector('.search__input');
const ul = document.querySelector('.lists');
const message = document.querySelector('.message');
const spinner = document.querySelector('.spinner');
searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  message.classList.remove('show');

  const searchName = searchInput.value;
  if (!searchName) return;

  spinner.classList.add('show');
  const books = await searchBooks(searchName);
  spinner.classList.remove('show');

  showResults(books);
});

async function searchBooks(searchName) {
  const { data } = await axios.get('https://dapi.kakao.com/v3/search/book', {
    headers: {
      Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_REST_API_KEY}`,
    },
    params: {
      query: searchName,
    },
  });
  return data ? data.documents : [];
}

function showResults(books) {
  if (!books || books.length === 0) {
    message.classList.add('show');
    return;
  }
  ul.innerHTML = '';
  books.forEach((book) => {
    const list = createList(book);
    ul.append(list);
  });
}

function createList({ thumbnail, title, authors, datetime, price }) {
  const li = document.createElement('li');
  li.classList.add('item');
  li.innerHTML = `<img
            class="item__thumbnail"
            src="${thumbnail}"
            alt="thumbnail"
          />
          <div class="item__contents">
            <p class="item__title">${title}</p>
            <p class="item__authors">${authors.join(', ')}</p>
            <p class="item__datetime">${getDateFormat(datetime)}</p>
            <p class="item__price">${price.toLocaleString('ko-KR')}원</p>
          </div>`;
  return li;
}

function getDateFormat(dateString) {
  const datetime = new Date(dateString);
  const year = datetime.getFullYear();
  const month = datetime.getMonth();
  const date = datetime.getDate();
  return `${year}. ${month}. ${date}`;
}
