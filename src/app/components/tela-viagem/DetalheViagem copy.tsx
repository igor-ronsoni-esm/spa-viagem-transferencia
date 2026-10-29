/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Trip,
  TripStatus,
  Agency,
  Line,
  CTe,
  Driver,
  Vehicle,
  FiscalDocument,
  ControleCarga,
  Empresa,
} from "../types";
import {
  STATUS_CONFIG,
  TRIP_TYPES,
  SECTION_TYPES,
  COLORS,
  FISCAL_STATUS_CONFIG,
} from "../constants";
import { cn } from "../lib/utils";
import {
  X,
  Save,
  Play,
  Clipboard,
  Truck,
  Users,
  Plus,
  Search,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  FileCheck,
  Clock,
  FileText,
  Trash2,
  MapPin,
  ClipboardList,
  Eye,
  RefreshCw,
  XCircle,
  AlertTriangle,
  Printer,
  CheckCircle,
  Edit,
  PlusCircle,
  CheckSquare,
  ListFilter,
  Info,
  FolderPlus,
  ListPlus,
  Check,
  Send,
  RotateCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { logisticsService } from "../services/logisticsService";

interface TripDetailProps {
  trip: Trip;
  onClose: () => void;
  onUpdate: () => void;
  lines: Line[];
  drivers: Driver[];
  vehicles: Vehicle[];
  agencies?: Agency[];
  selectedCompany?: Empresa;
}

const getNormalizeStatus = (status: string) => {
  if (!status) return 'PENDENTE';
  const s = status.toUpperCase();
  if (s.includes('AUTORIZADO') || s.includes('SUCESSO')) return 'AUTORIZADO';
  if (s.includes('REJEITADO') || s.includes('REJEITADA')) return 'REJEITADO';
  if (s.includes('CANCELADO') || s.includes('CANCELADA')) return 'CANCELADO';
  return 'PENDENTE';
};

const formatDateTime = (dateStr?: string) => {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return "-";
  }
};

const AVAILABLE_TRECHOS = [
  { codigo: 'TR-1001', origem: 'São Paulo (SP)', destino: 'Campinas (SP)' },
  { codigo: 'TR-1002', origem: 'Campinas (SP)', destino: 'Ribeirão Preto (SP)' },
  { codigo: 'TR-1003', origem: 'São Paulo (SP)', destino: 'Curitiba (PR)' },
  { codigo: 'TR-1004', origem: 'Curitiba (PR)', destino: 'Florianópolis (SC)' },
  { codigo: 'TR-1005', origem: 'Porto Alegre (RS)', destino: 'Chapecó (SC)' },
  { codigo: 'TR-1006', origem: 'Rio de Janeiro (RJ)', destino: 'Belo Horizonte (MG)' },
  { codigo: 'TR-1007', origem: 'São Paulo (SP)', destino: 'Belo Horizonte (MG)' },
];

