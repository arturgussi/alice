import { BE_API_KEY, BE_API_URL } from '@env';
import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosError,
} from 'axios';

const API_BASE_URL = BE_API_URL;
console.log('Endpoint', API_BASE_URL);

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor para adicionar o token de autenticação em cada requisição
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = BE_API_KEY;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Interceptor para tratamento de erros global (opcional, mas útil)
apiClient.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.error('API Error 401: Unauthorized. Logging out.');
    }
    return Promise.reject(error);
  },
);

export default apiClient;
