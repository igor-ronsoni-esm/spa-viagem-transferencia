export class HttpConnectorTimeoutError extends Error {
  constructor(public readonly url: string) {
    super(`Timeout ao chamar ${url}`);
    this.name = "HttpConnectorTimeoutError";
  }
}

export class HttpConnectorNetworkError extends Error {
  constructor(public readonly url: string) {
    super(`Falha de conexão ao chamar ${url}`);
    this.name = "HttpConnectorNetworkError";
  }
}

export class HttpConnectorResponseError extends Error {
  constructor(
    public readonly url: string,
    public readonly status: number,
    public readonly body: string,
  ) {
    super(`HTTP ${status} ao chamar ${url}`);
    this.name = "HttpConnectorResponseError";
  }
}