export function TripDetail({
  trip: initialTrip,
  onClose,
  onUpdate,
  lines,
  drivers,
  vehicles,
  agencies = [],
  selectedCompany,
}: TripDetailProps) {
  const [trip, setTrip] = useState<Trip>(initialTrip);
  const [loading, setLoading] = useState(false);
  const [controleKey, setControleKey] = useState("");
  const [activeTab, setActiveTab] = useState<
    "content" | "ctes" | "ocorrencias" | "documentos"
  >("content");
  const [driverSearch, setDriverSearch] = useState("");
  const [vehicleSearch, setVehicleSearch] = useState("");
  const [showTrackingInfo, setShowTrackingInfo] = useState(false);

  // Modals
  const [isLineModalOpen, setIsLineModalOpen] = useState(false);
  const [lineSearch, setLineSearch] = useState("");
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  
  // Fiscal Documents states
  const [loadingText, setLoadingText] = useState("Processando...");
  const [selectedDocForObs, setSelectedDocForObs] = useState<FiscalDocument | null>(null);
  const [isFillCiotModalOpen, setIsFillCiotModalOpen] = useState(false);
  const [ciotNumero, setCiotNumero] = useState("");
  const [ciotCodigoVerificador, setCiotCodigoVerificador] = useState("");
  const [ciotValorFrete, setCiotValorFrete] = useState("");
  const [ciotValorPedagio, setCiotValorPedagio] = useState("");
  const [ciotStatus, setCiotStatus] = useState<FiscalDocument["status"]>("AUTORIZADO");
  const [ciotObservacao, setCiotObservacao] = useState("");
  const [ciotMotivoRejeicao, setCiotMotivoRejeicao] = useState("");
  const [isCiotSuccessModalOpen, setIsCiotSuccessModalOpen] = useState(false);

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [availableControles, setAvailableControles] = useState<ControleCarga[]>(
    [],
  );
  const [importFilter, setImportFilter] = useState<"line" | "all">("line");
  const [selectedImportIds, setSelectedImportIds] = useState<Set<string>>(
    new Set(),
  );
  const [expandedControles, setExpandedControles] = useState<Set<string>>(
    new Set(),
  );
  const [expandedImportControles, setExpandedImportControles] = useState<Set<string>>(
    new Set(),
  );
  const [markedControleIds, setMarkedControleIds] = useState<Set<string>>(
    new Set(),
  );
  const [importModalSearch, setImportModalSearch] = useState("");
  const [docFeedback, setDocFeedback] = useState<{
    message: string;
    type: "success" | "info";
  } | null>(null);

  useEffect(() => {
    if (docFeedback) {
      const timer = setTimeout(() => setDocFeedback(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [docFeedback]);

  // Sync trip state when initialTrip changes (master change)
  const [isEditing, setIsEditing] = useState<boolean>(initialTrip.codigo === 0 && !initialTrip.isPreGenerated);
  const [isSaveSuccessModalOpen, setIsSaveSuccessModalOpen] = useState(false);

  useEffect(() => {
    const d = initialTrip.dataViagem ? initialTrip.dataViagem.split('T')[0] : new Date().toISOString().split('T')[0];
    setTrip({
      ...initialTrip,
      dataViagem: d
    });
    setIsEditing(initialTrip.codigo === 0 && !initialTrip.isPreGenerated);
  }, [initialTrip]);

  const maskCpf = (cpf: string) => {
    if (!cpf) return "";
    const clean = cpf.replace(/\D/g, "");
    if (clean.length !== 11) return cpf;
    return `***.***.${clean.substring(6, 9)}-**`;
  };

  // Fields are locked if pre-generated
  const isLocked = trip.isPreGenerated;
  const isEditable = !["INICIADA", "CANCELADA", "FINALIZADA"].includes(
    trip.status,
  );
  const canEditFields = isEditable && isEditing;

  const handleSave = async () => {
    try {
      setLoadingText("Salvando alterações...");
      setLoading(true);
      // Wait to simulate database server save time as requested by user
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Ensure codigo is number if provided as string
      const updates = {
        ...trip,
        codigo: trip.codigo ? Number(trip.codigo) : undefined,
      };
      await logisticsService.updateTrip(trip.id, updates);
      onUpdate();
      setIsSaveSuccessModalOpen(true);
    } catch (e) {
      console.error(e);
      alert("Erro ao salvar viagem");
    } finally {
      setLoading(false);
    }
  };

  const handleGerarViagem = async () => {
    try {
      setLoading(true);
      // Flow: MDF-e creation
      const mdfe = await logisticsService.gerarMDFE(trip.id);
      const newStatus: TripStatus = "PRONTA";
      const updates = {
        status: newStatus,
        documentosFiscais: [...trip.documentosFiscais, mdfe],
        ocorrencias: [
          ...trip.ocorrencias,
          { tipo: "PRONTA", dataGeracao: new Date().toISOString() },
        ],
      };

      setTrip((prev) => ({
        ...prev,
        ...updates,
      }));
      await logisticsService.updateTrip(trip.id, updates);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Ação 1: Adicionar todos os documentos que pertencem à configuração da linha
  const handleAddAllLineDocuments = async () => {
    if (!canEditFields) {
      alert("Para adicionar documentos, clique primeiro no botão 'EDITAR VIAGEM'.");
      return;
    }
    try {
      setLoadingText("Buscando documentos da configuração da linha...");
      setLoading(true);
      const allControles = await logisticsService.getAvailableControles(selectedCompany?.codigo || trip.empresaCodigo);

      let origSigla = trip.agenciaOrigemSigla;
      let destSigla = trip.agenciaDestinoSigla;
      if ((!origSigla || !destSigla) && trip.nomeLinha) {
        const parts = trip.nomeLinha.split("x").map((p) => p.trim());
        if (parts.length === 2) {
          if (!origSigla) origSigla = parts[0].split(" ")[0].trim();
          if (!destSigla) destSigla = parts[1].split(" ")[0].split("-")[0].trim();
        }
      }

      // Filtrar os documentos da empresa que pertencem à configuração da viagem (origem -> destino)
      let matchingControles = allControles.filter(
        (c) =>
          (origSigla ? c.origemSigla === origSigla : true) &&
          (destSigla ? c.destinoSigla === destSigla : true),
      );

      // Se nenhum controle for encontrado na empresa para esta rota específica, gerar amostra realista
      if (matchingControles.length === 0 && origSigla && destSigla) {
        const generated = await logisticsService.addSampleControleForRoute(origSigla, destSigla);
        matchingControles = [generated];
      }

      const currentChaves = new Set((trip.controlesCarga || []).map((c) => c.chave));
      const currentIds = new Set((trip.controlesCarga || []).map((c) => c.id));
      const newControles = matchingControles.filter(
        (c) => !currentChaves.has(c.chave) && !currentIds.has(c.id),
      );

      if (newControles.length === 0) {
        if (matchingControles.length === 0) {
          setDocFeedback({
            type: "info",
            message: `Nenhum documento encontrado na empresa para a rota ${origSigla || "origem"} ➔ ${destSigla || "destino"}.`,
          });
        } else {
          setDocFeedback({
            type: "info",
            message: `Todos os ${matchingControles.length} documento(s) da configuração da linha já estão vinculados à viagem.`,
          });
        }
        return;
      }

      const newCtes = newControles.flatMap((c) => c.ctes || []);
      const updatedControles = [...(trip.controlesCarga || []), ...newControles];
      const currentCteChaves = new Set((trip.ctes || []).map((cte) => cte.chave));
      const actuallyNewCtes = newCtes.filter((cte) => !currentCteChaves.has(cte.chave));
      const updatedCtes = [...(trip.ctes || []), ...actuallyNewCtes];

      setTrip((prev) => ({
        ...prev,
        controlesCarga: updatedControles,
        ctes: updatedCtes,
      }));

      if (trip.id) {
        try {
          await logisticsService.updateTrip(trip.id, {
            controlesCarga: updatedControles,
            ctes: updatedCtes,
          });
        } catch (err) {
          console.warn("Could not persist trip updates:", err);
        }
      }

      setDocFeedback({
        type: "success",
        message: `${newControles.length} documento(s) (${actuallyNewCtes.length} CT-es) pertencentes à configuração da linha (${origSigla || "Origem"} ➔ ${destSigla || "Destino"}) vinculados com sucesso!`,
      });
    } catch (e) {
      console.error(e);
      alert("Erro ao buscar documentos da linha.");
    } finally {
      setLoading(false);
    }
  };

  // Ação 2: Abrir modal para escolher documentos
  const openImportModal = async () => {
    if (!canEditFields) {
      alert("Para escolher documentos, clique primeiro no botão 'EDITAR VIAGEM'.");
      return;
    }
    try {
      setLoadingText("Carregando documentos da empresa...");
      setLoading(true);
      const controles = await logisticsService.getAvailableControles(selectedCompany?.codigo || trip.empresaCodigo);
      setAvailableControles(controles);
      setImportFilter("line"); // Inicia mostrando apenas da configuração da linha
      setSelectedImportIds(new Set());
      setImportModalSearch("");
      setIsImportModalOpen(true);
    } catch (e) {
      console.error(e);
      alert("Erro ao carregar documentos da empresa.");
    } finally {
      setLoading(false);
    }
  };

  const handleImportSelected = async () => {
    if (!canEditFields || selectedImportIds.size === 0) return;
    const toImport = availableControles.filter(
      (c) => selectedImportIds.has(c.id) || selectedImportIds.has(c.chave),
    );
    const currentChaves = new Set((trip.controlesCarga || []).map((c) => c.chave));
    const currentIds = new Set((trip.controlesCarga || []).map((c) => c.id));
    const actuallyNew = toImport.filter(
      (c) => !currentChaves.has(c.chave) && !currentIds.has(c.id),
    );

    if (actuallyNew.length === 0) {
      setIsImportModalOpen(false);
      setSelectedImportIds(new Set());
      setDocFeedback({
        type: "info",
        message: "Os documentos selecionados já estão vinculados à viagem.",
      });
      return;
    }

    const newCtes = actuallyNew.flatMap((c) => c.ctes || []);
    const updatedControles = [...(trip.controlesCarga || []), ...actuallyNew];
    const currentCteChaves = new Set((trip.ctes || []).map((cte) => cte.chave));
    const actuallyNewCtes = newCtes.filter((cte) => !currentCteChaves.has(cte.chave));
    const updatedCtes = [...(trip.ctes || []), ...actuallyNewCtes];

    setTrip((prev) => ({
      ...prev,
      controlesCarga: updatedControles,
      ctes: updatedCtes,
    }));

    if (trip.id) {
      try {
        await logisticsService.updateTrip(trip.id, {
          controlesCarga: updatedControles,
          ctes: updatedCtes,
        });
      } catch (err) {
        console.warn("Could not persist trip updates:", err);
      }
    }

    setIsImportModalOpen(false);
    setSelectedImportIds(new Set());

    setDocFeedback({
      type: "success",
      message: `${actuallyNew.length} documento(s) (${actuallyNewCtes.length} CT-es) incluído(s) na viagem com sucesso!`,
    });
  };

  // Ação 3: Remover documentos marcados da viagem
  const handleRemoveMarkedControles = async () => {
    if (!canEditFields) {
      alert("Para remover documentos, clique primeiro no botão 'EDITAR VIAGEM'.");
      return;
    }
    if (markedControleIds.size === 0) return;

    const count = markedControleIds.size;
    const remainingControles = (trip.controlesCarga || []).filter(
      (c) => !markedControleIds.has(c.id) && !markedControleIds.has(c.chave),
    );
    const remainingCtes = remainingControles.flatMap((c) => c.ctes || []);

    setTrip((prev) => ({
      ...prev,
      controlesCarga: remainingControles,
      ctes: remainingCtes,
    }));

    if (trip.id) {
      try {
        await logisticsService.updateTrip(trip.id, {
          controlesCarga: remainingControles,
          ctes: remainingCtes,
        });
      } catch (err) {
        console.warn("Could not persist trip updates:", err);
      }
    }

    setMarkedControleIds(new Set());
    setDocFeedback({
      type: "info",
      message: `${count} documento(s) marcado(s) removido(s) da viagem com sucesso.`,
    });
  };

  const handleRemoveSingleControle = async (cId?: string, cChave?: string) => {
    if (!canEditFields) return;

    const remainingControles = (trip.controlesCarga || []).filter(
      (c) => (cId ? c.id !== cId : true) && (cChave ? c.chave !== cChave : true),
    );
    const remainingCtes = remainingControles.flatMap((c) => c.ctes || []);

    setTrip((prev) => ({
      ...prev,
      controlesCarga: remainingControles,
      ctes: remainingCtes,
    }));

    if (trip.id) {
      try {
        await logisticsService.updateTrip(trip.id, {
          controlesCarga: remainingControles,
          ctes: remainingCtes,
        });
      } catch (err) {
        console.warn("Could not persist trip updates:", err);
      }
    }

    setMarkedControleIds((prev) => {
      const next = new Set(prev);
      if (cId) next.delete(cId);
      if (cChave) next.delete(cChave);
      return next;
    });

    setDocFeedback({
      type: "info",
      message: "Documento de carga removido da viagem com sucesso.",
    });
  };

  const toggleMarkControle = (idOrKey: string) => {
    if (!canEditFields) return;
    setMarkedControleIds((prev) => {
      const next = new Set(prev);
      if (next.has(idOrKey)) next.delete(idOrKey);
      else next.add(idOrKey);
      return next;
    });
  };

  const toggleMarkAllControles = () => {
    if (!canEditFields) return;
    const list = trip.controlesCarga || [];
    if (markedControleIds.size === list.length && list.length > 0) {
      setMarkedControleIds(new Set());
    } else {
      const allKeys = new Set(list.map((c) => c.id || c.chave));
      setMarkedControleIds(allKeys);
    }
  };

  const performAddControle = async () => {
    if (!canEditFields || !controleKey) return;
    try {
      setLoading(true);
      const controle = await logisticsService.getControleByChave(controleKey.trim());
      if (controle) {
        if (
          (trip.controlesCarga || []).find((c) => c.chave === controle.chave)
        ) {
          setDocFeedback({
            type: "info",
            message: "Este controle de carga já está vinculado à viagem.",
          });
        } else {
          setTrip((prev) => ({
            ...prev,
            controlesCarga: [...(prev.controlesCarga || []), controle],
            ctes: [...(prev.ctes || []), ...(controle.ctes || [])],
          }));
          setControleKey("");
          setDocFeedback({
            type: "success",
            message: `Controle ${controle.chave} vinculado com sucesso!`,
          });
        }
      } else {
        alert("Controle de carga não encontrado no sistema.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const addControleByKey = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      performAddControle();
    }
  };

  const toggleImportSelection = (idOrKey: string) => {
    const next = new Set(selectedImportIds);
    if (next.has(idOrKey)) next.delete(idOrKey);
    else next.add(idOrKey);
    setSelectedImportIds(next);
  };

  const toggleControleExpansion = (idOrKey: string) => {
    const next = new Set(expandedControles);
    if (next.has(idOrKey)) next.delete(idOrKey);
    else next.add(idOrKey);
    setExpandedControles(next);
  };

  const toggleImportExpansion = (idOrKey: string) => {
    const next = new Set(expandedImportControles);
    if (next.has(idOrKey)) next.delete(idOrKey);
    else next.add(idOrKey);
    setExpandedImportControles(next);
  };

  const filteredImportControles = availableControles.filter((c) => {
    let origSigla = trip.agenciaOrigemSigla;
    let destSigla = trip.agenciaDestinoSigla;
    if ((!origSigla || !destSigla) && trip.nomeLinha) {
      const parts = trip.nomeLinha.split("x").map((p) => p.trim());
      if (parts.length === 2) {
        if (!origSigla) origSigla = parts[0].split(" ")[0].trim();
        if (!destSigla) destSigla = parts[1].split(" ")[0].split("-")[0].trim();
      }
    }

    if (importFilter === "line") {
      const isLineMatch =
        (origSigla ? c.origemSigla === origSigla : true) &&
        (destSigla ? c.destinoSigla === destSigla : true);
      if (!isLineMatch) return false;
    }

    if (importModalSearch.trim()) {
      const term = importModalSearch.toLowerCase();
      const matchesChave = (c.chave || "").toLowerCase().includes(term);
      const matchesOrigem = (c.origemSigla || "").toLowerCase().includes(term);
      const matchesDestino = (c.destinoSigla || "").toLowerCase().includes(term);
      const matchesCtes = (c.ctes || []).some(
        (cte) =>
          (cte.chave || "").toLowerCase().includes(term) ||
          (cte.remetente || "").toLowerCase().includes(term) ||
          (cte.destinatario || "").toLowerCase().includes(term),
      );
      if (!matchesChave && !matchesOrigem && !matchesDestino && !matchesCtes) {
        return false;
      }
    }

    return true;
  });

  const toggleSelectAllFiltered = () => {
    const currentChaves = new Set((trip.controlesCarga || []).map((c) => c.chave));
    const currentIds = new Set((trip.controlesCarga || []).map((c) => c.id));
    const selectable = filteredImportControles.filter(
      (c) => !currentChaves.has(c.chave) && !currentIds.has(c.id),
    );
    const selectableKeys = selectable.map((c) => c.id || c.chave);

    const allSelected =
      selectableKeys.length > 0 &&
      selectableKeys.every((key) => selectedImportIds.has(key));

    if (allSelected) {
      setSelectedImportIds((prev) => {
        const next = new Set(prev);
        selectableKeys.forEach((k) => next.delete(k));
        return next;
      });
    } else {
      setSelectedImportIds((prev) => {
        const next = new Set(prev);
        selectableKeys.forEach((k) => next.add(k));
        return next;
      });
    }
  };

  const hasMdfe = trip.documentosFiscais.some(
    (doc) => doc.tipo === "MDF-E" && doc.status === "AUTORIZADO",
  );
  const hasCiot = trip.documentosFiscais.some(
    (doc) => doc.tipo === "CIOT" && doc.status === "AUTORIZADO",
  );
  const canStartManually = hasMdfe && hasCiot;

  // Ação: Reenviar Solicitação de Documentação
  const handleResendFiscalDocumentation = async () => {
    if (!canEditFields) {
      alert("Para reenviar solicitação de documentos, clique primeiro no botão 'EDITAR VIAGEM'.");
      return;
    }
    if (trip.documentosFiscais.length === 0) {
      alert("Não há documentos fiscais cadastrados nesta viagem para reenviar solicitação.");
      return;
    }
    try {
      setLoadingText("Reenviando solicitação de documentação fiscal...");
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1100));

      const nowIso = new Date().toISOString();
      const updatedDocs = trip.documentosFiscais.map((doc) => ({
        ...doc,
        status: 'AUTORIZADO' as const,
        dataGeracao: nowIso,
        dataAtualizacao: nowIso,
        dataRetorno: nowIso,
        observacao: `Solicitação reenviada e autorizada com sucesso em ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}.`,
        motivosRejeicao: [],
      }));

      const newOccurrences = [
        ...trip.ocorrencias,
        {
          tipo: `DOCUMENTAÇÃO FISCAL REENVIADA (${updatedDocs.length} documento(s))`,
          dataGeracao: nowIso,
        },
      ];

      setTrip((prev) => ({
        ...prev,
        documentosFiscais: updatedDocs,
        ocorrencias: newOccurrences,
      }));
      await logisticsService.updateTrip(trip.id, {
        documentosFiscais: updatedDocs,
        ocorrencias: newOccurrences,
      });
      alert(`Solicitação de documentação fiscal reenviada com sucesso para a viagem!`);
    } catch (e) {
      console.error(e);
      alert("Erro ao reenviar solicitação de documentação.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSingleDoc = async (docToCancel: FiscalDocument) => {
    if (!canEditFields) {
      alert("Para cancelar documentos, clique primeiro no botão 'EDITAR VIAGEM'.");
      return;
    }
    if (docToCancel.tipo === 'CIOT') {
      const hasCancelledMdfe = trip.documentosFiscais.some(
        d => d.tipo === 'MDF-E' && (d.status === 'CANCELADO' || d.status === 'CANCELADA')
      );
      if (!hasCancelledMdfe) {
        alert("O cancelamento do CIOT somente é permitido se o status do MDF-e estiver CANCELADO.");
        return;
      }
    }
    if (!confirm(`Deseja realmente solicitar o cancelamento deste ${docToCancel.tipo}?`)) return;

    try {
      setLoading(true);
      const nowIso = new Date().toISOString();
      const updatedDocs = trip.documentosFiscais.map(d => {
        if (d.numero === docToCancel.numero && d.tipo === docToCancel.tipo) {
          return {
            ...d,
            status: 'CANCELADO' as const,
            dataAtualizacao: nowIso,
            dataRetorno: nowIso,
            observacao: `Documento cancelado pelo usuário em ${new Date().toLocaleDateString('pt-BR')}.`,
            motivosRejeicao: []
          };
        }
        return d;
      });

      setTrip(prev => ({
        ...prev,
        documentosFiscais: updatedDocs,
      }));
      await logisticsService.updateTrip(trip.id, { documentosFiscais: updatedDocs });
      alert(`${docToCancel.tipo} cancelado com sucesso.`);
    } catch (e) {
      console.error(e);
      alert("Erro ao cancelar o documento.");
    } finally {
      setLoading(false);
    }
  };

  const handleConsultSingleStatus = async (docToConsult: FiscalDocument) => {
    try {
      setLoadingText("Consultando status na SEFAZ/ANTT...");
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 900));
      
      const isPending = docToConsult.status === 'PENDENTE' || docToConsult.status === 'AGUARDANDO RETORNO' || docToConsult.status === 'AGUARDANDO AUTORIZACAO';
      let nextStatus = docToConsult.status;
      let nextObs = docToConsult.observacao;
      let nextReasons = docToConsult.motivosRejeicao || [];
      
      if (isPending) {
        const isSuccess = Math.random() > 0.2;
        if (isSuccess) {
          nextStatus = 'AUTORIZADO';
          nextObs = `${docToConsult.tipo} autorizado com sucesso após consulta SEFAZ.`;
          nextReasons = [];
        } else {
          nextStatus = 'REJEITADO';
          nextObs = 'Rejeitado pelo órgão regulador após consulta.';
          nextReasons = ['Inconsistência nos dados cadastrais informados'];
        }
      } else {
        alert(`Consulta finalizada! O documento ${docToConsult.tipo} nº ${docToConsult.numero || ''} está com a situação ${docToConsult.status}.`);
        return;
      }
      
      const nowIso = new Date().toISOString();
      const updatedDocs = trip.documentosFiscais.map(d => {
        if (d.numero === docToConsult.numero && d.tipo === docToConsult.tipo) {
          return {
            ...d,
            status: nextStatus as any,
            dataAtualizacao: nowIso,
            dataRetorno: nowIso,
            observacao: nextObs,
            motivosRejeicao: nextReasons,
          };
        }
        return d;
      });
      
      setTrip(prev => ({
        ...prev,
        documentosFiscais: updatedDocs,
      }));
      await logisticsService.updateTrip(trip.id, { documentosFiscais: updatedDocs });
      alert(`Consulta finalizada! Situação atualizada do ${docToConsult.tipo}: ${nextStatus}`);
    } catch (e) {
      console.error(e);
      alert("Erro ao consultar situação do documento.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendSingleAuth = async (docToResend: FiscalDocument) => {
    if (!canEditFields) {
      alert("Para reenviar autorização, clique primeiro no botão 'EDITAR VIAGEM'.");
      return;
    }
    try {
      setLoadingText("Reenviando autorização para o documento...");
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const nowIso = new Date().toISOString();
      const updatedDocs = trip.documentosFiscais.map(d => {
        if (d.numero === docToResend.numero && d.tipo === docToResend.tipo) {
          return {
            ...d,
            status: 'AUTORIZADO' as const,
            dataGeracao: nowIso,
            dataAtualizacao: nowIso,
            dataRetorno: nowIso,
            observacao: `Autorização reenviada e aprovada com sucesso em ${new Date().toLocaleDateString('pt-BR')}.`,
            motivosRejeicao: []
          };
        }
        return d;
      });

      const newOccurrences = [
        ...trip.ocorrencias,
        {
          tipo: `AUTORIZAÇÃO FISCAL REENVIADA (${docToResend.tipo} nº ${docToResend.numero || ''})`,
          dataGeracao: nowIso,
        },
      ];

      setTrip(prev => ({
        ...prev,
        documentosFiscais: updatedDocs,
        ocorrencias: newOccurrences,
      }));
      await logisticsService.updateTrip(trip.id, {
        documentosFiscais: updatedDocs,
        ocorrencias: newOccurrences,
      });
      alert(`Autorização reenviada com sucesso para o documento ${docToResend.tipo}!`);
    } catch (e) {
      console.error(e);
      alert("Erro ao reenviar autorização.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDocument = async (tipo: 'CIOT' | 'MDF-E', isRejectedCase: boolean = false) => {
    try {
      if (tipo === 'MDF-E') {
        setLoadingText("gerando mdfe...");
      } else {
        setLoadingText("Processando...");
      }
      setLoading(true);
      // Artificial delay to make loading with "gerando mdfe..." fully visible and immersive
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const responseDoc = tipo === 'CIOT' 
        ? await logisticsService.gerarCIOT(trip.id)
        : await logisticsService.gerarMDFE(trip.id);
      
      // Enrich doc with standard attributes
      const numero = Math.floor(100000 + Math.random() * 900000).toString();
      const reasons = isRejectedCase ? [
        `Rejeição SEFAZ: Código de barramento inválido de placa`,
        `Divergência cadastral cadastrada no RNTRC do transportador: ${trip.motoristas[0]?.nome || 'Sem Motorista'}`
      ] : [];

      const enrichedDoc: FiscalDocument = {
        tipo,
        status: isRejectedCase ? 'REJEITADO' : 'AUTORIZADO',
        numero,
        dataGeracao: new Date().toISOString(),
        dataAtualizacao: new Date().toISOString(),
        dataRetorno: new Date().toISOString(),
        observacao: isRejectedCase 
          ? 'Rejeição na transmissão de lote SEFAZ.' 
          : `${tipo} emitido e autorizado com sucesso.`,
        motivosRejeicao: reasons
      };

      const updatedDocs = [...trip.documentosFiscais, enrichedDoc];

      setTrip((prev) => ({
        ...prev,
        documentosFiscais: updatedDocs,
      }));
      await logisticsService.updateTrip(trip.id, { documentosFiscais: updatedDocs });
      
      alert(`${tipo} gerado com sucesso! Número do Documento: ${numero}`);
    } catch (e) {
      console.error(e);
      alert(`Erro ao gerar ${tipo}.`);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintMdfe = (doc: FiscalDocument) => {
    const accessKey = `35260524193512${doc.numero}000122580010000001231585931892`;
    const lineInfo = trip.linha ? `${trip.linha.codigo} - ${trip.linha.nome}` : "-";
    const driverInfo = trip.motoristas && trip.motoristas.length > 0 
      ? trip.motoristas.map(m => `${m.nome} (CPF: ${m.cpf})`).join(", ") 
      : "-";
    const vehicleInfo = trip.veiculo ? `${trip.veiculo.marcaModelo} (Placa: ${trip.veiculo.placa})` : "-";

    // Open a beautifully styled print view of DAMDFE
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Por favor, permita popups para imprimir o DAMDFE.");
      return;
    }
    
    printWindow.document.write(`
      <html>
        <head>
          <title>DAMDFE - Manifesto Eletrônico de Documentos Fiscais nº ${doc.numero}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @media print {
              body { padding: 0; margin: 0; background: white; }
              .no-print { display: none !important; }
            }
          </style>
        </head>
        <body class="bg-gray-50 font-sans p-6 text-gray-900 leading-normal">
          <div class="max-w-4xl mx-auto bg-white border-2 border-black p-5 space-y-4">
            <!-- Header Print Trigger -->
            <div class="no-print flex justify-between items-center bg-blue-50 border border-blue-200 p-3 rounded-lg mb-4 select-none">
              <span class="text-xs font-bold text-blue-800 flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Visualização de Impressão do DAMDFE (Manifesto de Viagem)
              </span>
              <button onclick="window.print()" class="px-4 py-1.5 bg-blue-600 text-white font-extrabold text-xs rounded shadow hover:bg-blue-700 transition-all cursor-pointer">
                Imprimir DAMDFE / Salvar em PDF
              </button>
            </div>

            <!-- DAMDFE Header Grid -->
            <div class="grid grid-cols-12 border border-black divide-x divide-black text-center">
              <div class="col-span-4 p-3 flex flex-col justify-center items-center">
                <p class="font-extrabold text-sm tracking-wider uppercase text-gray-800">EMISSOR DO MANIFESTO</p>
                <p class="font-black text-lg text-blue-900">${trip.agenciaOrigemSigla || 'TRANSPORTES S.A.'}</p>
                <p class="text-[9px] text-gray-500 font-mono">Agência Integrada de Cargas</p>
              </div>
              <div class="col-span-4 p-3 flex flex-col justify-center items-center">
                <p class="font-black text-sm uppercase">DAMDFE</p>
                <p class="text-[9px] text-gray-600">Documento Auxiliar do Manifesto Eletrônico de Documentos Fiscais</p>
                <p class="font-extrabold text-sm mt-1.5">NÚMERO: ${doc.numero}</p>
                <p class="text-[10px] uppercase font-bold text-gray-500">SÉRIE: 1 | VIA ÚNICA</p>
              </div>
              <div class="col-span-4 p-3 text-left space-y-1">
                <p class="text-[8px] font-black uppercase text-gray-500">CHAVE DE ACESSO PARA CONSULTA SEFAZ</p>
                <div class="bg-gray-100 p-1.5 text-center font-mono text-[9px] border border-gray-300 break-all leading-tight">
                  ${accessKey.replace(/(.{4})/g, "$1 ")}
                </div>
                <div class="text-[8px] text-gray-400 mt-1 text-center font-mono">Consulte em www.mdf-e.fazenda.gov.br</div>
              </div>
            </div>

            <!-- Informações do Manifesto -->
            <div class="border border-black p-3 space-y-2 text-left">
              <h3 class="font-black text-[10px] border-b border-black pb-1 uppercase tracking-wider">Detalhamento Técnico da Viagem</h3>
              <div class="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <span class="font-bold text-gray-700 block">Rota / Linha de Viagem</span>
                  <span>${lineInfo}</span>
                </div>
                <div>
                  <span class="font-bold text-gray-700 block">Agência de Origem</span>
                  <span>${trip.agenciaOrigemSigla || '-'} - ${trip.linha?.origem || 'Origem'}</span>
                </div>
                <div>
                  <span class="font-bold text-gray-700 block">Agência de Destino</span>
                  <span>${trip.agenciaDestinoSigla || '-'} - ${trip.linha?.destino || 'Destino'}</span>
                </div>
              </div>
            </div>

            <div class="border border-black p-3 space-y-2 text-left">
              <h3 class="font-black text-[10px] border-b border-black pb-1 uppercase tracking-wider">Veículo Trator e Condutores Vinculados</h3>
              <div class="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p class="mb-1"><span class="font-bold text-gray-700">Cavalo Mecânico (Placa):</span> ${vehicleInfo}</p>
                  <p><span class="font-bold text-gray-700">Situação Cadastral:</span> AUTORIZADO (SEFAZ REGULAR)</p>
                </div>
                <div>
                  <p class="mb-1"><span class="font-bold text-gray-700">Motorista(s) Operador(es):</span> ${driverInfo}</p>
                  <p><span class="font-bold text-gray-700">Data Homologação:</span> ${new Date(doc.dataGeracao).toLocaleString('pt-BR')}</p>
                </div>
              </div>
            </div>

            <!-- Documentos de Carga -->
            <div class="border border-black p-3 space-y-2 text-left">
              <h3 class="font-black text-[10px] border-b border-black pb-1 uppercase tracking-wider">Documentos de Carga Acoplados (CT-e)</h3>
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="font-bold border-b border-black">
                    <th class="py-1">Chave Eletrônica CT-e</th>
                    <th class="py-1">Unidade</th>
                    <th class="py-1 text-center">Peso Bruto (Kg)</th>
                    <th class="py-1 text-right">Valor Frete</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  ${(trip.controlesCarga || []).map(c => `
                    <tr>
                      <td class="py-1.5 font-mono text-[10 px] text-gray-800">${c.chave}</td>
                      <td class="py-1.5">${c.origemSigla} &rarr; ${c.destinoSigla}</td>
                      <td class="py-1.5 text-center font-semibold">${c.pesoKg || '120.00'} Kg</td>
                      <td class="py-1.5 text-right font-bold text-blue-900">R$ ${c.valorFrete || '450,00'}</td>
                    </tr>
                  `).join("") || `
                    <tr>
                      <td colspan="4" class="py-3 text-center text-gray-400 italic font-medium">Nenhum controle de carga fiscal vinculado diretamente a este MDF-e.</td>
                    </tr>
                  `}
                </tbody>
              </table>
            </div>

            <!-- Observações Fiscais -->
            <div class="border border-black p-3 space-y-1.5 text-xs text-left">
              <h3 class="font-black text-[10px] border-b border-black pb-1 uppercase tracking-wider">Observações do Fisco / Emissor</h3>
              <p class="text-[11px] leading-relaxed text-gray-600 font-medium">
                DAMDFE impresso nos termos da regulamentação nacional de trânsito e tributos aplicáveis ao modal rodotransporte. 
                Protocolo de Validação Eletrônica: ${Math.floor(100000000000000 + Math.random() * 900000000000000)}.
                Status do MDF-e: ${doc.status} | Emitente ID: ${trip.id}.
                ${doc.observacao || "Transporte em rota comercial regular de suprimentos de cargas fracionadas."}
              </p>
            </div>

            <!-- Footer Signatures -->
            <div class="grid grid-cols-2 gap-8 pt-12 select-none">
              <div class="border-t border-black text-center pt-1.5 text-xs">
                <p class="font-bold text-gray-800">Assinatura Certificada do Emitente</p>
                <p class="text-[10px] text-gray-400">Logística de Despacho de Cargas</p>
              </div>
              <div class="border-t border-black text-center pt-1.5 text-xs">
                <p class="font-bold text-gray-800">Comprovante de Recebimento / SEFAZ</p>
                <p class="text-[10px] text-gray-400">Órgão Regulador Estadual</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();

    // Trigger direct fake PDF download
    try {
      const pdfText = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.27 841.89] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 500 >>
stream
BT
/F1 12 Tf
70 800 Td
(MANIFESTO ELETRONICO DE DOCUMENTOS FISCAIS (MDF-E)) Tj
70 785 Td
(NUMERO DO DOCUMENTO: ${doc.numero}) Tj
70 770 Td
(CHAVE DE ACESSO: ${accessKey}) Tj
70 755 Td
(SITUACAO EMISSAO: ${doc.status}) Tj
70 740 Td
(ROTA COMERCIAL: ${trip.agenciaOrigemSigla || '-'} PARA ${trip.agenciaDestinoSigla || '-'}) Tj
70 725 Td
(VEICULO: ${trip.veiculo?.marcaModelo || '-'} Placa: ${trip.veiculo?.placa || '-'}) Tj
70 710 Td
(CONDUTOR DE CARGA: ${driverInfo}) Tj
70 680 Td
(RESUMO CARGA VINCULADA:) Tj
70 665 Td
(Linha Associada: ${lineInfo}) Tj
70 650 Td
(Quantidade de Controles de Carga: ${(trip.controlesCarga || []).length}) Tj
70 620 Td
(PROTOCOLO SEFAZ DE AUTORIZACAO: 13526002938172) Tj
70 590 Td
(Observacoes Gerais: ${doc.observacao || "-"}) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000241 00000 n 
0000000791 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
871
%%EOF`;
      const blob = new Blob([pdfText], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `DAMDFE_N_${doc.numero}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Erro ao simular download de PDF:", e);
    }
  };

  const handleSaveManualCiot = async () => {
    if (!ciotNumero.trim()) {
      alert("Por favor, preencha o número do CIOT.");
      return;
    }

    try {
      setLoadingText("salvando ciot...");
      setLoading(true);
      // Simulate API process time for 1.8 seconds.
      await new Promise((resolve) => setTimeout(resolve, 1800));

      const reasons = ciotStatus === 'REJEITADO' 
        ? ciotMotivoRejeicao.split(',').map(s => s.trim()).filter(Boolean)
        : [];
      
      if (ciotStatus === 'REJEITADO' && reasons.length === 0) {
        reasons.push(ciotMotivoRejeicao.trim() || 'Divergência cadastral na validação junto ao órgão regulador.');
      }

      const descObs = `Cod. Verificador: ${ciotCodigoVerificador || '-'} | R$ Frete: R$ ${ciotValorFrete || '0,00'} | R$ Pedágio: R$ ${ciotValorPedagio || '0,00'}${ciotObservacao ? ' | Obs: ' + ciotObservacao : ''}`;

      const manualCiot: FiscalDocument = {
        tipo: 'CIOT',
        status: ciotStatus,
        numero: ciotNumero.trim(),
        dataGeracao: new Date().toISOString(),
        dataAtualizacao: new Date().toISOString(),
        dataRetorno: ciotStatus !== 'PENDENTE' ? new Date().toISOString() : undefined,
        observacao: descObs,
        motivosRejeicao: reasons
      };

      const updatedDocs = [...trip.documentosFiscais, manualCiot];

      setTrip((prev) => ({
        ...prev,
        documentosFiscais: updatedDocs,
      }));
      await logisticsService.updateTrip(trip.id, { documentosFiscais: updatedDocs });

      // Clean form state variables
      setCiotNumero("");
      setCiotCodigoVerificador("");
      setCiotValorFrete("");
      setCiotValorPedagio("");
      setCiotStatus("AUTORIZADO");
      setCiotObservacao("");
      setCiotMotivoRejeicao("");
      setIsFillCiotModalOpen(false);
      
      // Trigger Success modal trigger state
      setIsCiotSuccessModalOpen(true);
    } catch (e) {
      console.error(e);
      alert("Erro ao preencher CIOT.");
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async () => {
    if (!canStartManually) {
      alert(
        "Para iniciar a viagem manualmente, é necessário que o MDF-e e o CIOT estejam autorizados.",
      );
      return;
    }
    if (!confirm("Deseja realmente iniciar esta viagem manualmente?")) return;
    try {
      setLoading(true);
      await logisticsService.startViagem(trip.id);
      setTrip((prev) => ({ ...prev, status: "INICIADA" }));
      await logisticsService.updateTrip(trip.id, { status: "INICIADA" });
      onUpdate();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erro ao iniciar viagem");
    } finally {
      setLoading(false);
    }
  };

  const handleResetTrip = async () => {
    if (
      !confirm(
        "Aviso: Esta ação limpará todas as vinculações de veículos, motoristas, manifestos (MDF-e/CIOT) e controles de carga desta viagem, arquivando os dados anteriores no banco de dados e preparando a viagem para uma nova geração com as configurações padrão originais.\n\nDeseja prosseguir com o reset da viagem?"
      )
    ) {
      return;
    }

    try {
      setLoadingText("Resetando viagem...");
      setLoading(true);
      const updatedTrip = await logisticsService.resetTrip(trip.id);
      setTrip(updatedTrip);
      setIsEditing(false); // Voltar para visualização comum pós reset
      onUpdate();
      alert("Sucesso!\n\nA viagem foi limpa e resetada com sucesso. Os dados anteriores foram salvos no banco de dados (MongoDB) simulado!");
    } catch (e) {
      console.error(e);
      alert(e instanceof Error ? e.message : "Erro ao resetar a viagem.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsCancelConfirmOpen(true);
  };

  const handleDeleteCreatedTrip = handleCancel;

  const handleConfirmCancel = async () => {
    try {
      setLoading(true);
      const isNewTrip = initialTrip.codigo === 0 && !initialTrip.isPreGenerated;
      if (isNewTrip) {
        await logisticsService.deleteTrip(trip.id);
        setIsCancelConfirmOpen(false);
        onUpdate();
        onClose();
      } else {
        const d = initialTrip.dataViagem ? initialTrip.dataViagem.split('T')[0] : new Date().toISOString().split('T')[0];
        setTrip({
          ...initialTrip,
          dataViagem: d
        });
        setIsEditing(false);
        setIsCancelConfirmOpen(false);
      }
    } catch (e) {
      console.error(e);
      alert("Erro ao processar o cancelamento");
    } finally {
      setLoading(false);
    }
  };

  const toggleDriver = (driver: Driver) => {
    const exists = trip.motoristas.find((d) => d.id === driver.id);
    if (exists) {
      setTrip((prev) => ({
        ...prev,
        motoristas: prev.motoristas.filter((d) => d.id !== driver.id),
      }));
    } else {
      setTrip((prev) => ({
        ...prev,
        motoristas: [
          ...prev.motoristas,
          { ...driver, isPrincipal: prev.motoristas.length === 0 },
        ],
      }));
    }
  };

  const setPrincipalDriver = (driverId: string) => {
    setTrip((prev) => ({
      ...prev,
      motoristas: prev.motoristas.map((d) => ({
        ...d,
        isPrincipal: d.id === driverId,
      })),
    }));
  };

  // Grouping CTes by destination
  const groupedCtes = trip.ctes.reduce(
    (acc, cte) => {
      acc[cte.destinoSigla] = acc[cte.destinoSigla] || [];
      acc[cte.destinoSigla].push(cte);
      return acc;
    },
    {} as Record<string, CTe[]>,
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative">
      {/* Header */}
      <div className="bg-primary p-3 text-white flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <Clipboard className="w-5 h-5" />
          <div>
            <h2 className="font-bold text-base leading-tight">
              {trip.codigo && trip.codigo !== 0 ? `#${trip.codigo} - ` : ""}
              {trip.nomeLinha || "Nova Viagem"}
            </h2>
            <p className="text-[10px] text-white/60">
              Código:{" "}
              {trip.codigo && trip.codigo !== 0
                ? trip.codigo
                : "Ainda não gerada"}{" "}
              •{" "}
              {trip.status === "PRE_VIAGEM"
                ? "PRÉ-VIAGEM"
                : trip.status.toUpperCase()}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Action Buttons & Tabs Header */}
      <div className="bg-gray-50 border-b border-gray-100 px-4 py-2 flex flex-col gap-2 shrink-0">
        {/* Ações (Acima das abas) */}
        <div className="flex items-center justify-end gap-1.5 flex-wrap">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-md text-[10px] font-bold hover:bg-green-700 disabled:opacity-50 cursor-pointer uppercase shadow-xs"
              >
                <Save className="w-3.5 h-3.5" /> SALVAR
              </button>
              <button
                onClick={() => setIsCancelConfirmOpen(true)}
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-500 text-white rounded-md text-[10px] font-bold hover:bg-gray-600 disabled:opacity-50 cursor-pointer uppercase shadow-xs"
              >
                <X className="w-3.5 h-3.5" /> CANCELAR
              </button>
            </>
          ) : (
            <>
              {isEditable && (
                <button
                  onClick={() => setIsEditing(true)}
                  disabled={loading}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-md text-[10px] font-bold hover:bg-blue-700 disabled:opacity-50 cursor-pointer uppercase shadow-xs"
                >
                  <Edit className="w-3.5 h-3.5" /> EDITAR VIAGEM
                </button>
              )}

              {isEditable && (
                <button
                  onClick={handleGerarViagem}
                  disabled={loading || !trip.codigo}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold transition-all cursor-pointer uppercase shadow-xs",
                    trip.codigo
                      ? "bg-primary text-white hover:opacity-90"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed",
                  )}
                >
                  <Play className="w-3.5 h-3.5" /> GERAR VIAGEM
                </button>
              )}

              {isEditable && trip.codigo !== undefined && trip.codigo !== 0 && (
                <button
                  onClick={handleResetTrip}
                  disabled={loading}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-[10px] font-bold disabled:opacity-50 cursor-pointer uppercase transition-all shadow-xs"
                  title="Resetar todos os dados adicionais da viagem e reiniciar com as configurações padrões"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> RESETAR VIAGEM
                </button>
              )}

              {(trip.status === "PRONTA" || trip.status === "REJEITADA") && trip.isPreGenerated && (
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-md text-[10px] font-bold hover:bg-red-700 disabled:opacity-50 cursor-pointer uppercase shadow-xs"
                >
                  <X className="w-3.5 h-3.5" /> CANCELAR VIAGEM
                </button>
              )}

              {isEditable && !trip.isPreGenerated && trip.codigo !== 0 && (
                <button
                  onClick={handleDeleteCreatedTrip}
                  disabled={loading}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-md text-[10px] font-bold hover:bg-red-700 disabled:opacity-50 cursor-pointer uppercase shadow-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" /> CANCELAR VIAGEM
                </button>
              )}
            </>
          )}

          {trip.status === "PRONTA" && !isEditing && (
            <button
              onClick={handleStart}
              disabled={loading || !canStartManually}
              title={
                !canStartManually
                  ? "Aguardando autorização do MDF-e e CIOT"
                  : "Iniciar viagem"
              }
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold transition-all cursor-pointer uppercase shadow-xs",
                canStartManually
                  ? "bg-purple-600 text-white hover:opacity-90"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed",
              )}
            >
              <Play className="w-3.5 h-3.5" /> INICIAR VIAGEM MANUALMENTE
            </button>
          )}
        </div>

        {/* Abas de Navegação (Abaixo das ações) */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-1 border-t border-gray-200/50">
          {["content", "ctes", "ocorrencias", "documentos"].map((tab) => {
            const isTabDisabled = tab === "ctes" && trip.tipoTrecho === "Vazio";
            return (
              <button
                key={tab}
                disabled={isTabDisabled}
                onClick={() => !isTabDisabled && setActiveTab(tab as any)}
                className={cn(
                  "px-3 py-1.5 text-[10px] font-bold rounded-md transition-all capitalize cursor-pointer",
                  activeTab === tab
                    ? "bg-primary text-white shadow-xs"
                    : "text-gray-500 hover:bg-gray-200",
                  isTabDisabled &&
                    "opacity-40 cursor-not-allowed hover:bg-transparent",
                )}
              >
                {tab === "content"
                  ? "Dados Gerais"
                  : tab === "ctes"
                    ? "Documentos da Viagem"
                    : tab === "documentos"
                      ? "Documentos Fiscais"
                      : tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#fcfcfc]">
        {activeTab === "content" && (
          <div className="space-y-6">
            {/* Secao 1: Dados Basicos */}
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
                <Clipboard className="w-4 h-4 text-primary" />
                <h3 className="text-xs font-black text-gray-800 uppercase tracking-wider">
                  Dados Básicos da Viagem
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 mb-0.5 uppercase tracking-wider">
                    Código Viagem
                  </label>
                  <input
                    type="number"
                    disabled={true}
                    tabIndex={-1}
                    value={trip.codigo || 0}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-1.5 text-xs outline-none disabled:bg-gray-100 cursor-not-allowed font-bold text-gray-400 select-none pointer-events-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-0.5 uppercase tracking-wider">
                    Data da Viagem
                  </label>
                  <input
                    type="date"
                    disabled={!canEditFields}
                    tabIndex={canEditFields ? undefined : -1}
                    value={trip.dataViagem || ""}
                    onChange={(e) =>
                      setTrip((prev) => ({
                        ...prev,
                        dataViagem: e.target.value,
                      }))
                    }
                    className={cn(
                      "w-full border border-gray-200 rounded-lg p-1.5 text-xs focus:ring-2 focus:ring-primary/20 outline-none font-medium transition-all",
                      canEditFields
                        ? "bg-white text-gray-850 cursor-text"
                        : "bg-gray-50 text-gray-500 cursor-not-allowed select-none pointer-events-none"
                    )}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-0.5 uppercase tracking-wider">
                    Tipo de Viagem
                  </label>
                  <select
                    disabled={isLocked || !canEditFields}
                    value={
                      trip.tipoViagem === "Vazio" ? "Vazio" : "Transferência"
                    }
                    onChange={(e) => {
                      const val = e.target.value as any;
                      setTrip((prev) => ({
                        ...prev,
                        tipoViagem: val === "Vazio" ? "Vazio" : "Normal",
                        tipoTrecho: val === "Vazio" ? "Vazio" : "Transferencia",
                      }));
                    }}
                    className={cn(
                      "w-full border border-gray-200 rounded-lg p-1.5 text-xs focus:ring-2 focus:ring-primary/20 outline-none font-medium transition-all",
                      canEditFields && !isLocked
                        ? "bg-white text-gray-800 cursor-pointer"
                        : "bg-gray-50 text-gray-500 cursor-not-allowed"
                    )}
                  >
                    <option value="Transferência">Transferência</option>
                    <option value="Vazio">Vazio</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-0.5 uppercase tracking-wider">
                    Tipo Transferência
                  </label>
                  <select
                    disabled={isLocked || !canEditFields}
                    value={trip.tipoTransferencia || (trip.tipoViagem === "Extra" ? "Extra" : "Escala")}
                    onChange={(e) => {
                      const val = e.target.value as "Escala" | "Extra";
                      setTrip((prev) => ({
                        ...prev,
                        tipoTransferencia: val,
                        tipoViagem: val === "Extra" ? "Extra" : "Normal",
                        extraTipo: val === "Extra" ? (prev.extraTipo || "") : "",
                      }));
                    }}
                    className={cn(
                      "w-full border border-gray-200 rounded-lg p-1.5 text-xs focus:ring-2 focus:ring-primary/20 outline-none font-medium transition-all",
                      canEditFields && !isLocked
                        ? "bg-white text-gray-800 cursor-pointer"
                        : "bg-gray-50 text-gray-500 cursor-not-allowed select-none pointer-events-none"
                    )}
                  >
                    <option value="Escala">Escala</option>
                    <option value="Extra">Extra</option>
                  </select>
                </div>
              </div>

              {/* Extra Tipo Conditional Field */}
              {(trip.tipoTransferencia === "Extra" || trip.tipoViagem === "Extra") && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-primary mb-0.5 uppercase tracking-wider flex items-center gap-1.5">
                      Extra Tipo
                      <span className="text-[9px] font-medium text-gray-400 normal-case">(motivo da viagem extra)</span>
                    </label>
                    <select
                      disabled={isLocked || !canEditFields}
                      value={trip.extraTipo || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setTrip((prev) => ({
                          ...prev,
                          extraTipo: val,
                        }));
                      }}
                      className={cn(
                        "w-full border rounded-lg p-1.5 text-xs focus:ring-2 outline-none font-medium transition-all",
                        canEditFields && !isLocked
                          ? "bg-white border-primary/40 text-gray-800 cursor-pointer focus:ring-primary/20"
                          : "bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed select-none pointer-events-none"
                      )}
                    >
                      <option value="">Selecione o motivo...</option>
                      <option value="Demanda Excedente">Demanda Excedente</option>
                      <option value="Devolução de Veículo">Devolução de Veículo</option>
                      <option value="Outros">Outros</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Secao 2: Dados da Linha de Transferencia */}
            <div className="bg-white rounded-xl border border-gray-100 p-3.5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-gray-50">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <h3 className="text-xs font-black text-gray-800 uppercase tracking-wider">
                    Linha de Transferência e Trecho
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  {trip.codigoLinha && (
                    <button
                      type="button"
                      onClick={() => setShowTrackingInfo(!showTrackingInfo)}
                      className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer bg-primary/5 px-2 py-0.5 rounded-md"
                    >
                      {showTrackingInfo ? "Ocultar Rastreio" : "Ver Rastreio e Rota"}
                    </button>
                  )}
                  <span className="text-[9px] text-gray-400 italic">
                    *Clique no código para alterar a linha
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 mb-0.5 uppercase tracking-wider">
                    Código de Linha
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly={true}
                      tabIndex={canEditFields ? undefined : -1}
                      value={trip.codigoLinha || ""}
                      onClick={() => canEditFields && setIsLineModalOpen(true)}
                      placeholder="Selecionar linha..."
                      className={cn(
                        "w-full rounded-lg p-1.5 pr-8 text-xs focus:ring-2 focus:ring-primary/20 outline-none transition-all select-none",
                        canEditFields
                          ? "bg-white border border-primary/20 hover:border-primary/50 text-primary font-bold cursor-pointer"
                          : "bg-gray-100 border border-gray-200 text-gray-500 font-medium cursor-not-allowed pointer-events-none"
                      )}
                    />
                    <Search className={cn("w-3.5 h-3.5 absolute right-2.5 top-2.5 pointer-events-none", canEditFields ? "text-primary" : "text-gray-400")} />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-gray-400 mb-0.5 uppercase tracking-wider">
                    Descrição da Linha
                  </label>
                  <input
                    type="text"
                    disabled={true}
                    tabIndex={-1}
                    value={trip.descricaoLinha || trip.nomeLinha || ""}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-1.5 text-xs outline-none disabled:bg-gray-100 text-gray-600 font-medium select-none pointer-events-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 mb-0.5 uppercase tracking-wider">
                    Trecho da Linha
                  </label>
                  {canEditFields ? (
                    (() => {
                      const hasLineSelected = Boolean(trip.codigoLinha || trip.nomeLinha);
                      return (
                        <select
                          value={trip.codigoTrecho || ""}
                          disabled={!hasLineSelected}
                          onChange={(e) => {
                            const sel = AVAILABLE_TRECHOS.find(t => t.codigo === e.target.value);
                            if (sel) {
                              setTrip(prev => ({
                                ...prev,
                                codigoTrecho: sel.codigo,
                                origemTrecho: sel.origem,
                                destinoTrecho: sel.destino,
                              }));
                            } else if (!e.target.value) {
                              setTrip(prev => ({
                                ...prev,
                                codigoTrecho: "",
                                origemTrecho: "",
                                destinoTrecho: "",
                              }));
                            }
                          }}
                          className={cn(
                            "w-full rounded-lg p-1.5 text-xs outline-none transition-all",
                            hasLineSelected
                              ? "bg-white border border-primary/30 text-gray-800 font-bold cursor-pointer focus:ring-2 focus:ring-primary/20"
                              : "bg-gray-100 border border-gray-200 text-gray-400 font-medium cursor-not-allowed pointer-events-none"
                          )}
                        >
                          <option value="">
                            {hasLineSelected ? "Selecione o trecho..." : "Selecione uma linha primeiro"}
                          </option>
                          {AVAILABLE_TRECHOS.map(t => (
                            <option key={t.codigo} value={t.codigo}>
                              {t.codigo} - {t.origem} ➔ {t.destino}
                            </option>
                          ))}
                        </select>
                      );
                    })()
                  ) : (
                    <input
                      type="text"
                      disabled={true}
                      tabIndex={-1}
                      value={trip.codigoTrecho || ""}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-1.5 text-xs outline-none text-gray-600 font-medium select-none pointer-events-none"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-0.5 uppercase tracking-wider">
                    Origem do Trecho
                  </label>
                  <input
                    type="text"
                    disabled={true}
                    tabIndex={-1}
                    value={trip.origemTrecho || ""}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-1.5 text-xs outline-none text-gray-600 font-medium select-none pointer-events-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-0.5 uppercase tracking-wider">
                    Destino do Trecho
                  </label>
                  <input
                    type="text"
                    disabled={true}
                    tabIndex={-1}
                    value={trip.destinoTrecho || ""}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-1.5 text-xs outline-none text-gray-600 font-medium select-none pointer-events-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 border-t border-gray-50">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-0.5 uppercase tracking-wider">
                    Previsão de Saída
                  </label>
                  <input
                    type="text"
                    disabled={true}
                    tabIndex={-1}
                    value={
                      trip.previsaoSaida
                        ? new Date(trip.previsaoSaida).toLocaleString()
                        : ""
                    }
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-1.5 text-xs outline-none text-gray-600 font-medium select-none pointer-events-none"
                  />
                </div>
              </div>

              {/* Collapsible Tracking & Route Section */}
              {showTrackingInfo && (
                <div className="p-3 bg-gray-50/80 rounded-xl border border-gray-100 space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between pb-1.5 border-b border-gray-200/60">
                    <span className="text-[10px] font-black text-gray-700 uppercase tracking-wider">
                      Informações de Rastreio e Rota
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowTrackingInfo(false)}
                      className="text-[10px] font-bold text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      Fechar
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="md:col-span-2">
                      <label className="block text-[9px] font-black text-gray-400 mb-0.5 uppercase tracking-wider">
                        Chave do Rastreio
                      </label>
                      <input
                        type="text"
                        disabled={true}
                        tabIndex={-1}
                        value={trip.chaveRastreio || ""}
                        className="w-full bg-white border border-gray-200 rounded-lg p-1.5 text-xs outline-none text-gray-600 font-mono select-none pointer-events-none truncate"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-gray-400 mb-0.5 uppercase tracking-wider">
                        Código do Rastreio
                      </label>
                      <input
                        type="text"
                        disabled={true}
                        tabIndex={-1}
                        value={trip.codigoRastreio || ""}
                        className="w-full bg-white border border-gray-200 rounded-lg p-1.5 text-xs outline-none text-gray-600 font-medium select-none pointer-events-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-gray-400 mb-0.5 uppercase tracking-wider">
                        Código da Rota do Rastreio
                      </label>
                      <input
                        type="text"
                        disabled={true}
                        tabIndex={-1}
                        value={trip.codigoRotaRastreio || ""}
                        className="w-full bg-white border border-gray-200 rounded-lg p-1.5 text-xs outline-none text-gray-600 font-medium select-none pointer-events-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[9px] font-black text-gray-400 mb-0.5 uppercase tracking-wider">
                        Descrição da Rota do Rastreio
                      </label>
                      <input
                        type="text"
                        disabled={true}
                        tabIndex={-1}
                        value={trip.descricaoRotaRastreio || ""}
                        className="w-full bg-white border border-gray-200 rounded-lg p-1.5 text-xs outline-none text-gray-600 font-medium select-none pointer-events-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Secao 3: Veiculos & Motoristas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Veiculos Card */}
              <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-gray-50 mb-3">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-primary" />
                      <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider">
                        Lista de Veículos para a Viagem
                      </h4>
                    </div>
                    <span className="text-[8px] font-black bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                      {trip.veiculos.length}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    {trip.veiculos.map((v) => (
                      <div
                        key={v.id}
                        className="flex items-center gap-3 p-2 bg-gray-50/50 rounded-lg border border-gray-50 text-left"
                      >
                        <div className="w-8 h-8 rounded bg-white border border-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center text-gray-400 font-bold text-xs uppercase">
                          {v.fotoUrl ? (
                            <img
                              src={v.fotoUrl}
                              alt={v.placa}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <Truck className="w-4 h-4 text-gray-300" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <span className="text-xs font-bold text-gray-700">
                              {v.placa}
                            </span>
                            <span className="text-[8px] font-black bg-gray-200 text-gray-600 px-1 rounded uppercase tracking-tighter">
                              {v.tipo || "COMPLETO"}
                            </span>
                          </div>
                          <p className="text-[9px] text-gray-400 truncate">
                            {v.modelo}
                          </p>
                        </div>
                      </div>
                    ))}

                    {trip.veiculos.length === 0 && (
                      <p className="text-[10px] text-gray-400 italic text-center py-4 bg-gray-50/20 rounded-lg">
                        Nenhum veículo selecionado
                      </p>
                    )}
                  </div>
                </div>

                {canEditFields && (
                  <button
                    type="button"
                    onClick={() => setIsVehicleModalOpen(true)}
                    className="w-full border-2 border-dashed border-primary/20 hover:border-primary/50 text-primary/80 hover:text-primary rounded-lg py-2 text-[10px] font-black tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer bg-white"
                  >
                    <Plus className="w-3.5 h-3.5" /> Selecionar Veículo(s)
                  </button>
                )}
              </div>

              {/* Motoristas Card */}
              <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-gray-50 mb-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" />
                      <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider">
                        Lista de Motoristas
                      </h4>
                    </div>
                    <span className="text-[8px] font-black bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                      {trip.motoristas.length}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    {trip.motoristas.map((d) => (
                      <div
                        key={d.id}
                        className="flex items-center justify-between p-2 bg-gray-50/50 rounded-lg border border-gray-50"
                      >
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-gray-700 leading-tight">
                            {d.nome}
                          </span>
                          <span className="text-[9px] text-gray-400 font-medium">
                            CPF: {maskCpf(d.cpf)} • Cód: {d.codigo}
                          </span>
                        </div>

                        {canEditFields ? (
                          <button
                            type="button"
                            onClick={() => setPrincipalDriver(d.id)}
                            className={cn(
                              "px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter cursor-pointer transition-all",
                              d.isPrincipal
                                ? "bg-primary text-white shadow-xs"
                                : "bg-gray-200 text-gray-500",
                            )}
                          >
                            {d.isPrincipal ? "PRINCIPAL" : "RESERVA"}
                          </button>
                        ) : (
                          <span
                            className={cn(
                              "px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter",
                              d.isPrincipal
                                ? "bg-primary text-white"
                                : "bg-gray-100 text-gray-400",
                            )}
                          >
                            {d.isPrincipal ? "PRINCIPAL" : "RESERVA"}
                          </span>
                        )}
                      </div>
                    ))}

                    {trip.motoristas.length === 0 && (
                      <p className="text-[10px] text-gray-400 italic text-center py-4 bg-gray-50/20 rounded-lg">
                        Nenhum motorista selecionado
                      </p>
                    )}
                  </div>
                </div>

                {canEditFields && (
                  <button
                    type="button"
                    onClick={() => setIsDriverModalOpen(true)}
                    className="w-full border-2 border-dashed border-primary/20 hover:border-primary/50 text-primary/80 hover:text-primary rounded-lg py-2 text-[10px] font-black tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer bg-white"
                  >
                    <Plus className="w-3.5 h-3.5" /> Selecionar Motorista(s)
                  </button>
                )}
              </div>
            </div>

            {/* Secao 4: Troca de Motoristas & Lacres [Desabilitado] */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Troca de Motoristas Option */}
              <div className="bg-gray-50/50 rounded-xl border border-gray-100 p-4 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100/50">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider">
                      Troca de Motorista (Opção de Troca)
                    </h4>
                  </div>
                  <span className="text-[8px] font-black bg-gray-200 text-gray-400 px-1.5 py-0.5 rounded uppercase tracking-tighter">
                    INATIVO
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 opacity-50 cursor-not-allowed">
                  <div>
                    <label className="block text-[9px] font-black text-gray-400 mb-0.5 uppercase tracking-wider">
                      Código
                    </label>
                    <input
                      type="text"
                      disabled={true}
                      tabIndex={-1}
                      placeholder="Nenhum"
                      className="w-full bg-gray-100 border border-gray-200 rounded-lg p-1 text-xs outline-none text-gray-500 select-none pointer-events-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-black text-gray-400 mb-0.5 uppercase tracking-wider">
                      Sigla
                    </label>
                    <input
                      type="text"
                      disabled={true}
                      tabIndex={-1}
                      placeholder="Selecione..."
                      className="w-full bg-gray-100 border border-gray-200 rounded-lg p-1 text-xs outline-none text-gray-500 select-none pointer-events-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-black text-gray-400 mb-0.5 uppercase tracking-wider">
                      Unidade / Ponto de Controle
                    </label>
                    <input
                      type="text"
                      disabled={true}
                      tabIndex={-1}
                      placeholder="Não aplicável"
                      className="w-full bg-gray-100 border border-gray-200 rounded-lg p-1 text-xs outline-none text-gray-500 select-none pointer-events-none"
                    />
                  </div>
                </div>
              </div>

              {/* Lacres Option */}
              <div className="bg-gray-50/50 rounded-xl border border-gray-100 p-4 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100/50">
                  <div className="flex items-center gap-2">
                    <Clipboard className="w-4 h-4 text-gray-400" />
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider">
                      Lacres (Vários Lacres)
                    </h4>
                  </div>
                  <span className="text-[8px] font-black bg-gray-200 text-gray-400 px-1.5 py-0.5 rounded uppercase tracking-tighter">
                    DESABILITADO
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 opacity-50 cursor-not-allowed">
                  <div>
                    <label className="block text-[9px] font-black text-gray-400 mb-0.5 uppercase tracking-wider font-bold">
                      Lacre nº 1
                    </label>
                    <input
                      type="text"
                      disabled={true}
                      tabIndex={-1}
                      value="LCR-10492"
                      className="w-full bg-gray-100 border border-gray-200 rounded-lg p-1 text-xs outline-none text-gray-600 font-bold select-none pointer-events-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-black text-gray-400 mb-0.5 uppercase tracking-wider font-bold">
                      Lacre nº 2
                    </label>
                    <input
                      type="text"
                      disabled={true}
                      tabIndex={-1}
                      value="LCR-94812"
                      className="w-full bg-gray-100 border border-gray-200 rounded-lg p-1 text-xs outline-none text-gray-600 font-bold select-none pointer-events-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-black text-gray-400 mb-0.5 uppercase tracking-wider font-bold">
                      Lacre nº 3
                    </label>
                    <input
                      type="text"
                      disabled={true}
                      tabIndex={-1}
                      value="LCR-50293"
                      className="w-full bg-gray-100 border border-gray-200 rounded-lg p-1 text-xs outline-none text-gray-600 font-bold select-none pointer-events-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-black text-gray-400 mb-0.5 uppercase tracking-wider font-bold">
                      Lacre nº 4
                    </label>
                    <input
                      type="text"
                      disabled={true}
                      tabIndex={-1}
                      placeholder="Não preenchido"
                      className="w-full bg-gray-100 border border-gray-200 rounded-lg p-1 text-xs outline-none text-gray-500 select-none pointer-events-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "ctes" && (
          <div className="space-y-4">
            {/* Feedback Alert */}
            {docFeedback && (
              <div
                className={cn(
                  "p-3 rounded-xl border flex items-center justify-between text-xs font-semibold animate-in fade-in slide-in-from-top duration-200 shadow-xs",
                  docFeedback.type === "success"
                    ? "bg-green-50 border-green-200 text-green-800"
                    : "bg-blue-50 border-blue-200 text-blue-800"
                )}
              >
                <div className="flex items-center gap-2">
                  {docFeedback.type === "success" ? (
                    <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                  ) : (
                    <Info className="w-4 h-4 text-blue-600 shrink-0" />
                  )}
                  <span>{docFeedback.message}</span>
                </div>
                <button
                  onClick={() => setDocFeedback(null)}
                  className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Painel de Ações de Documentos */}
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-xs space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-primary" />
                    <h3 className="text-xs font-black text-gray-800 uppercase tracking-wider">
                      Documentos da Viagem
                    </h3>
                  </div>
                  <p className="text-[10px] text-gray-500 font-medium mt-0.5">
                    Configuração da Linha:{" "}
                    <strong className="text-gray-700">
                      {trip.agenciaOrigemSigla || "SAO"} ➔ {trip.agenciaDestinoSigla || "RIO"}
                    </strong>{" "}
                    • {trip.nomeLinha || "Linha Principal"}
                    {!canEditFields && isEditable && (
                      <span className="block text-amber-600 font-semibold mt-0.5">
                        * Ações bloqueadas. Clique em "EDITAR VIAGEM" no topo para habilitar a gestão de documentos.
                      </span>
                    )}
                  </p>
                </div>

                {/* 3 Ações Principais Solicitadas */}
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Ação 1: Adicionar todos os documentos da linha */}
                  <button
                    type="button"
                    disabled={!canEditFields || loading}
                    onClick={handleAddAllLineDocuments}
                    title={
                      !canEditFields
                        ? "Clique em 'Editar Viagem' no topo para habilitar esta ação"
                        : "Buscar e vincular à viagem todos os documentos presentes na empresa que pertencem à configuração desta linha"
                    }
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all shadow-xs",
                      canEditFields
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 hover:shadow-md cursor-pointer active:scale-98"
                        : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-60"
                    )}
                  >
                    <FolderPlus className="w-3.5 h-3.5 shrink-0" />
                    <span>Adicionar Todos da Linha</span>
                  </button>

                  {/* Ação 2: Escolher documentos para incluir na viagem */}
                  <button
                    type="button"
                    disabled={!canEditFields || loading}
                    onClick={openImportModal}
                    title={
                      !canEditFields
                        ? "Clique em 'Editar Viagem' no topo para habilitar esta ação"
                        : "Abre modal para escolher quais documentos incluir na viagem (apenas da linha ou todos da empresa)"
                    }
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all shadow-xs",
                      canEditFields
                        ? "bg-primary hover:bg-primary/90 text-white shadow-primary/20 hover:shadow-md cursor-pointer active:scale-98"
                        : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-60"
                    )}
                  >
                    <ListPlus className="w-3.5 h-3.5 shrink-0" />
                    <span>Escolher Documentos</span>
                  </button>

                  {/* Ação 3: Remover documentos da viagem */}
                  <button
                    type="button"
                    disabled={!canEditFields || markedControleIds.size === 0 || loading}
                    onClick={handleRemoveMarkedControles}
                    title={
                      !canEditFields
                        ? "Clique em 'Editar Viagem' no topo para habilitar esta ação"
                        : markedControleIds.size === 0
                        ? "Marque os documentos na lista para remover"
                        : `Remover ${markedControleIds.size} documento(s) marcado(s) da viagem`
                    }
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all shadow-xs",
                      canEditFields && markedControleIds.size > 0
                        ? "bg-red-600 hover:bg-red-700 text-white shadow-red-600/20 hover:shadow-md cursor-pointer active:scale-98"
                        : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-60"
                    )}
                  >
                    <Trash2 className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      Remover Documentos {markedControleIds.size > 0 ? `(${markedControleIds.size})` : ""}
                    </span>
                  </button>
                </div>
              </div>

              {/* Linha auxiliar: busca rápida por chave e indicadores */}
              <div className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 max-w-sm w-full relative">
                  <input
                    type="text"
                    disabled={!canEditFields}
                    placeholder="Vincular chave de controle manual..."
                    className={cn(
                      "w-full border rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-primary/20 outline-none transition-all pr-8",
                      canEditFields
                        ? "bg-white border-gray-200 hover:border-gray-300 text-gray-800"
                        : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-60"
                    )}
                    value={controleKey}
                    onChange={(e) => setControleKey(e.target.value)}
                    onKeyDown={addControleByKey}
                  />
                  <button
                    type="button"
                    disabled={!canEditFields || !controleKey}
                    onClick={performAddControle}
                    className="absolute right-1.5 top-1 p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-primary transition-colors cursor-pointer disabled:cursor-not-allowed disabled:hover:bg-transparent"
                    title={!canEditFields ? "Habilite a edição para vincular chaves" : "Buscar e vincular chave"}
                  >
                    <Search className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500">
                  <span className="bg-gray-100 px-2 py-0.5 rounded-full text-gray-700 font-black">
                    {(trip.controlesCarga || []).length} Controles
                  </span>
                  <span className="bg-gray-100 px-2 py-0.5 rounded-full text-gray-700 font-black">
                    {(trip.ctes || []).length} CT-es
                  </span>
                  <span className="text-gray-600 font-mono">
                    Total: R${" "}
                    {(trip.ctes || [])
                      .reduce((s, c) => s + (c.valor || 0), 0)
                      .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* Barra de Seleção / Contagem de Marcados */}
            <div className="flex items-center justify-between px-1">
              <label
                className={cn(
                  "flex items-center gap-2 select-none",
                  canEditFields && (trip.controlesCarga || []).length > 0
                    ? "cursor-pointer"
                    : "cursor-not-allowed opacity-60"
                )}
              >
                <input
                  type="checkbox"
                  checked={
                    (trip.controlesCarga || []).length > 0 &&
                    markedControleIds.size === (trip.controlesCarga || []).length
                  }
                  onChange={toggleMarkAllControles}
                  disabled={(trip.controlesCarga || []).length === 0 || !canEditFields}
                  className="w-4 h-4 rounded text-red-600 border-gray-300 focus:ring-red-500 cursor-pointer disabled:cursor-not-allowed"
                />
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                  Marcar Todos ({markedControleIds.size}/{(trip.controlesCarga || []).length})
                </span>
              </label>

              {markedControleIds.size > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
                    {markedControleIds.size} documento(s) marcado(s) para remoção
                  </span>
                  {canEditFields && (
                    <button
                      type="button"
                      onClick={handleRemoveMarkedControles}
                      className="text-[10px] font-black text-red-600 hover:text-red-700 underline uppercase cursor-pointer"
                    >
                      Remover agora
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Listagem de Documentos da Viagem */}
            <div className="space-y-2">
              {(trip.controlesCarga || []).length === 0 ? (
                <div className="py-12 px-4 text-center bg-white rounded-xl border border-gray-100 border-dashed space-y-3">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto text-gray-400">
                    <ClipboardList className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-black uppercase text-gray-700">
                      Nenhum documento de carga vinculado à viagem
                    </h4>
                    <p className="text-[11px] text-gray-400 max-w-md mx-auto">
                      {canEditFields
                        ? "Utilize os botões de ação acima para adicionar todos os documentos da configuração da linha ou escolher documentos específicos da empresa."
                        : "Clique no botão 'EDITAR VIAGEM' acima para habilitar as ações de adicionar ou vincular documentos."}
                    </p>
                  </div>
                  {canEditFields && (
                    <div className="flex justify-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={handleAddAllLineDocuments}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-md text-[10px] font-bold hover:bg-emerald-700 cursor-pointer uppercase shadow-xs"
                      >
                        <FolderPlus className="w-3.5 h-3.5" /> Adicionar Todos da Linha
                      </button>
                      <button
                        type="button"
                        onClick={openImportModal}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-md text-[10px] font-bold hover:opacity-90 cursor-pointer uppercase shadow-xs"
                      >
                        <ListPlus className="w-3.5 h-3.5" /> Escolher Documentos
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {(trip.controlesCarga || []).map((controle) => {
                    const isMarked = markedControleIds.has(controle.id || controle.chave);
                    const isExpanded = expandedControles.has(controle.id || controle.chave);
                    const isLineMatch =
                      controle.origemSigla === trip.agenciaOrigemSigla &&
                      controle.destinoSigla === trip.agenciaDestinoSigla;
                    const totalValorControle = (controle.ctes || []).reduce(
                      (s, c) => s + (c.valor || 0),
                      0
                    );

                    return (
                      <div
                        key={controle.id || controle.chave}
                        className={cn(
                          "bg-white rounded-xl border overflow-hidden shadow-xs transition-all",
                          isMarked
                            ? "border-red-300 bg-red-50/20 ring-1 ring-red-300"
                            : "border-gray-100 hover:border-gray-200"
                        )}
                      >
                        <div className="p-3 flex items-center justify-between gap-3 bg-gray-50/60 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Checkbox de marcação para remoção */}
                            {canEditFields && (
                              <input
                                type="checkbox"
                                checked={isMarked}
                                onChange={() => toggleMarkControle(controle.id || controle.chave)}
                                className="w-4 h-4 rounded text-red-600 border-gray-300 focus:ring-red-500 cursor-pointer shrink-0"
                                title="Marcar este documento para remoção"
                              />
                            )}

                            <div
                              onClick={() => toggleControleExpansion(controle.id || controle.chave)}
                              className="flex items-center gap-2.5 cursor-pointer min-w-0"
                            >
                              <ClipboardList className="w-4 h-4 text-primary shrink-0" />
                              <div className="flex flex-col min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-[11px] font-black text-gray-800 font-mono tracking-tight truncate">
                                    {controle.chave}
                                  </span>
                                  <span
                                    className={cn(
                                      "text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider",
                                      isLineMatch
                                        ? "bg-emerald-100 text-emerald-800"
                                        : "bg-blue-100 text-blue-800"
                                    )}
                                  >
                                    {controle.origemSigla} ➔ {controle.destinoSigla}
                                  </span>
                                  {isLineMatch && (
                                    <span className="text-[8px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 px-1 rounded uppercase tracking-tighter">
                                      Configuração da Linha
                                    </span>
                                  )}
                                </div>
                                <span className="text-[9px] text-gray-400 font-medium mt-0.5">
                                  {(controle.ctes || []).length} CT-e(s) • Total: R${" "}
                                  {totalValorControle.toLocaleString("pt-BR", {
                                    minimumFractionDigits: 2,
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => toggleControleExpansion(controle.id || controle.chave)}
                              className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                              title={isExpanded ? "Ocultar CT-es" : "Ver CT-es"}
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>

                            {canEditFields && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveSingleControle(controle.id, controle.chave)
                                }
                                className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                                title="Remover este documento da viagem"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="p-3 pt-0 px-4 space-y-1 bg-white">
                                <div className="h-[1px] bg-gray-50 mb-2" />
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">
                                  Conhecimentos de Transporte (CT-es) vinculados
                                </span>
                                {(controle.ctes || []).map((cte, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0 group text-left"
                                  >
                                    <div className="flex items-center gap-2 min-w-0">
                                      <FileCheck className="w-3.5 h-3.5 text-green-500 shrink-0" />
                                      <div className="flex flex-col min-w-0">
                                        <span className="text-[10px] font-bold text-gray-700 font-mono truncate">
                                          {cte.chave}
                                        </span>
                                        <span className="text-[8px] text-gray-400 font-medium uppercase tracking-tighter truncate">
                                          {cte.remetente} ➔ {cte.destinatario}
                                        </span>
                                      </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-700 font-mono shrink-0 pl-2">
                                      R${" "}
                                      {(cte.valor || 0).toLocaleString("pt-BR", {
                                        minimumFractionDigits: 2,
                                      })}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "ocorrencias" && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 mb-4">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                Linha do Tempo
              </h3>
            </div>
            {trip.ocorrencias.length > 0 &&
              [...trip.ocorrencias].reverse().map((oc, idx, arr) => (
                <div
                  key={idx}
                  className="relative pl-6 mb-3.5 last:mb-0 flex items-center"
                >
                  {idx < arr.length - 1 && (
                    <div className="absolute left-2 top-[50%] w-[1px] h-[calc(100%+14px)] bg-gray-100" />
                  )}
                  <div
                    className={cn(
                      "absolute left-1 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-primary transition-all z-10",
                      idx === 0
                        ? "bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]"
                        : "bg-white",
                    )}
                  />
                  <div
                    className={cn(
                      "flex-1 p-2 rounded-lg border transition-all",
                      idx === 0
                        ? "bg-white border-primary/20 shadow-sm"
                        : "bg-white/50 border-gray-50",
                    )}
                  >
                    <div className="flex justify-between items-center mb-0.5">
                      <span
                        className={cn(
                          "text-[10px] font-black tracking-tight",
                          idx === 0 ? "text-primary" : "text-gray-400",
                        )}
                      >
                        {oc.tipo}
                      </span>
                      <span className="text-[9px] text-gray-400">
                        {new Date(oc.dataGeracao).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-[9px] text-gray-500 font-medium">
                      Auto-registro do sistema LogiTrip.
                    </p>
                  </div>
                </div>
              ))}
          </div>
        )}

        {activeTab === "documentos" && (
          <div className="space-y-4">
            {/* Barra de Ações: Reenviar Solicitação de Documentação */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 bg-white border border-gray-100 rounded-xl shadow-xs select-none">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Ação Única Solicitada: Reenviar Solicitação de Documentação */}
                <button
                  type="button"
                  onClick={handleResendFiscalDocumentation}
                  disabled={loading || trip.documentosFiscais.length === 0 || !canEditFields}
                  className={cn(
                    "px-3.5 py-2 border rounded-lg text-[10px] font-black transition-all shadow-xs flex items-center gap-1.5 uppercase tracking-wider cursor-pointer",
                    canEditFields && trip.documentosFiscais.length > 0
                      ? "border-primary bg-primary text-white hover:bg-primary-hover shadow-primary/20 active:scale-98"
                      : "border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed opacity-60"
                  )}
                  title={
                    !canEditFields
                      ? "Clique em 'EDITAR VIAGEM' no topo para habilitar o reenvio"
                      : trip.documentosFiscais.length === 0
                      ? "Nenhum documento fiscal cadastrado nesta viagem para reenviar solicitação"
                      : "Reenviar solicitação de documentação fiscal para a SEFAZ/órgãos reguladores"
                  }
                >
                  <RotateCcw className={cn("w-3.5 h-3.5 shrink-0", loading && "animate-spin")} />
                  <span>Reenviar Solicitação de Documentação</span>
                </button>
              </div>

              <div className="text-[10px] font-bold text-gray-500">
                <span className="text-gray-500 font-semibold">
                  Total: {trip.documentosFiscais.length} documento(s) fiscal(is)
                </span>
              </div>
            </div>

            {!canEditFields && (
              <div className="p-2.5 px-3 bg-amber-50 border border-amber-200/60 rounded-xl flex items-center justify-between text-xs text-amber-800">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="text-[11px] font-semibold">
                    Para reenviar solicitação de documentação fiscal, clique no botão <strong>EDITAR VIAGEM</strong> no topo.
                  </span>
                </div>
                {isEditable && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-2.5 py-1 bg-amber-600 text-white rounded text-[10px] font-black uppercase hover:bg-amber-700 cursor-pointer shadow-xs"
                  >
                    Editar Viagem
                  </button>
                )}
              </div>
            )}

            <div className="overflow-hidden border border-gray-100 rounded-xl bg-white shadow-sm">
              <table className="w-full text-left border-collapse table-fixed">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100 select-none">
                    <th className="w-[16%] px-3 py-2.5 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                      Documento
                    </th>
                    <th className="w-[16%] px-3 py-2.5 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                      Situação
                    </th>
                    <th className="w-[18%] px-3 py-2.5 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                      Número
                    </th>
                    <th className="w-[20%] px-3 py-2.5 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                      Geração
                    </th>
                    <th className="w-[20%] px-3 py-2.5 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                      Retorno
                    </th>
                    <th className="w-[10%] px-3 py-2.5 text-[9px] font-black text-gray-400 uppercase tracking-widest text-right pr-4">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {trip.documentosFiscais.map((doc, idx) => {
                    const normStatus = getNormalizeStatus(doc.status);
                    const fStatus = FISCAL_STATUS_CONFIG[normStatus] || {
                      label: normStatus,
                      color: "bg-gray-100",
                      text: "text-gray-600",
                    };
                    const isCiot = doc.tipo === 'CIOT';
                    
                    return (
                      <tr
                        key={idx}
                        className={cn(
                          "border-b border-gray-50 last:border-0 hover:bg-gray-50/40 h-12 transition-colors",
                          doc.status === 'REJEITADO' ? 'bg-orange-50/10' : ''
                        )}
                      >
                        {/* Coluna Documento */}
                        <td className="px-3 py-2 text-left align-middle">
                          <div className="flex items-center gap-1.5 h-full">
                            <FileText size={16} strokeWidth={2} className={`shrink-0 ${isCiot ? 'text-blue-500' : 'text-purple-600'}`} />
                            <span className="text-[10px] font-bold text-gray-800">
                              {doc.tipo}
                            </span>
                          </div>
                        </td>
                        
                        {/* Coluna Situação */}
                        <td className="px-3 py-2 text-left align-middle">
                          <div className="flex items-center h-full">
                            <span
                              className={cn(
                                "px-1.5 py-0.5 rounded text-[8px] font-black uppercase inline-block whitespace-nowrap",
                                fStatus.color,
                                fStatus.text,
                              )}
                            >
                              {normStatus}
                            </span>
                          </div>
                        </td>
                        
                        {/* Coluna Número */}
                        <td className="px-3 py-2 text-left align-middle text-[10px] font-semibold text-gray-700 font-mono">
                          <div className="flex items-center h-full">
                            {doc.numero || `DOC-${100000 + idx}`}
                          </div>
                        </td>
                        
                        {/* Coluna Geração */}
                        <td className="px-3 py-2 text-left align-middle text-[9px] font-semibold text-gray-500">
                          <div className="flex items-center h-full">
                            {formatDateTime(doc.dataGeracao)}
                          </div>
                        </td>
                        
                        {/* Coluna Retorno */}
                        <td className="px-3 py-2 text-left align-middle text-[9px] font-semibold text-gray-500">
                          <div className="flex items-center h-full">
                            {normStatus === 'PENDENTE' ? (
                              <span className="text-gray-400 italic flex items-center gap-1">
                                <Clock size={12} strokeWidth={2} className="animate-pulse" /> Processando...
                              </span>
                            ) : (
                              formatDateTime(doc.dataRetorno || doc.dataAtualizacao || doc.dataGeracao)
                            )}
                          </div>
                        </td>
                        
                        {/* Coluna Ações */}
                        <td className="px-3 py-2 text-right align-middle pr-4">
                          <div className="flex items-center justify-end gap-2 h-full">
                            {/* Ação Cancelar (quando Autorizado) */}
                            {normStatus === 'AUTORIZADO' && (
                              <button
                                onClick={() => {
                                  if (!canEditFields) {
                                    alert("Para cancelar documentos, clique primeiro no botão 'EDITAR VIAGEM'.");
                                    return;
                                  }
                                  handleCancelSingleDoc(doc);
                                }}
                                className={cn(
                                  "group relative p-1 rounded transition-colors",
                                  !canEditFields
                                    ? "text-gray-300 opacity-40 cursor-not-allowed"
                                    : "text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                                )}
                                title={!canEditFields ? "Habilite a edição para cancelar" : "Cancelar Documento"}
                              >
                                <XCircle size={16} strokeWidth={2} />
                                <span className="pointer-events-none absolute right-0 bottom-full mb-1 bg-gray-900 text-white text-[8px] font-black py-0.5 px-1.5 rounded shadow-lg z-50 whitespace-nowrap hidden group-hover:block">
                                  {!canEditFields ? "Habilite a edição para cancelar" : "Cancelar Documento"}
                                </span>
                              </button>
                            )}

                            {/* Ação Consultar Status (quando Aguardando Retorno / Pendente) */}
                            {normStatus === 'PENDENTE' && (
                              <button
                                onClick={() => handleConsultSingleStatus(doc)}
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
                            {normStatus === 'REJEITADO' && (
                              <button
                                onClick={() => {
                                  if (!canEditFields) {
                                    alert("Para reenviar autorização, clique primeiro no botão 'EDITAR VIAGEM'.");
                                    return;
                                  }
                                  handleResendSingleAuth(doc);
                                }}
                                className={cn(
                                  "group relative p-1 rounded transition-colors",
                                  !canEditFields
                                    ? "text-gray-300 opacity-40 cursor-not-allowed"
                                    : "text-purple-600 hover:text-purple-800 hover:bg-purple-50 cursor-pointer"
                                )}
                                title={!canEditFields ? "Habilite a edição para reenviar" : "Reenviar Autorização"}
                              >
                                <RotateCcw size={16} strokeWidth={2} />
                                <span className="pointer-events-none absolute right-0 bottom-full mb-1 bg-gray-900 text-white text-[8px] font-black py-0.5 px-1.5 rounded shadow-lg z-50 whitespace-nowrap hidden group-hover:block">
                                  {!canEditFields ? "Habilite a edição para reenviar" : "Reenviar Autorização"}
                                </span>
                              </button>
                            )}

                            {/* Ação Observações */}
                            <button
                              onClick={() => setSelectedDocForObs(doc)}
                              className="group relative p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-primary transition-colors cursor-pointer"
                              title="Observações"
                            >
                              <Eye size={16} strokeWidth={2} />
                              <span className="pointer-events-none absolute right-0 bottom-full mb-1 bg-gray-900 text-white text-[8px] font-black py-0.5 px-1.5 rounded shadow-lg whitespace-nowrap z-50 hidden group-hover:block">
                                Observações
                              </span>
                            </button>

                            {/* Ação Imprimir (apenas para MDF-e) */}
                            {doc.tipo === 'MDF-E' && (
                              <button
                                onClick={() => handlePrintMdfe(doc)}
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
                  })}
                  {trip.documentosFiscais.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-3 py-8 text-center text-[10px] text-gray-400 font-medium italic"
                      >
                        Sem documentos fiscais cadastrados para esta viagem.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {loading && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-[60]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <span className="text-xs font-black text-primary animate-pulse uppercase tracking-widest text-center px-4">
              {loadingText}
            </span>
          </div>
        </div>
      )}

      <AnimatePresence>
        {isImportModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[70] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[85%]"
            >
              {/* Header do Modal */}
              <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <ListPlus className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-gray-900 text-sm leading-tight">
                      Escolher Documentos para a Viagem
                    </h3>
                    <p className="text-[10px] text-gray-500 font-medium">
                      Linha: <strong className="text-gray-700">{trip.agenciaOrigemSigla || "SAO"} ➔ {trip.agenciaDestinoSigla || "RIO"}</strong> ({trip.nomeLinha || "Linha"})
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="p-1.5 hover:bg-gray-200 rounded-full transition-colors cursor-pointer text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Filtros e Busca */}
              <div className="p-4 border-b border-gray-100 bg-white space-y-2.5">
                {/* Abas de Filtro: Configuração da Linha vs Todos da Empresa */}
                <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setImportFilter("line")}
                    className={cn(
                      "py-2 px-3 rounded-lg text-[10px] font-black uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                      importFilter === "line"
                        ? "bg-white text-primary shadow-xs ring-1 ring-black/5"
                        : "text-gray-500 hover:text-gray-800"
                    )}
                  >
                    <FolderPlus className="w-3.5 h-3.5" />
                    <span>Apenas Config. da Linha</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setImportFilter("all")}
                    className={cn(
                      "py-2 px-3 rounded-lg text-[10px] font-black uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                      importFilter === "all"
                        ? "bg-white text-primary shadow-xs ring-1 ring-black/5"
                        : "text-gray-500 hover:text-gray-800"
                    )}
                  >
                    <ClipboardList className="w-3.5 h-3.5" />
                    <span>Todos os da Empresa</span>
                  </button>
                </div>

                <div className="flex items-center justify-between text-[10px] text-gray-500 px-1 font-medium">
                  <span>
                    {importFilter === "line"
                      ? `Exibindo documentos que atendem à rota ${trip.agenciaOrigemSigla || "Origem"} ➔ ${trip.agenciaDestinoSigla || "Destino"}`
                      : "Exibindo todos os documentos de carga presentes na empresa"}
                  </span>
                  <span className="font-bold text-gray-700">
                    {filteredImportControles.length} disponíveis
                  </span>
                </div>

                {/* Campo de Busca */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Filtrar por chave, remetente, destinatário, origem ou destino..."
                    value={importModalSearch}
                    onChange={(e) => setImportModalSearch(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-8 py-2 text-xs focus:ring-2 focus:ring-primary/20 outline-none text-gray-800"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  {importModalSearch && (
                    <button
                      type="button"
                      onClick={() => setImportModalSearch("")}
                      className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Barra de Selecionar Todos / Desmarcar */}
                <div className="flex items-center justify-between px-1 pt-1 text-[11px] select-none">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-600">
                    <input
                      type="checkbox"
                      checked={
                        filteredImportControles.filter(
                          (c) =>
                            !(trip.controlesCarga || []).some(
                              (tc) => tc.chave === c.chave || tc.id === c.id
                            )
                        ).length > 0 &&
                        filteredImportControles
                          .filter(
                            (c) =>
                              !(trip.controlesCarga || []).some(
                                (tc) => tc.chave === c.chave || tc.id === c.id
                              )
                          )
                          .every((c) => selectedImportIds.has(c.id || c.chave))
                      }
                      onChange={toggleSelectAllFiltered}
                      className="w-4 h-4 rounded text-primary border-gray-300 focus:ring-primary cursor-pointer"
                    />
                    <span>
                      Selecionar todos os listados ({selectedImportIds.size})
                    </span>
                  </label>

                  {selectedImportIds.size > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedImportIds(new Set())}
                      className="text-[10px] text-red-500 hover:text-red-700 font-bold uppercase cursor-pointer"
                    >
                      Limpar seleção
                    </button>
                  )}
                </div>
              </div>

              {/* Lista de Documentos Disponíveis */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2.5 bg-gray-50/40 text-left">
                {filteredImportControles.length === 0 ? (
                  <div className="py-12 text-center text-gray-400 space-y-1">
                    <div className="text-xs font-black uppercase tracking-wider">
                      Nenhum documento encontrado
                    </div>
                    <p className="text-[11px] max-w-sm mx-auto">
                      {importFilter === "line"
                        ? "Não há controles pendentes para esta rota específica. Alterne para 'Todos os da Empresa' ou use 'Adicionar Todos da Linha'."
                        : "Nenhum documento coincide com os filtros aplicados."}
                    </p>
                  </div>
                ) : (
                  filteredImportControles.map((c) => {
                    const isAlreadyLinked = (trip.controlesCarga || []).some(
                      (tc) => tc.chave === c.chave || tc.id === c.id
                    );
                    const isSelected = selectedImportIds.has(c.id || c.chave);
                    const isExpanded = expandedImportControles.has(c.id || c.chave);
                    const isLineMatch =
                      c.origemSigla === trip.agenciaOrigemSigla &&
                      c.destinoSigla === trip.agenciaDestinoSigla;
                    const totalValor = (c.ctes || []).reduce(
                      (s, cte) => s + (cte.valor || 0),
                      0
                    );

                    return (
                      <div
                        key={c.id || c.chave}
                        className={cn(
                          "rounded-xl border transition-all overflow-hidden bg-white shadow-xs",
                          isAlreadyLinked
                            ? "border-gray-200 bg-gray-50/50 opacity-75"
                            : isSelected
                            ? "border-primary bg-primary/2 ring-1 ring-primary/40 shadow-sm"
                            : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        <div
                          onClick={() => {
                            if (!isAlreadyLinked) {
                              toggleImportSelection(c.id || c.chave);
                            }
                          }}
                          className={cn(
                            "p-3 flex items-center justify-between gap-3 cursor-pointer",
                            isAlreadyLinked ? "cursor-default" : ""
                          )}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Checkbox de seleção */}
                            <div
                              className={cn(
                                "w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0",
                                isAlreadyLinked
                                  ? "bg-gray-200 border-gray-300 text-gray-500 cursor-not-allowed"
                                  : isSelected
                                  ? "bg-primary border-primary text-white"
                                  : "border-gray-300 bg-white"
                              )}
                            >
                              {(isSelected || isAlreadyLinked) && (
                                <Check className="w-3 h-3 stroke-[3]" />
                              )}
                            </div>

                            <div className="flex flex-col min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[11px] font-black text-gray-800 font-mono">
                                  {c.chave}
                                </span>
                                <span
                                  className={cn(
                                    "text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider",
                                    isLineMatch
                                      ? "bg-emerald-100 text-emerald-800"
                                      : "bg-blue-100 text-blue-800"
                                  )}
                                >
                                  {c.origemSigla} ➔ {c.destinoSigla}
                                </span>
                                {isLineMatch && (
                                  <span className="text-[8px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 px-1 rounded uppercase tracking-tighter">
                                    Configuração da Linha
                                  </span>
                                )}
                                {isAlreadyLinked && (
                                  <span className="text-[8px] font-black bg-gray-200 text-gray-600 px-1 rounded uppercase tracking-tighter">
                                    Já Vinculado
                                  </span>
                                )}
                              </div>
                              <span className="text-[9px] text-gray-500 font-medium mt-0.5 truncate">
                                {(c.ctes || []).length} CT-e(s) • R${" "}
                                {totalValor.toLocaleString("pt-BR", {
                                  minimumFractionDigits: 2,
                                })}
                                {c.ctes?.[0] && ` • ${c.ctes[0].remetente} → ${c.ctes[0].destinatario}`}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleImportExpansion(c.id || c.chave);
                              }}
                              className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 transition-colors"
                              title={isExpanded ? "Ocultar CT-es" : "Ver CT-es"}
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Accordion de CT-es dentro do modal */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden border-t border-gray-100 bg-gray-50/50"
                            >
                              <div className="p-2.5 px-3 space-y-1">
                                {(c.ctes || []).map((cte, cIdx) => (
                                  <div
                                    key={cIdx}
                                    className="flex items-center justify-between py-1 border-b border-gray-100 last:border-0 text-left text-[10px]"
                                  >
                                    <div className="flex items-center gap-1.5 min-w-0">
                                      <FileCheck className="w-3.5 h-3.5 text-green-500 shrink-0" />
                                      <div className="flex flex-col min-w-0">
                                        <span className="font-mono text-gray-700 font-bold truncate">
                                          {cte.chave}
                                        </span>
                                        <span className="text-[8px] text-gray-400 truncate">
                                          {cte.remetente} ➔ {cte.destinatario}
                                        </span>
                                      </div>
                                    </div>
                                    <span className="font-mono text-gray-700 font-bold shrink-0 pl-2">
                                      R${" "}
                                      {(cte.valor || 0).toLocaleString("pt-BR", {
                                        minimumFractionDigits: 2,
                                      })}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Rodapé do Modal */}
              <div className="p-4 bg-white border-t border-gray-100 flex items-center justify-between">
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    {selectedImportIds.size} SELECIONADO(S)
                  </span>
                  <span className="text-[9px] font-bold text-primary">
                    {filteredImportControles
                      .filter((c) => selectedImportIds.has(c.id || c.chave))
                      .reduce((s, c) => s + (c.ctes || []).length, 0)}{" "}
                    CT-e(s) a incluir
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsImportModalOpen(false)}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    disabled={selectedImportIds.size === 0}
                    onClick={handleImportSelected}
                    className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-black hover:opacity-90 disabled:opacity-50 transition-all uppercase tracking-widest shadow-md shadow-primary/20 cursor-pointer disabled:cursor-not-allowed"
                  >
                    Incluir na Viagem ({selectedImportIds.size})
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* 1. Modal Selecao de Linhas */}
        {isLineModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[70] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80%]"
            >
              <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-gray-800 text-sm">
                    Selecionar Linha de Viagem
                  </h3>
                </div>
                <button
                  onClick={() => setIsLineModalOpen(false)}
                  className="p-1.5 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {/* Search */}
              <div className="p-4 border-b border-gray-100 bg-white">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar por código ou nome..."
                    value={lineSearch}
                    onChange={(e) => setLineSearch(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                </div>
                <p className="text-[9px] text-gray-400 mt-1.5 italic">
                  * Dê duplo-clique sobre a linha para selecioná-la e preencher os dados de rastreio.
                </p>
              </div>

              {/* Lines list */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50/50">
                {lines
                  .filter(
                    (l) =>
                      l.nome.toLowerCase().includes(lineSearch.toLowerCase()) ||
                      l.codigo?.toString().includes(lineSearch),
                  )
                  .map((l) => {
                    const originAg = agencies.find((a) => a.id === l.origemAgenciaId);
                    const destAg = agencies.find((a) => a.id === l.destinoAgenciaId);

                    const handleSelectLine = () => {
                      const origLabel = originAg ? `${originAg.sigla} (${originAg.nome})` : "Origem";
                      const destLabel = destAg ? `${destAg.sigla} (${destAg.nome})` : "Destino";

                      setTrip((prev) => ({
                        ...prev,
                        linhaId: l.id,
                        nomeLinha: l.nome,
                        horarioSaida: l.horarioSaida,
                        codigoLinha: l.codigo ?? 1001,
                        descricaoLinha: l.nome,
                        codigoTrecho: `TR-${l.codigo || "0492"}`,
                        origemTrecho: origLabel,
                        destinoTrecho: destLabel,
                        agenciaOrigemSigla: originAg?.sigla || "SAO",
                        agenciaDestinoSigla: destAg?.sigla || "RIO",
                        chaveRastreio: `352605${l.codigo ?? "1001"}88921000188`,
                        codigoRastreio: `RST-${(l.codigo ?? 1001) + 9410}`,
                        codigoRotaRastreio: `ROT-${l.codigo ?? "1001"}`,
                        descricaoRotaRastreio: `ROTA PADRÃO DE REFERÊNCIA - ${l.nome}`,
                        previsaoSaida: `${prev.dataViagem || new Date().toISOString().split("T")[0]}T${l.horarioSaida || "22:00"}:00`,
                      }));
                      setIsLineModalOpen(false);
                    };

                    return (
                      <div
                        key={l.id}
                        onDoubleClick={handleSelectLine}
                        onClick={handleSelectLine}
                        className="p-3 bg-white border border-gray-100 rounded-xl hover:border-primary/50 cursor-pointer transition-all hover:shadow-xs group flex items-center justify-between"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                              Cód {l.codigo ?? "N/A"}
                            </span>
                            <span className="text-xs font-black text-gray-800 truncate group-hover:text-primary">
                              {l.nome}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 mt-1.5 text-[9px] text-gray-400 font-bold">
                            <span>{originAg?.nome || "Origem"}</span>
                            <span>➔</span>
                            <span>{destAg?.nome || "Destino"}</span>
                          </div>
                        </div>

                        <div className="text-right flex flex-col items-end flex-shrink-0">
                          <span className="text-xs font-bold text-gray-700">
                            🕒 {l.horarioSaida}
                          </span>
                          <span className="text-[8px] text-gray-400 font-black uppercase mt-0.5">
                            {(l.diasExecucao || []).join(" • ")}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* 2. Modal Selecao de Veiculos */}
        {isVehicleModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[70] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80%]"
            >
              <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-gray-800 text-sm">
                    Selecionar Veículo(s) para a Viagem
                  </h3>
                </div>
                <button
                  onClick={() => setIsVehicleModalOpen(false)}
                  className="p-1.5 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {/* Search */}
              <div className="p-4 border-b border-gray-100 bg-white">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Filtrar por placa ou modelo..."
                    value={vehicleSearch}
                    onChange={(e) => setVehicleSearch(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>

              {/* Grid / List of vehicles */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50/50">
                {vehicles
                  .filter(
                    (v) =>
                      v.placa.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
                      v.modelo.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
                      v.codigo?.toString().includes(vehicleSearch),
                  )
                  .map((v) => {
                    const isSelected = !!trip.veiculos.find((x) => x.id === v.id);

                    const handleToggleVehicle = () => {
                      if (isSelected) {
                        setTrip((prev) => ({
                          ...prev,
                          veiculos: prev.veiculos.filter((x) => x.id !== v.id),
                        }));
                      } else {
                        setTrip((prev) => ({
                          ...prev,
                          veiculos: [...prev.veiculos, v],
                        }));
                      }
                    };

                    return (
                      <div
                        key={v.id}
                        onClick={handleToggleVehicle}
                        className={cn(
                          "flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer bg-white hover:border-primary/40",
                          isSelected ? "border-primary bg-primary/2" : "border-gray-105",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                            {v.fotoUrl ? (
                              <img
                                src={v.fotoUrl}
                                alt={v.placa}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <Truck className="w-5 h-5 text-gray-300" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-gray-800">
                                {v.placa}
                              </span>
                              <span className="text-[8px] font-black bg-gray-100 text-gray-500 px-1 rounded uppercase tracking-tighter">
                                {v.tipo || "COMPLETO"}
                              </span>
                            </div>
                            <span className="text-[10px] text-gray-400 font-medium">
                              {v.modelo}
                            </span>
                          </div>
                        </div>

                        {/* Checkbox */}
                        <div
                          className={cn(
                            "w-5 h-5 rounded-lg border flex items-center justify-center transition-all",
                            isSelected ? "bg-primary border-primary text-white" : "border-gray-300 bg-white",
                          )}
                        >
                          {isSelected && (
                            <svg
                              className="w-3 h-3 stroke-current stroke-2"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Confirm footer */}
              <div className="p-3 bg-white border-t border-gray-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsVehicleModalOpen(false)}
                  className="px-5 py-2 bg-primary text-white text-xs font-black rounded-lg hover:opacity-90 transition-all uppercase tracking-wider"
                >
                  Confirmar Seleção ({trip.veiculos.length})
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* 3. Modal Selecao de Motoristas */}
        {isDriverModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[70] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80%]"
            >
              <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-gray-800 text-sm">
                    Selecionar Motorista(s)
                  </h3>
                </div>
                <button
                  onClick={() => setIsDriverModalOpen(false)}
                  className="p-1.5 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {/* Search */}
              <div className="p-4 border-b border-gray-100 bg-white">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Filtrar por nome ou CPF..."
                    value={driverSearch}
                    onChange={(e) => setDriverSearch(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>

              {/* Drivers list */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50/50">
                {drivers
                  .filter(
                    (d) =>
                      d.nome.toLowerCase().includes(driverSearch.toLowerCase()) ||
                      d.cpf.includes(driverSearch) ||
                      d.codigo?.toString().includes(driverSearch),
                  )
                  .map((d) => {
                    const isSelected = !!trip.motoristas.find((x) => x.id === d.id);

                    const handleToggleDriver = () => {
                      if (isSelected) {
                        setTrip((prev) => ({
                          ...prev,
                          motoristas: prev.motoristas.filter((x) => x.id !== d.id),
                        }));
                      } else {
                        // If no principal driver, first one becomes principal
                        const noPrincipal = !trip.motoristas.some((x) => x.isPrincipal);
                        setTrip((prev) => ({
                          ...prev,
                          motoristas: [...prev.motoristas, { ...d, isPrincipal: noPrincipal }],
                        }));
                      }
                    };

                    return (
                      <div
                        key={d.id}
                        onClick={handleToggleDriver}
                        className={cn(
                          "flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer bg-white hover:border-primary/40",
                          isSelected ? "border-primary bg-primary/2" : "border-gray-105",
                        )}
                      >
                        <div>
                          <span className="text-xs font-black text-gray-800 block">
                            {d.nome}
                          </span>
                          <span className="text-[10px] text-gray-400 font-bold">
                            CPF: {maskCpf(d.cpf)} • Código: {d.codigo}
                          </span>
                        </div>

                        {/* Checkbox */}
                        <div
                          className={cn(
                            "w-5 h-5 rounded-lg border flex items-center justify-center transition-all",
                            isSelected ? "bg-primary border-primary text-white" : "border-gray-300 bg-white",
                          )}
                        >
                          {isSelected && (
                            <svg
                              className="w-3 h-3 stroke-current stroke-2"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Confirm footer */}
              <div className="p-3 bg-white border-t border-gray-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsDriverModalOpen(false)}
                  className="px-5 py-2 bg-primary text-white text-xs font-black rounded-lg hover:opacity-90 transition-all uppercase tracking-wider"
                >
                  Confirmar Seleção ({trip.motoristas.length})
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Modal Confirmação de Cancelamento de Viagem */}
        {isCancelConfirmOpen && (
          <motion.div
            key="cancel-confirm-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[80] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col p-6 text-center gap-4"
            >
              <div className="flex justify-center">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                  <AlertCircle className="w-6 h-6" />
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-gray-900 text-sm">
                  {initialTrip.codigo === 0 && !initialTrip.isPreGenerated
                    ? "Deseja realmente cancelar esta nova viagem?"
                    : "Deseja realmente descartar as alterações?"}
                </h3>
                <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                  {initialTrip.codigo === 0 && !initialTrip.isPreGenerated
                    ? "A nova viagem complementar iniciada será cancelada e removida permanentemente. Esta ação é definitiva."
                    : "Todas as alterações feitas nesta sessão de edição serão revertidas para os valores originais."}
                </p>
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setIsCancelConfirmOpen(false)}
                  className="flex-1 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-bold rounded-lg transition-all uppercase tracking-wider cursor-pointer"
                >
                  {initialTrip.codigo === 0 && !initialTrip.isPreGenerated
                    ? "Manter Viagem"
                    : "Voltar para Edição"}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCancel}
                  className="flex-1 py-1.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold rounded-lg transition-all uppercase tracking-wider cursor-pointer"
                >
                  {initialTrip.codigo === 0 && !initialTrip.isPreGenerated
                    ? "Confirmar Cancelamento"
                    : "Confirmar Descarte"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Modal Observações de Documento Fiscal */}
        {selectedDocForObs && (
          <motion.div
            key="fiscal-obs-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[80] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col p-6 gap-4"
            >
              <div className="flex justify-between items-center pb-2 border-b border-gray-100 select-none">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <div className="text-left">
                    <h3 className="font-bold text-gray-900 text-sm">
                      Observações do {selectedDocForObs.tipo}
                    </h3>
                    <p className="text-[10px] text-gray-500 font-medium">
                      Nº {selectedDocForObs.numero || '-'} | Situação: {getNormalizeStatus(selectedDocForObs.status)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDocForObs(null)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Informações Gerais */}
              <div className="bg-gray-50 p-3 rounded-lg space-y-1 text-left">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Observação Inicial</span>
                <p className="text-[11px] text-gray-700 font-medium leading-relaxed">
                  {selectedDocForObs.observacao || "Nenhuma observação geral lançada para este documento fiscal."}
                </p>
              </div>

              {/* Grid de Motivos da Rejeição */}
              <div className="space-y-2 text-left">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
                  Grid de Rejeições / Ocorrências
                </span>
                
                <div className="border border-gray-100 rounded-xl overflow-hidden bg-white">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 select-none">
                        <th className="px-3 py-1.5 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                          Motivo
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {getNormalizeStatus(selectedDocForObs.status) === 'REJEITADO' ? (
                        (selectedDocForObs.motivosRejeicao && selectedDocForObs.motivosRejeicao.length > 0) ? (
                          selectedDocForObs.motivosRejeicao.map((motivo, idx) => (
                            <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/40">
                              <td className="px-3 py-2 text-[10px] text-red-600 font-semibold leading-normal">
                                <div className="flex items-start gap-1.5">
                                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-500 mt-0.5" />
                                  <span>{motivo}</span>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr className="border-b border-gray-50 last:border-0">
                            <td className="px-3 py-2 text-[10px] text-red-600 font-semibold leading-normal">
                              <div className="flex items-start gap-1.5">
                                <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-500 mt-0.5" />
                                <span>{selectedDocForObs.motivoRejeicao || "Inconsistência cadastral na validação junto à SEFAZ."}</span>
                              </div>
                            </td>
                          </tr>
                        )
                      ) : (
                        <tr>
                          <td className="px-3 py-5 text-center text-[10px] text-green-600 font-semibold italic">
                            <div className="flex items-center justify-center gap-1.5 select-none">
                              <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-ping" />
                              Nenhum motivo de rejeição registrado para este documento. Situação regular!
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-gray-100 select-none">
                <button
                  type="button"
                  onClick={() => setSelectedDocForObs(null)}
                  className="px-4 py-1.5 bg-primary text-white text-[10px] font-bold rounded-lg hover:bg-primary/95 transition-all uppercase tracking-wider cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Modal Preencher CIOT Manualmente */}
        {isFillCiotModalOpen && (
          <motion.div
            key="fill-ciot-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[80] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col p-6 gap-4"
            >
              <div className="flex justify-between items-center pb-2 border-b border-gray-100 select-none">
                <div className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-green-600" />
                  <div className="text-left font-sans">
                    <h3 className="font-bold text-gray-900 text-sm">
                      Preencher CIOT Manualmente
                    </h3>
                    <p className="text-[10px] text-gray-500 font-medium">
                      Insira as informações financeiras e fiscais do CIOT
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsFillCiotModalOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3.5 text-left select-none max-h-[70vh] overflow-y-auto pr-1">
                {/* Número do CIOT */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">
                    Número do CIOT *
                  </label>
                  <input
                    type="text"
                    required
                    value={ciotNumero}
                    onChange={(e) => setCiotNumero(e.target.value)}
                    placeholder="Ex: 902187329487"
                    className="w-full px-3 py-2 border border-gray-100 rounded-lg text-xs font-semibold focus:outline-none focus:border-primary/50 text-gray-800 placeholder-gray-400 font-mono"
                  />
                </div>

                {/* Código Verificador */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">
                    Código Verificador *
                  </label>
                  <input
                    type="text"
                    required
                    value={ciotCodigoVerificador}
                    onChange={(e) => setCiotCodigoVerificador(e.target.value)}
                    placeholder="Ex: 5821"
                    className="w-full px-3 py-2 border border-gray-100 rounded-lg text-xs font-semibold focus:outline-none focus:border-primary/50 text-gray-800 placeholder-gray-400 font-mono"
                  />
                </div>

                {/* Valor Frete */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">
                    Valor Frete (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={ciotValorFrete}
                    onChange={(e) => setCiotValorFrete(e.target.value)}
                    placeholder="Ex: 1500.00"
                    className="w-full px-3 py-2 border border-gray-100 rounded-lg text-xs font-semibold focus:outline-none focus:border-primary/50 text-gray-800"
                  />
                </div>

                {/* Valor Pedágio */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">
                    Valor Pedágio (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={ciotValorPedagio}
                    onChange={(e) => setCiotValorPedagio(e.target.value)}
                    placeholder="Ex: 145.20"
                    className="w-full px-3 py-2 border border-gray-100 rounded-lg text-xs font-semibold focus:outline-none focus:border-primary/50 text-gray-800"
                  />
                </div>

                {/* Situação / Status */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">
                    Situação (Status)
                  </label>
                  <select
                    value={ciotStatus}
                    onChange={(e) => setCiotStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-100 rounded-lg text-xs font-semibold focus:outline-none focus:border-primary/50 text-gray-800"
                  >
                    <option value="AUTORIZADO">AUTORIZADO</option>
                    <option value="PENDENTE">PENDENTE</option>
                    <option value="REJEITADO">REJEITADO</option>
                  </select>
                </div>

                {/* Caso seja rejeitado, preencher os motivos */}
                {ciotStatus === 'REJEITADO' && (
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-red-400 uppercase tracking-widest block">
                      Motivo(s) da Rejeição *
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-red-100 bg-red-50/10 rounded-lg text-xs font-semibold focus:outline-none focus:border-red-400/50 text-red-800 placeholder-red-400"
                      value={ciotMotivoRejeicao}
                      onChange={(e) => setCiotMotivoRejeicao(e.target.value)}
                      placeholder="Ex: Placa inativa, CPF inválido"
                    />
                  </div>
                )}

                {/* Observação Geral */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">
                    Observação Geral
                  </label>
                  <textarea
                    rows={2}
                    value={ciotObservacao}
                    onChange={(e) => setCiotObservacao(e.target.value)}
                    placeholder="Ex: Preenchimento manual de contingência..."
                    className="w-full px-3 py-1.5 border border-gray-100 rounded-lg text-xs font-semibold focus:outline-none focus:border-primary/50 text-gray-800 placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-gray-100 select-none">
                <button
                  type="button"
                  onClick={() => setIsFillCiotModalOpen(false)}
                  className="flex-1 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-bold rounded-lg transition-all uppercase tracking-wider cursor-pointer font-sans"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveManualCiot}
                  className="flex-1 py-1.5 bg-green-600 hover:bg-green-700 text-white text-[10px] font-bold rounded-lg transition-all uppercase tracking-wider cursor-pointer font-sans font-black"
                >
                  Salvar CIOT
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Modal Sucesso CIOT */}
        {isCiotSuccessModalOpen && (
          <motion.div
            key="ciot-success-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[90] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col p-6 items-center text-center gap-4 select-none"
            >
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-500">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-black text-gray-950 uppercase tracking-widest">
                  CIOT preenchido com sucesso
                </h3>
                <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                  Os dados financeiros e fiscais do CIOT foram vinculados com sucesso à documentação da viagem.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCiotSuccessModalOpen(false)}
                className="w-full py-2 bg-green-600 hover:bg-green-700 text-white text-[10px] font-black rounded-lg uppercase tracking-widest cursor-pointer transition-all shadow-md hover:shadow-lg"
              >
                Entendido
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Modal Sucesso Salvar Viagem */}
        {isSaveSuccessModalOpen && (
          <motion.div
            key="save-success-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[90] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col p-6 items-center text-center gap-4 select-none"
            >
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-500">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-black text-gray-950 uppercase tracking-widest">
                  Viagem salva com sucesso
                </h3>
                <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                  Os dados da viagem foram salvos com sucesso e armazenados no banco de dados.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsSaveSuccessModalOpen(false);
                  setIsEditing(false);
                }}
                className="w-full py-2 bg-green-600 hover:bg-green-700 text-white text-[10px] font-black rounded-lg uppercase tracking-widest cursor-pointer transition-all shadow-md hover:shadow-lg"
              >
                Entendido
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
