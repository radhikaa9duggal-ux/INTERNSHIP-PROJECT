import { useState, useEffect } from 'react';
import { getGenresUrl } from '../services/tmdb';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export function useGenres() {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    if (!API_KEY) return;
    fetch(getGenresUrl(API_KEY))
      .then(r => r.json())
      .then(data => setGenres(data.genres || []))
      .catch(err => console.error('Failed to fetch genres', err));
  }, []);

  return genres;
}
