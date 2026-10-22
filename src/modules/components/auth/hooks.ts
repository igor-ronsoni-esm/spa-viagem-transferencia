"use client";

import { useContext } from "react";
import { AuthContext } from "./context";
import { FormType } from "@configs/routes/routes-type";
import { permissions_initializer, PermissionsForm } from "./esm-auth";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth precisa estar dentro de AuthProvider");
  return context
};

export const useAuthPermissions = (formName: FormType): PermissionsForm => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth precisa estar dentro de AuthProvider");
  return context.getPermissions(formName.code) ?? permissions_initializer;
};
