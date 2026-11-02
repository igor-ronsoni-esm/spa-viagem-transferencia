export default interface AutenticacaoFastCrudUseCase {
  execute(): Promise<string>;
}