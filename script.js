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

const API_KEY = "187e8b82-d101-4fc5-b3b6-7bd07fdf5644";
const API_URL_PREMIERS = `https://kinopoiskapiunofficial.tech/api/v2.2/films/premieres?year=${time.getFullYear()}&month=${month[time.getMonth()]}`;
const API_URL_SEARCH ="https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";
const API_URL_RELEASES = `https://kinopoiskapiunofficial.tech/api/v2.1/films/releases?year=${time.getFullYear()}&month=${month[time.getMonth()]}&page=4`;
const API_URL_BESTS ="https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_POPULAR_MOVIES&page=1";
const API_URL_EXPECTED ="https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_AWAIT_FILMS&";


//button handlings and listeners
const form = document.querySelector("form");
const search = document.querySelector(".header__search");
const releases = document.getElementById("releases");
const premiers = document.getElementById("premiers");
const top_expected = document.getElementById("top_expected");
const top_best = document.getElementById("top_best");
const favoritesPageLink = document.getElementById("favorites");

// Default page is for best films
getMovies(API_URL_BESTS);


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

favoritesPageLink.addEventListener("click", (event) => {
  event.preventDefault();
  const favoriteMovies = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
  if (favoriteMovies.length > 0) {
    displayMovies({ films: favoriteMovies });
  } else {
    alert("No favorite movies found");
  }
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
    const moviesEl = document.querySelector(".movies");
    const favoriteMovies = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
    const movies = data.items || data.films || data.releases;

    document.querySelector(".movies").innerHTML = "";

    movies.forEach((movie) => {
    const isFavorite = favoriteMovies.some(

      (favoriteMovie) => {
        const movieId = movie.filmId || movie.kinopoiskId;
        const favoriteId = favoriteMovie.kinopoiskId || favoriteMovie.filmId;
        return movieId === favoriteId;
      }
    );
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    const rating = Number(movie.rating) || Number(movie.ratingImdb);
    const movieName = movie.nameRu || movie.nameEn;
    movieEl.innerHTML = `
      <div class="movie__cover-inner">
        <img
          src="${movie.posterUrlPreview}"
          class="movie__cover"
          alt="${movieName}"
        />
        <div class="movie__cover--darkened"></div>
      </div>
      <div class="movie__info">
        <div class="movie__title">
          ${movieName}
        </div>
        <div class="movie__category">
          <h3>${movie.genres.map((genre) => ` ${genre.genre}`).join(', ')}</h3>
        </div>
        <button  id="${movie.filmId || movie.kinopoiskId}" class="${isFavorite ? "favorite__heart-red" : "favorite__heart-white"}">
            <img src="./public/images/heart.svg" style="width:2rem;height:2rem;">
        </button>
        ${rating ? `<div class="movie__average movie__average--${getColorByRate(rating)}"> ${rating} </div>` : ''} 
      </div>`;
       
    moviesEl.appendChild(movieEl);

    const favoriteButton = movieEl.getElementsByClassName("favorite__heart-red")[0] || movieEl.getElementsByClassName("favorite__heart-white")[0];
    favoriteButton.addEventListener("click", (e) => {
      e.preventDefault();
      if (isFavorite) {
        console.log(movie)
        removeFavorite(movie.filmId || movie.kinopoiskId);
      } else {
        toggleFavorite(movie);
      }
      displayMovies(data);
});
  }); 
}

const toggleFavorite = (movie) => {
  console.log(movie);
  try {
    const favoriteMovies = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
    favoriteMovies.push(movie);

    // Save the updated favorite movies array back to localStorage
    localStorage.setItem("favoriteMovies", JSON.stringify(favoriteMovies));

    // Optionally update the displayed movies (assuming showMovies is defined elsewhere)
    displayMovies({ films: favoriteMovies });

    return favoriteMovies;
  } catch (error) {
    alert(`Error adding to favorites: ${error.message}`);
  }
};

function removeFavorite(id) {
  const favoriteMovies = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
  const updatedFavorites = favoriteMovies.filter(
    (movie) =>{ 
      const favoriteId = movie.filmId || movie.kinopoiskId;
      return  favoriteId !== id ;
    }
  );
  localStorage.setItem("favoriteMovies", JSON.stringify(updatedFavorites));
  console.log(updatedFavorites);
  displayMovies({ items: updatedFavorites });

  return updatedFavorites;
}

