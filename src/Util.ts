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
