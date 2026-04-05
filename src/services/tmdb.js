// All /tmdb-api/* calls are proxied to https://api.themoviedb.org/3 by Vite
export const TMDB_BASE_URL = '/tmdb-api';
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';


export const getPopularMoviesUrl = (apiKey, page = 1) => 
  `${TMDB_BASE_URL}/movie/popular?api_key=${apiKey}&page=${page}`;

export const getSearchMoviesUrl = (query, apiKey, page = 1) => 
  `${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&api_key=${apiKey}&page=${page}`;

export const getMovieVideosUrl = (id, apiKey) => 
  `${TMDB_BASE_URL}/movie/${id}/videos?api_key=${apiKey}`;

export const getMovieCreditsUrl = (id, apiKey) => 
  `${TMDB_BASE_URL}/movie/${id}/credits?api_key=${apiKey}`;

export const getMovieSimilarUrl = (id, apiKey) => 
  `${TMDB_BASE_URL}/movie/${id}/similar?api_key=${apiKey}`;

export const getGenresUrl = (apiKey) => 
  `${TMDB_BASE_URL}/genre/movie/list?api_key=${apiKey}`;

export const getImageUrl = (path) => {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}${path}`;
};

export const MOVIE_GENRES = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western"
};
