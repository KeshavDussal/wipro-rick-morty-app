import axios from 'axios';

// Base URL for Rick and Morty API
const BASE_URL = 'https://rickandmortyapi.com/api';

/**
 * Fetches a paginated list of characters from the Rick and Morty API.
 */
export const fetchCharacters = async (page: number, limit = 15) => {
  const response = await fetch(`${BASE_URL}/character?page=${page}`);
  const data = await response.json();

  return {
    results: data.results.slice(0, limit), // Apply client-side slicing for consistent result length
  };
};

/**
 * Fetches detailed information for a specific character by ID.
 */
export const fetchCharacterById = async (id: string) => {
  const response = await axios.get(`${BASE_URL}/character/${id}`);
  return response.data;
};
