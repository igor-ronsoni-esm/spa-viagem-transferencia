import EnvConfiguration from "@/src/configs/environment/env.config";
import AutenticacaoFastCrudUseCase from "../usecases/autenticacao-fastcrud.usecase";

export default class  AutenticacaoFastCrudService implements AutenticacaoFastCrudUseCase {
  execute(): Promise<string> {
    const secret = EnvConfiguration.get().api_fastcrud_search.secret;
    return Promise.resolve(secret);
  }
}