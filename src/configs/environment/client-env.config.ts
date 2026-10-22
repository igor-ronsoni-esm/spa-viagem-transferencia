import { ClientAuthConfig } from "./client-auth.config";
import { ClientHeadersConfig } from "./client-headers.config";

export interface ClientEnvConfig {
  host: string;
  port?: number;
  headers?: ClientHeadersConfig;
  auth?: ClientAuthConfig;
  enabled?: boolean;
  secret?: string;
}
