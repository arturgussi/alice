export function sleep(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms));
}

export function getErrorMessage(e: unknown, defaultMessage: string) {
  if (e instanceof Error) return e.message;
  if (typeof e === 'string') return e;
  if (
    typeof e === 'object' &&
    e !== null &&
    'message' in e &&
    typeof e.message === 'string'
  ) {
    return e.message;
  }
  return defaultMessage;
}

import axios, { AxiosError } from 'axios';

// Interface para descrever a estrutura comum de respostas de erro da sua API
interface BackendErrorData {
  message?: string;
  error?: string;
  // Muitas APIs de validação retornam um objeto 'errors'
  errors?: Record<string, string[] | string>;
}

/**
 * Extrai de forma segura uma mensagem de erro de um valor 'unknown'.
 * Prioriza mensagens de erro da sua API de backend vindas de um AxiosError.
 *
 * @param e O erro capturado, tipado como unknown.
 * @param defaultMessage Uma mensagem padrão caso nenhuma mensagem específica seja encontrada.
 * @returns Uma string representando a mensagem de erro.
 */
export const extractApiErrorMessage = (
  e: unknown,
  defaultMessage = 'Ocorreu um erro inesperado. Por favor, tente novamente.',
): string => {
  // 1. Verifica se é um erro do Axios, que é o mais comum para chamadas de API
  if (axios.isAxiosError(e)) {
    const axiosError = e as AxiosError<BackendErrorData>; // Tipamos o 'data' da resposta
    const responseData = axiosError.response?.data;

    // Se a resposta do backend tiver um corpo (data) e for um objeto, tentamos extrair a mensagem dele
    if (responseData && typeof responseData === 'object') {
      // Tenta pegar a mensagem de campos comuns como 'message', 'error' ou um objeto 'errors'
      if (typeof responseData.message === 'string' && responseData.message) {
        return responseData.message;
      }
      if (typeof responseData.error === 'string' && responseData.error) {
        return responseData.error;
      }
      // Se houver um objeto de erros de validação, pega a primeira mensagem
      if (
        typeof responseData.errors === 'object' &&
        responseData.errors !== null
      ) {
        const firstErrorKey = Object.keys(responseData.errors)[0];
        if (firstErrorKey) {
          const firstErrorValue = responseData.errors[firstErrorKey];
          if (
            Array.isArray(firstErrorValue) &&
            typeof firstErrorValue[0] === 'string'
          ) {
            return firstErrorValue[0];
          }
          if (typeof firstErrorValue === 'string') {
            return firstErrorValue;
          }
        }
      }
    }
    // Se não encontrou uma mensagem específica no corpo da resposta, usa a mensagem do próprio AxiosError
    if (axiosError.message) {
      return axiosError.message;
    }
  }

  // 2. Se não for um erro do Axios, verifica se é uma instância de Error padrão do JavaScript
  if (e instanceof Error) {
    return e.message;
  }

  // 3. Se o erro for apenas uma string
  if (typeof e === 'string' && e.trim() !== '') {
    return e;
  }

  // 4. Como último recurso, retorna a mensagem padrão
  return defaultMessage;
};
