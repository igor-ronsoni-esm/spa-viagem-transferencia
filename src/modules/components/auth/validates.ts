import { FormType } from "@configs/routes/routes-type";
import Swal from "sweetalert2";

export const authorized = (
  auth: boolean,
  form?: FormType,
): boolean => {
  if (auth === true) {
    return true;
  }
  if (form) {
    Swal.fire({
      icon: "warning",
      title: "Oops...",
      text: "Parece que você não tem permissão para esta operação",
      footer: form?.label ?? undefined,
    });
  }
  return false;
};
