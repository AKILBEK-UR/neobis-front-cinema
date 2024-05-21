let time = new Date();
const month = [
    "JANUARY",
    "FEBRUARY",
    "MARCH",
    "APRIL",
    "MAY",
    "JUNE",
    "JULY",
    "AUGUST",
    "SEPTEMBER",
    "OCTOBER",
    "NOVEMBER",
    "DECEMBER",
  ];
const API_KEY = "82dbc687-876f-4392-90bf-ddfcbd8e67c0";
const API_URL_PREMIERS = `https://kinopoiskapiunofficial.tech/api/v2.2/films/premieres?year=${time.getFullYear()}&month=${month[time.getMonth()]}`;
const API_URL_SEARCH ="https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";
const API_URL_RELEASES = `https://kinopoiskapiunofficial.tech/api/v2.1/films/releases?year=${time.getFullYear()}&month=${month[time.getMonth()]}`;
const API_URL_BESTS ="https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_POPULAR_MOVIES&page=1";
const API_URL_EXPECTED ="https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_AWAIT_FILMS";



//button handlings and listeners
const form = document.querySelector("form");
const search = document.querySelector(".header__search");
const releases = document.getElementById("releases");
const premiers = document.getElementById("premiers");
const top_expected = document.getElementById("top_expected");
const top_best = document.getElementById("top_best");



form.addEventListener("submit", (e) => {
  e.preventDefault();
  const SearchUrl = `${API_URL_SEARCH}${search.value}`;
  console.log(SearchUrl);
  if (search.value) {
    getMovies(SearchUrl);
    search.value = "";
  } else {
    alert("Please enter a movie name");
  }
});

releases.addEventListener("click", () => {
  getMovies(API_URL_RELEASES);
});

premiers.addEventListener("click", () => {
  getMovies(API_URL_PREMIERS);
});

top_expected.addEventListener("click", () => {
  getMovies(API_URL_EXPECTED);
});

top_best.addEventListener("click", () => {
  getMovies(API_URL_BESTS);
});

//functions to show movies
async function getMovies(url){      //fetchhing
    try {
        const resp = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
          },
        });
        if (!resp.ok) {
          throw new Error(`HTTP error! status: ${resp.status}`);
        }
        const respData = await resp.json();
        console.log(respData);
        displayMovies(respData);
        }catch (error){
        console.error("Failed to fetch movies:", error);
    }
}
function getColorByRate(vote) {
    if (vote >= 7) {
      return "green";
    } else if (vote > 5) {
      return "orange";
    } else {
      return "red";
    }
}
function displayMovies(data) {
    console.log(typeof data);
    const moviesEl = document.querySelector(".movies");
    // Очищаем предыдущие фильмы
    const movies = data.items || data.films || data.releases;
    document.querySelector(".movies").innerHTML = "";

    movies.forEach((movie) => {
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    const rating = movie.rating || movie.ratingImdb;
    movieEl.innerHTML = `
      <div class="movie__cover-inner">
        <img
          src="${movie.posterUrlPreview}"
          class="movie__cover"
          alt="${movie.nameRu}"
        />
        <div class="movie__cover--darkened"></div>
      </div>
      <div class="movie__info">
        <div class="movie__title">${movie.nameRu}</div>
        <div class="movie__category">${movie.genres.map(
          (genre) => ` ${genre.genre}`
        ).join(', ')}</div>
        ${
          rating ? 
          `<div class="movie__average movie__average--${getColorByRate(rating)}">
            ${rating}
          </div>` : ''
        }`;
    moviesEl.appendChild(movieEl);
  });
}
