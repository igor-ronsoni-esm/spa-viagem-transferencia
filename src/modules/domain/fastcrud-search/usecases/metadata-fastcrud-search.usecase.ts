export default interface MetadataFastcrudSearchUseCase {
  execute(key: string): Promise<unknown>;
}
