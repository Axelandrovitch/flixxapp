//TODO: Refactor displayPopularMovies and displayPopularShows to a unique function

const global = {
  currentPage: window.location.pathname,
  search: {
    term: '',
    type: '',
    page: 1,
    totalPages: 1,
    totalResults: 0,
  },
  api: {
    apiKey: '',
    apiUrl: 'https://api.themoviedb.org/3/',
  },
};

//Query Selectors
const moviesContainer = document.querySelector('#popular-movies');
const showsContainer = document.querySelector('#popular-shows');

const spinner = document.querySelector('.spinner');

//higlight active link

function higlightActiveLink() {
  const links = document.querySelectorAll('.nav-link');
  links.forEach((link) => {
    if (link.getAttribute('href') === global.currentPage) {
      link.classList.add('active');
    }
  });
}

//Display 20 more popular Movies
async function displayPopularMovies() {
  const { results } = await fetchAPIData('movie/popular');

  results.forEach((result) => {
    //Create DOM  elements for eaech result
    const card = document.createElement('div');
    const a = document.createElement('a');
    const img = document.createElement('img');
    const cardBody = document.createElement('div');
    const title = document.createElement('h5');
    const p = document.createElement('p');
    const small = document.createElement('small');

    //Add classes
    card.classList.add('card');
    img.classList.add('card-img-top');
    cardBody.classList.add('card-body');
    title.classList.add('card-title');
    p.classList.add('card-text');
    small.classList.add('text-muted');

    //Add attributes
    img.setAttribute('alt', `${result.title}`);

    //Add content from API
    a.setAttribute('href', `movie-details.html?id=${result.id}`);
    img.setAttribute(
      'src',
      result.poster_path
        ? `https://image.tmdb.org/t/p/original/${result.poster_path}
      `
        : '../images/no-image.jpg'
    );
    title.textContent = result.title;
    small.textContent = `Release: ${result.release_date}`;

    //Put the card together
    a.appendChild(img);
    p.appendChild(small);
    cardBody.appendChild(title);
    cardBody.appendChild(p);
    card.appendChild(a);
    card.appendChild(cardBody);

    // Add the card to the DOM
    moviesContainer.appendChild(card);
  });
}

async function displayPopularShows() {
  const { results } = await fetchAPIData('tv/popular');

  results.forEach((result) => {
    //Create DOM  elements for eaech result
    const card = document.createElement('div');
    const a = document.createElement('a');
    const img = document.createElement('img');
    const cardBody = document.createElement('div');
    const title = document.createElement('h5');
    const p = document.createElement('p');
    const small = document.createElement('small');

    //Add classes
    card.classList.add('card');
    img.classList.add('card-img-top');
    cardBody.classList.add('card-body');
    title.classList.add('card-title');
    p.classList.add('card-text');
    small.classList.add('text-muted');

    //Add attributes
    img.setAttribute('alt', `${result.name}`);

    //Add content from API
    a.setAttribute('href', `tv-details.html?id=${result.id}`);
    img.setAttribute(
      'src',
      result.poster_path
        ? `https://image.tmdb.org/t/p/original/${result.poster_path}
      `
        : '../images/no-image.jpg'
    );
    title.textContent = result.name;
    small.textContent = `Air Date: ${result.first_air_date}`;

    //Put the card together
    a.appendChild(img);
    p.appendChild(small);
    cardBody.appendChild(title);
    cardBody.appendChild(p);
    card.appendChild(a);
    card.appendChild(cardBody);

    // Add the card to the DOM
    showsContainer.appendChild(card);
  });
}

// Diplsay Backdrop on details pages
function displayBackgroundImage(type, backgroundPath) {
  const overlayDiv = document.createElement('div');
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
  overlayDiv.style.backgroundSize = 'cover';
  overlayDiv.style.backgroundPosition = 'center';
  overlayDiv.style.backgroundRepeat = 'no-repeat';
  overlayDiv.style.height = '100vh';
  overlayDiv.style.width = '100vw';
  overlayDiv.style.position = 'absolute';
  overlayDiv.style.top = '0';
  overlayDiv.style.left = '0';
  overlayDiv.style.zIndex = '-1';
  overlayDiv.style.opacity = '0.1';
  if (type === 'movie') {
    document.querySelector('#movie-details').appendChild(overlayDiv);
  } else {
    document.querySelector('#show-details').appendChild(overlayDiv);
  }
}

