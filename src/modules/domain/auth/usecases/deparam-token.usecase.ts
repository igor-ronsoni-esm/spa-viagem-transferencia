import { FormAuth } from "@components/auth/esm-auth";

export default interface DeparamTokenUseCase {
  execute(auths?: string): FormAuth[];
}