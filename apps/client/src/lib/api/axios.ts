import axios from 'axios';
import type { AxiosError, AxiosResponse } from 'axios';
import { ErrorResponse } from './api.types';

// TypeScript now knows API_URL exists and is a string
const { API_URL } = process.env;

if (!API_URL) {
  throw new Error('API_URL is not defined in process.env');
}

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for consistent error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: AxiosError<ErrorResponse>) => {
    const message = error.response?.data?.message ?? 'An error occurred';
    throw new Error(message);
  },
);
