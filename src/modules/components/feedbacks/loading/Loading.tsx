"use client";

import { CircularProgress, Typography } from "@mui/material";

export type LoadingProps = {
  description?: string;
  progress?: boolean;
  value?: number;
};

export const Loading = ({
  description,
  progress = false,
  value,
}: Readonly<LoadingProps>) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center w-15 h-15">
        <CircularProgress
          variant={progress ? "determinate" : "indeterminate"}
          value={value}
          size={80}
          thickness={2}
          className={`absolute text-primary! ${!progress ? "slow-spin-mui" : ""}`}
        />
        {/* Precisa viver em /static: das pastas de assets, é a única que o matcher do
            middleware de auth (src/proxy.ts) deixa passar. Este Loading roda na tela de
            login, com o usuário ainda não autenticado — de qualquer outro caminho o
            NextAuth responderia com redirect para /login em vez do arquivo. */}
        <img
          src="/static/logo.gif"
          alt="Logo ESM"
          className="object-contain"
        />
      </div>
      <Typography variant="body1" className="pt-4">{description}</Typography>
      
    </div>
  );
};
