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
  erro?: string;
  message?: string;
  error?: string;
  errors?: Record<string, string[] | string>;
}

/**
 * Extrai de forma segura uma mensagem de erro de um valor 'unknown'.
 * Prioriza o campo 'erro' da resposta da API, conforme especificado.
 *
 * @param e O erro capturado, tipado como unknown.
 * @param defaultMessage Uma mensagem padrão caso nenhuma mensagem específica seja encontrada.
 * @returns Uma string representando a mensagem de erro.
 */
export const extractApiErrorMessage = (
  e: unknown,
  defaultMessage = 'Ocorreu um erro inesperado. Por favor, tente novamente.',
): string => {
  // 1. Verifica se é um erro do Axios (erro de API)
  if (axios.isAxiosError(e)) {
    // Tipamos a 'data' da resposta de erro com nossa interface BackendErrorData
    const axiosError = e as AxiosError<BackendErrorData>;
    const responseData = axiosError.response?.data;

    // Se a resposta do backend tiver um corpo (data) e for um objeto,
    // tentamos extrair a mensagem dele
    if (responseData && typeof responseData === 'object') {
      // PRIORIDADE 1: Verifica o campo "erro" que sua API envia
      if (
        typeof responseData.erro === 'string' &&
        responseData.erro.trim() !== ''
      ) {
        return responseData.erro;
      }

      // Fallbacks para outros formatos de erro comuns (se sua API os usar em outros endpoints)
      if (
        typeof responseData.message === 'string' &&
        responseData.message.trim() !== ''
      ) {
        return responseData.message;
      }
      if (
        typeof responseData.error === 'string' &&
        responseData.error.trim() !== ''
      ) {
        return responseData.error;
      }
    }

    // Se não encontrou uma mensagem específica no corpo da resposta,
    // usa a mensagem do próprio objeto de erro do Axios
    if (axiosError.message) {
      return axiosError.message;
    }
  }

  // 2. Se não for um erro do Axios, verifica se é um erro padrão do JavaScript
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
