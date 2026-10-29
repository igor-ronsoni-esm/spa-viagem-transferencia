// A regra "Vigência Inicial > hoje" é de negócio brasileiro: "hoje" é a data em Brasília, não a
// do fuso do servidor Next (em container costuma ser UTC — depois das 21h a data já viraria).
const FUSO_NEGOCIO = "America/Sao_Paulo";

const FORMATADOR_DATA_ISO = new Intl.DateTimeFormat("en-CA", {
  timeZone: FUSO_NEGOCIO,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const FORMATADOR_DATA_HORA_ISO = new Intl.DateTimeFormat("pt-BR", {
  timeZone: FUSO_NEGOCIO,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

/** Data de hoje no formato `YYYY-MM-DD`, no fuso do negócio. `agora` existe para os testes. */
export function hojeISO(agora: Date = new Date()): string {
  return FORMATADOR_DATA_ISO.format(agora);
}

/** Recorta a parte de data de um LocalDateTime da API (`2026-07-01T00:00:00` → `2026-07-01`). */
export function somenteData(valor: string | null | undefined): string {
  return valor ? valor.split("T")[0] : "";
}

/** Dia seguinte a `dataISO` (`YYYY-MM-DD`) — usado como `min` do campo Vigência Inicial. */
export function diaSeguinteISO(dataISO: string): string {
  const [ano, mes, dia] = dataISO.split("-").map(Number);
  // UTC de propósito: só soma um dia de calendário, sem depender do fuso da máquina.
  const proximo = new Date(Date.UTC(ano, mes - 1, dia + 1));
  return proximo.toISOString().slice(0, 10);
}

export function converterParaUTC(data: Date): Date {
  const partes = new Intl.DateTimeFormat("en-CA", {
    timeZone: FUSO_NEGOCIO,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(data);

  const valores = Object.fromEntries(
    partes.map(({ type, value }) => [type, Number(value)]),
  );

  return new Date(
    Date.UTC(
      valores.year,
      valores.month - 1,
      valores.day,
      valores.hour,
      valores.minute,
      valores.second,
      data.getMilliseconds(),
    ),
  );
}

export function dataAoMeioDia(dataISO: string): Date {
  const [ano, mes, dia] = dataISO.split("-").map(Number);

  return new Date(Date.UTC(ano, mes - 1, dia, 12, 0, 0, 0));
}

export function dataHoraISO(agora: Date = new Date()): string {
  return FORMATADOR_DATA_HORA_ISO.format(agora).replace(",", "");
}