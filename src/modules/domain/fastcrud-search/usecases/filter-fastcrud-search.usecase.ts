export type FiltroFastcrudSearchEntity = {
  field: string;
  operation: string;
  value: string;
};

export type RequestFiltroFastcrudSearchEntity = {
  searchKey: string;
  filterKey: string;
  filters: FiltroFastcrudSearchEntity[];
  connectionKey?: string;
};

export default interface FilterFastcrudSearchUseCase {
  execute(body: RequestFiltroFastcrudSearchEntity): Promise<unknown>;
}
