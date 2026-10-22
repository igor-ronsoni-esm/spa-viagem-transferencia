import { ResponseServerAction, throwError } from "../handling/response-server-action";

export async function fetchSafe<T>(fn: () => Promise<ResponseServerAction<T>>) {
  const response = await fn();
  if (!response.success) throwError(response.errorMessage);
  return response.data ?? null;
}