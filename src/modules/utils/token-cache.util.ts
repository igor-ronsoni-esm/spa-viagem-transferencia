export default class TokenCache {
  private token: string | null = null;
  private expiraEm = 0;

  constructor(
    private readonly gerar: () => string,
    private readonly ttlMs: number,
    private readonly margemMs = 5_000,
  ) {}

  obter(): string {
    const agora = Date.now();
    if (!this.token || agora >= this.expiraEm - this.margemMs) {
      this.token = this.gerar();
      this.expiraEm = agora + this.ttlMs;
    }
    return this.token;
  }
}