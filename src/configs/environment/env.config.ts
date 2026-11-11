import { ClientEnvConfig } from "./client-env.config";

export default class EnvConfiguration {
  private static instance: EnvConfiguration;

  public version: string;
  public environment: string;
  public secret: string;
  public sentry_host: string;

  public api_fastcrud_search: ClientEnvConfig;
  public api_viagem_transferencia: ClientEnvConfig;
  public api_empresas: ClientEnvConfig;
  public api_veiculos: ClientEnvConfig;

  public help: ClientEnvConfig;

  private constructor() {
    this.version = process.env.VERSION ?? "";
    this.environment = process.env.ENVIRONMENT ?? "";
    this.secret = process.env.AUTH_SECRET ?? "";
    this.sentry_host = process.env.SENTRY_DSN!!;
    this.help = { host: process.env.HELP_HOST ?? "" };
    
    this.api_fastcrud_search = {
      host: process.env.API_FASTCRUD_SEARCH_HOST ?? "",
      secret: process.env.API_FASTCRUD_SEARCH_SECRET ?? ""
    };
    
    this.api_viagem_transferencia = {
      host: process.env.API_VIAGEM_TRANSFERENCIA_HOST ?? "",
      secret: process.env.API_VIAGEM_TRANSFERENCIA_SECRET ?? "",
    };
    this.api_empresas = { host: process.env.API_EMPRESAS_HOST ?? "" };
    this.api_veiculos = { 
      host: process.env.API_VEICULOS_HOST ?? "",
      headers: {
        apiKey: process.env.API_VEICULOS_SECRET ?? ""
      }
    };
  }

  public static get(): EnvConfiguration {
    if (!EnvConfiguration.instance)
      EnvConfiguration.instance = new EnvConfiguration();
    return EnvConfiguration.instance;
  }

  public isDevelopment(): boolean {
    return (
      process.env.NODE_ENV !== "production" &&
      this.environment.trim().toLowerCase() === "development"
    );
  }
}
