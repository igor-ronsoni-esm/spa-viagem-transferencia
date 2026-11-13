import { useFormContext, type RegisterOptions } from "react-hook-form";

// Mantém só dígitos (máx. 4) e insere ":" depois das horas
const formatarTempo = (valor: string): string => {
  const digitos = valor.replace(/\D/g, "").slice(0, 4);
  if (digitos.length <= 2) return digitos;

  let minutos = digitos.slice(2);
  if (minutos.length === 2 && Number(minutos) > 59) minutos = "59";

  return `${digitos.slice(0, 2)}:${minutos}`;
};

// Completa o formato ao sair do campo (ex.: "2" vira "02:00", "1:5" vira "01:50")
const completarTempo = (valor: string): string => {
  if (!valor) return "";
  const [horas = "", minutos = ""] = valor.split(":");
  return `${horas.padStart(2, "0")}:${minutos.padEnd(2, "0")}`;
};

// Converte "HH:MM" em total de minutos
export const paraMinutos = (valor?: string | null): number => {
  if (!valor) return 0;
  const [horas = "0", minutos = "0"] = valor.split(":");
  return Number(horas || 0) * 60 + Number(minutos || 0);
};

type InputTempoProps = {
  name: string;
  disabled?: boolean;
  rules?: RegisterOptions;
  ariaLabel?: string;
  onChange?: (valor: string) => void;
};

export function TempoPercursoInput({
  name,
  rules,
  ariaLabel = "Tempo de percurso",
  disabled,
  onChange,
}: InputTempoProps) {
  const { register, formState: { errors } } = useFormContext();

  const { onChange: onChangeForm, onBlur, ref, ...campo } = register(name, rules);

  const erro = errors[name]?.message as string | undefined;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.target.value = formatarTempo(event.target.value);
    onChange?.(event.target.value);
    return onChangeForm(event);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.value = completarTempo(event.target.value);
    return onBlur(event);
  };

  return (
    <div className="flex flex-col gap-1">
      <input
        {...campo}
        ref={ref}
        type="text"
        inputMode="numeric"
        placeholder="HH:MM"
        aria-label={ariaLabel}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
        className="w-20 rounded-lg border border-gray-200 px-2 py-1.5 text-center text-xs text-gray-800 placeholder-gray-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 disabled:bg-gray-100 disabled:text-gray-400"
      />
      {erro && <span className="text-[10px] text-red-500">{erro}</span>}
    </div>
  );
}