import axios from 'axios'

export const shlaAPI = axios.create({
  baseURL: 'https://rickandmortyapi.com/api',
});
