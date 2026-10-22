export default class StringUtil {
  public static isEmptyOrNull(value: any): boolean {
    if (value === null || value === undefined) return true;
    if (typeof value === "string" && value.trim() === "") return true;
    if (Array.isArray(value) && value.length === 0) return true;
    if (typeof value === "object" && Object.keys(value).length === 0)
      return true;
    return false;
  }

  public static getValueByPath(obj: any, path: string): any {
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
  }

  public static formatCPFCNPJ(value: string) {
    if (!value) return "";
    const numbers = value.replace(/\D/g, "");

    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }

    return numbers
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
  }

  public static formatDate(value: string): string {
    if (!value) return '';

    const [date, time] = value.split('T');
    const [year, month, day] = date.split('-');
    const [hour, minute, _] = time.split(':');

    return `${day}/${month}/${year} ${hour}:${minute}`;
  }

  public static formatDateOnly(value: string): string {
    if (!value) return '';

    const [date] = value.split('T');
    const [year, month, day] = date.split('-');

    return `${day}/${month}/${year}`;
  }

  public static formatReal(valor: number): string {
    if (!valor) return "R$ -";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  }
}
