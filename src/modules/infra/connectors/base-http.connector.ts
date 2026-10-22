import {
  HttpConnectorNetworkError,
  HttpConnectorResponseError,
  HttpConnectorTimeoutError,
} from "./http-connector.errors";

interface HttpConnectorConfig {
  host: string;
  headers?: Record<string, string>;
  timeoutMs?: number;
}
const jwt = require("jsonwebtoken");

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RequestConfig = {
  body?: unknown,
  params?: Record<string, unknown>
  headers?: Record<string, unknown>
};

export default class BaseHttpConnector {
  private readonly host: string;
  private readonly headers: Record<string, string>;
  private readonly timeoutMs: number;

  constructor(config: HttpConnectorConfig) {
    this.host = config.host.replace(/\/$/, "");
    this.headers = config.headers ?? {};
    this.timeoutMs = config.timeoutMs ?? 15_000;
  }

  public get<T>(path: string, config: RequestConfig): Promise<T> {
    const { params, headers } = config;
    return this.request<T>("GET", path, params, undefined, headers);
  }

  public post<T>(path: string, config: RequestConfig): Promise<T> {
    const { body, headers } = config;
    return this.request<T>("POST", path, undefined, body, headers);
  }

  public put<T>(path: string, config: RequestConfig): Promise<T> {
    const { body, headers } = config;
    return this.request<T>("PUT", path, undefined, body, headers);
  }

    public patch<T>(path: string, config: RequestConfig): Promise<T> {
        const { body, headers } = config;
        return this.request<T>("PATCH", path, undefined, body, headers);
    }

  public delete<T>(path: string, config: RequestConfig): Promise<T> {
    const { headers } = config;
    return this.request<T>("DELETE", path, undefined, undefined, headers);
  }

  public static generateToken(secret: string, payload: Record<string, unknown>, expiresIn: number = 15_000): string { 
    return jwt.sign(payload, secret, { expiresIn });
  }

  private async request<T>(
    method: HttpMethod,
    path: string,
    params?: Record<string, unknown>,
    body?: unknown,
    headers?: Record<string, unknown>,
  ): Promise<T> {
    const url = this.montarURL(path, params);

    let response: Response;
    try {
      response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", ...this.headers, ...headers },
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: AbortSignal.timeout(this.timeoutMs),
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "TimeoutError") {
        throw new HttpConnectorTimeoutError(url);
      }
      throw new HttpConnectorNetworkError(url);
    }

    if (!response.ok) {
      const detalhe = await response.text().catch(() => "");
      throw new HttpConnectorResponseError(url, response.status, detalhe);
    }

    if (response.status === 204) return undefined as T;
    return response.json();
  }

  private montarURL(path: string, params?: Record<string, unknown>): string {
    const queryParams = new URLSearchParams();

    Object.entries(params ?? {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.set(key, String(value));
      }
    });

    const query = queryParams.toString();
    const caminho = path.startsWith("/") ? path : `/${path}`;
    return `${this.host}${caminho}${query ? `?${query}` : ""}`;
  }
}
