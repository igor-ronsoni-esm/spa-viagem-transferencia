import { ViagemSchema } from "./viagem.schema";

export const SalvarViagemSchema = ViagemSchema.omit({
  status: true,
  tipoViagem: true,
  tipoTransferencia: true,
  ocorrencias: true,
  rastreio: true,
  documentosFiscais: true,
});