// Display movie details

async function displayMovieDetails() {
  const movieID = window.location.search.split('=')[1];
  const movie = await fetchAPIData(`movie/${movieID}`);

  //Overlay for Background Image
  displayBackgroundImage('movie', movie.backdrop_path);

  console.log(movie);
  const genres = movie.genres;

  const div = document.createElement('div');
  div.innerHTML = `
  <div class="details-top">
          <div>
            <img
              src=${
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/original/${movie.poster_path}
              `
                  : '../images/no-image.jpg'
              }
              class="card-img-top"
              alt="${movie.title}"
            />
          </div>
          <div>
            <h2>${movie.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${Math.round(movie.vote_average)}
            </p>
            <p class="text-muted">Release Date: ${movie.release_date}</p>
            <p>
              ${movie.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${genres.map((genre) => `<li>${genre.name}</li>`).join('')}
            </ul>
            <a href="${
              movie.homepage
            }" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> $${
              movie.budget
            }</li>
            <li><span class="text-secondary">Revenue:</span> $${
              movie.revenue
            }</li>
            <li><span class="text-secondary">Runtime:</span> ${
              movie.runtime
            } minutes</li>
            <li><span class="text-secondary">Status:</span> ${movie.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${movie.production_companies
            .map(
              (company) => `<li>${company.name}, ${company.origin_country}</li>`
            )
            .join('')}</div>
        </div>`;

  document.querySelector('#movie-details').appendChild(div);
}

async function displayTvShowDetails() {
  const TVShowID = window.location.search.split('=')[1];
  const show = await fetchAPIData(`tv/${TVShowID}`);
  console.log(show);
  //Overlay for Background Image
  displayBackgroundImage('tv-show', show.backdrop_path);

  const genres = show.genres;

  const div = document.createElement('div');
  div.innerHTML = `
  <div class="details-top">
          <div>
            <img
              src=${
                show.poster_path
                  ? `https://image.tmdb.org/t/p/original/${show.poster_path}
              `
                  : '../images/no-image.jpg'
              }
              class="card-img-top"
              alt="${show.name}"
            />
          </div>
          <div>
            <h2>${show.name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${Math.round(show.vote_average)}
            </p>
            <p class="text-muted">Release Date: ${show.last_air_date}</p>
            <p>
              ${show.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${genres.map((genre) => `<li>${genre.name}</li>`).join('')}
            </ul>
            <a href="${
              show.homepage
            }" target="_blank" class="btn">Visit TV Show Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>TV Show Info</h2>
          <ul>
            <li><span class="text-secondary">Number of episodes:</span> ${
              show.number_of_episodes
            }</li>
            <li><span class="text-secondary">Last Episode to Air:</span> ${
              show.last_episode_to_air.name
            }
            <li><span class="text-secondary">Status:</span> ${show.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${show.production_companies
            .map(
              (company) => `<li>${company.name}, ${company.origin_country}</li>`
            )
            .join('')}</div>
        </div>`;

  document.querySelector('#show-details').appendChild(div);
}

//Fetch data from TMDB API
async function fetchAPIData(endpoint) {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;

  showSpinner();

  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
  );
  const data = await response.json();

  hideSpinner();

  return data;
}
//Make request to search
async function searchAPIData(endpoint) {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;

  showSpinner();

  const response = await fetch(
    `${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`
  );
  const data = await response.json();

  hideSpinner();

  return data;
}

function showSpinner() {
  spinner.classList.add('show');
}

function hideSpinner() {
  spinner.classList.remove('show');
}

// Init App
function init() {
  console.log(global.currentPage);
  higlightActiveLink();
  switch (global.currentPage) {
    case '/index.html':
    case '/':
      displaySlider();
      displayPopularMovies();
      break;
    case '/shows.html':
      displayPopularShows();
      break;
    case '/tv-details.html':
      displayTvShowDetails();

      break;
    case '/movie-details.html':
      displayMovieDetails();
      break;
    case '/search.html':
      search();
      break;
  }
}

// Display the slider

async function displaySlider() {
  const { results } = await fetchAPIData('movie/now_playing');
  console.log(results);
  results.forEach((result) => {
    const div = document.createElement('div');
    div.classList.add('swiper-slide');
    div.innerHTML = `
            <a href="movie-details.html?id=${result.id}">
              <img src="https://image.tmdb.org/t/p/w500${result.poster_path}" alt="${result.title}" />
            </a>
            <h4 class="swiper-rating">
              <i class="fas fa-star text-secondary"></i> ${result.vote_average} / 10
            </h4>`;

    document.querySelector('.swiper-wrapper').appendChild(div);
    initSwiper();
  });
}

async function search() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  global.search.type = urlParams.get('type');
  global.search.term = urlParams.get('search-term');

  if (global.search.term !== '' && global.search.term !== null) {
    //TODO
    const { results, total_pages, page, total_results } = await searchAPIData();
    console.log(results);

    global.search.page = page;
    global.search.totalPages = total_pages;
    global.search.totalResults = total_results;

    if (results.length === 0) {
      showAlert('No results found');
      return;
    }

    displaySearchResulsts(results);
    document.querySelector('#search-term').value = '';
  } else {
    showAlert('Please enter a search term');
  }
}

function displaySearchResulsts(results) {
  //Clear previous results

  document.querySelector('#search-results').innerHTML = '';
  document.querySelector('#search-results-heading').innerHTML = '';
  document.querySelector('#pagination').innerHTML = '';

  results.forEach((result) => {
    //Create DOM  elements for eaech result
    const card = document.createElement('div');
    const a = document.createElement('a');
    const img = document.createElement('img');
    const cardBody = document.createElement('div');
    const title = document.createElement('h5');
    const p = document.createElement('p');
    const small = document.createElement('small');

    //Add classes
    card.classList.add('card');
    img.classList.add('card-img-top');
    cardBody.classList.add('card-body');
    title.classList.add('card-title');
    p.classList.add('card-text');
    small.classList.add('text-muted');

    //Add attributes
    img.setAttribute('alt', `${result.title || result.name}`);

    //Add content from API
    a.setAttribute(
      'href',
      `${global.search.type}-details.html?id=${result.id}`
    );
    img.setAttribute(
      'src',
      result.poster_path
        ? `https://image.tmdb.org/t/p/original/${result.poster_path}
      `
        : '../images/no-image.jpg'
    );
    title.textContent = result.title || result.name;
    small.textContent = `Release: ${
      result.release_date || result.first_air_date
    }`;

    //Put the card together
    a.appendChild(img);
    p.appendChild(small);
    cardBody.appendChild(title);
    cardBody.appendChild(p);
    card.appendChild(a);
    card.appendChild(cardBody);

    document.querySelector(
      '#search-results-heading'
    ).innerHTML = `<h2>${results.length} of ${global.search.totalResults} Results for ${global.search.term}</h2>`;

    // Add the card to the DOM
    document.querySelector('#search-results').appendChild(card);
  });

  displayPagination();
}

//Create and display pagination for search
function displayPagination() {
  const div = document.createElement('div');
  div.classList.add('pagination');
  div.innerHTML = `<button class="btn btn-primary" id="prev">Prev</button>
 <button class="btn btn-primary" id="next">Next</button>
 <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>`;

  document.querySelector('#pagination').appendChild(div);

  //disable previous page if on search page
  if (global.search.page === 1) {
    document.querySelector('#prev').disabled = true;
  }
  //disable next button if on last page
  if (global.search.page === global.search.totalPages) {
    document.querySelector('#next').disabled = true;
  }

  //Next page
  document.querySelector('#next').addEventListener('click', async () => {
    global.search.page++;
    const { results, total_pages } = await searchAPIData();
    displaySearchResulsts(results);
  });

  //Previous page
  document.querySelector('#prev').addEventListener('click', async () => {
    global.search.page--;
    const { results, total_pages } = await searchAPIData();
    displaySearchResulsts(results);
  });
}

function showAlert(message, className = 'error') {
  const alertAl = document.createElement('div');
  alertAl.classList.add('alert', className);
  alertAl.appendChild(document.createTextNode(message));
  document.querySelector('#alert').appendChild(alertAl);

  setTimeout(() => alertAl.remove(), 3000);
}

function initSwiper() {
  const swiper = new Swiper('.swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 1,
      },
      700: {
        slidesPerView: 2,
      },
      900: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });
}
//Event Listeners
document.addEventListener('DOMContentLoaded', init);
