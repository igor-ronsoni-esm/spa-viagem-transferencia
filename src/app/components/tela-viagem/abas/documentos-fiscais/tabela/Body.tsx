"use client";

import { DOCUMENTO_FISCAL_STATUS_CONFIG } from "@/src/app/constants";
import { cn } from "@/src/modules/utils/css.util";
import { dataHoraISO } from "@/src/modules/utils/data.util";
import { DocumentoFiscalSchemaOutput, StatusDocumentoFiscalEnum, TipoDocumentoFiscalEnum } from "@modules/domain/viagem/schemas/viagem.schema";
import { Clock, FileText, Printer, RefreshCw, RotateCcw, XCircle } from "lucide-react";
import { useContext } from "react";
import { ViagemContext } from "../../../context/ViagemContext";

type Props = {
  documento: DocumentoFiscalSchemaOutput
}

export default function TabelaBody({ documento }: Readonly<Props>) {
  const { modoEdicao } = useContext(ViagemContext);

  const isRejeitado = documento.status === StatusDocumentoFiscalEnum.REJEITADO;
  const isAutorizado = documento.status === StatusDocumentoFiscalEnum.AUTORIZADO;
  const isAguardando = documento.status === StatusDocumentoFiscalEnum.AGUARDANDO_AUTORIZACAO || documento.status === StatusDocumentoFiscalEnum.AGUARDANDO_CANCELAMENTO || documento.status === StatusDocumentoFiscalEnum.AGUARDANDO_ENCERRAMENTO;

  const isCiot = documento.tipo === TipoDocumentoFiscalEnum.CIOT;
  const isMDFE = documento.tipo === TipoDocumentoFiscalEnum.MDFE;
  const isVPO = documento.tipo === TipoDocumentoFiscalEnum.VPO;
  const isOutros = !isCiot && !isMDFE && !isVPO;

  const configStatus = DOCUMENTO_FISCAL_STATUS_CONFIG[documento.status] || DOCUMENTO_FISCAL_STATUS_CONFIG["DESCONHECIDO"];

  const handleCancelarDocumentoFiscal = () => {}
  const handleConsultarDocumentoFiscal = () => {}
  const handleReenviarAutorizacao = () => {}
  const handleImprimir = () => {}

  return (
    <tr
      className={cn(
        "border-b border-gray-50 last:border-0 hover:bg-gray-50/40 h-12 transition-colors",
        isRejeitado ? "bg-orange-50/10" : "",
      )}
    >
      {/* Coluna Documento */}
      <td className="px-3 py-2 text-left align-middle">
        <div className="flex items-center gap-1.5 h-full">
          <FileText
            size={16}
            strokeWidth={2}
            className={`shrink-0 ${isCiot ? "text-blue-500" : "text-purple-600"}`}
          />
          <span className="text-[10px] font-bold text-gray-800">
            {documento.tipo}
          </span>
        </div>
      </td>

      {/* Coluna Situação */}
      <td className="px-3 py-2 text-left align-middle">
        <div className="flex items-center h-full">
          <span
            className={cn(
              "px-1.5 py-0.5 rounded text-[8px] font-black uppercase inline-block whitespace-nowrap",
              configStatus.color,
              configStatus.text,
            )}
          >
            {configStatus.label}
          </span>
        </div>
      </td>

      {/* Coluna Número */}
      <td className="px-3 py-2 text-left align-middle text-[10px] font-semibold text-gray-700 font-mono">
        <div className="flex items-center h-full">
          {documento.numero}
        </div>
      </td>

      {/* Coluna Geração */}
      <td className="px-3 py-2 text-left align-middle text-[9px] font-semibold text-gray-500">
        <div className="flex items-center h-full">
          {dataHoraISO(new Date(documento.dataGeracao))}
        </div>
      </td>

      {/* Coluna Retorno */}
      <td className="px-3 py-2 text-left align-middle text-[9px] font-semibold text-gray-500">
        <div className="flex items-center h-full">
          {isAguardando ? (
            <span className="text-gray-400 italic flex items-center gap-1">
              <Clock size={12} strokeWidth={2} className="animate-pulse" />{" "}
              Processando...
            </span>
          ) : (
            dataHoraISO(new Date(documento.dataRetorno || documento.dataGeracao))
          )}
        </div>
      </td>

      {/* Coluna Ações */}
      <td className="px-3 py-2 text-right align-middle pr-4">
        <div className="flex items-center justify-end gap-2 h-full">
          {/* Ação Cancelar (quando Autorizado) */}
          {isAutorizado && (
            <button
              onClick={() => {
                if (!modoEdicao) {
                  alert(
                    "Para cancelar documentos, clique primeiro no botão 'EDITAR VIAGEM'.",
                  );
                  return;
                }
                handleCancelarDocumentoFiscal();
              }}
              className={cn(
                "group relative p-1 rounded transition-colors",
                !modoEdicao
                  ? "text-gray-300 opacity-40 cursor-not-allowed"
                  : "text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer",
              )}
              title={
                !modoEdicao
                  ? "Habilite a edição para cancelar"
                  : "Cancelar Documento"
              }
            >
              <XCircle size={16} strokeWidth={2} />
              <span className="pointer-events-none absolute right-0 bottom-full mb-1 bg-gray-900 text-white text-[8px] font-black py-0.5 px-1.5 rounded shadow-lg z-50 whitespace-nowrap hidden group-hover:block">
                {!modoEdicao
                  ? "Habilite a edição para cancelar"
                  : "Cancelar Documento"}
              </span>
            </button>
          )}

          {/* Ação Consultar Status (quando Aguardando Retorno / Pendente) */}
          {isAguardando && (
            <button
              onClick={() => handleConsultarDocumentoFiscal()}
              className="group relative p-1 hover:bg-blue-50 rounded text-blue-500 hover:text-blue-700 transition-colors cursor-pointer"
              title="Consultar Status"
            >
              <RefreshCw size={16} strokeWidth={2} />
              <span className="pointer-events-none absolute right-0 bottom-full mb-1 bg-gray-900 text-white text-[8px] font-black py-0.5 px-1.5 rounded shadow-lg z-50 whitespace-nowrap hidden group-hover:block">
                Consultar Status
              </span>
            </button>
          )}

          {/* Ação Reenviar Autorização (quando Rejeitado) */}
          {isRejeitado && (
            <button
              onClick={() => {
                if (!modoEdicao) {
                  alert(
                    "Para reenviar autorização, clique primeiro no botão 'EDITAR VIAGEM'.",
                  );
                  return;
                }
                handleReenviarAutorizacao();
              }}
              className={cn(
                "group relative p-1 rounded transition-colors",
                !modoEdicao
                  ? "text-gray-300 opacity-40 cursor-not-allowed"
                  : "text-purple-600 hover:text-purple-800 hover:bg-purple-50 cursor-pointer",
              )}
              title={
                !modoEdicao
                  ? "Habilite a edição para reenviar"
                  : "Reenviar Autorização"
              }
            >
              <RotateCcw size={16} strokeWidth={2} />
              <span className="pointer-events-none absolute right-0 bottom-full mb-1 bg-gray-900 text-white text-[8px] font-black py-0.5 px-1.5 rounded shadow-lg z-50 whitespace-nowrap hidden group-hover:block">
                {!modoEdicao
                  ? "Habilite a edição para reenviar"
                  : "Reenviar Autorização"}
              </span>
            </button>
          )}

          {/* Ação Observações */}
          {/* <button
            onClick={() => setSelectedDocForObs(doc)}
            className="group relative p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-primary transition-colors cursor-pointer"
            title="Observações"
          >
            <Eye size={16} strokeWidth={2} />
            <span className="pointer-events-none absolute right-0 bottom-full mb-1 bg-gray-900 text-white text-[8px] font-black py-0.5 px-1.5 rounded shadow-lg whitespace-nowrap z-50 hidden group-hover:block">
              Observações
            </span>
          </button> */}

          {/* Ação Imprimir (apenas para MDF-e) */}
          {isMDFE && (
            <button
              onClick={handleImprimir}
              className="group relative p-1 hover:bg-gray-100 rounded text-teal-600 hover:text-teal-800 transition-colors cursor-pointer"
              title="Imprimir"
            >
              <Printer size={16} strokeWidth={2} />
              <span className="pointer-events-none absolute right-0 bottom-full mb-1 bg-gray-900 text-white text-[8px] font-black py-0.5 px-1.5 rounded shadow-lg whitespace-nowrap z-50 hidden group-hover:block">
                Imprimir MDF-e (Salvar PDF)
              </span>
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
