export interface ResponseServerAction<T> {
  data: T | null
  success: boolean
  errorMessage: string | null
}

export function success<T>(data: T): ResponseServerAction<T> {
  return {
    data: data,
    success: true,
    errorMessage: null
  }
}

export function error<T>(message: string): ResponseServerAction<T> {
  return {
    data: null,
    success: false,
    errorMessage: message
  }
}

export function throwError(message: string | null) {
  throw new Error(message ?? "Erro inesperado")
}
