export function resetarViagemNaUrl(searchParams: { toString(): string }): string {
 const params = new URLSearchParams(searchParams.toString());

  params.delete("viagem");
  params.delete("modoEdicao");

  const query = params.toString();
  return query ? `?${query}` : "";
}