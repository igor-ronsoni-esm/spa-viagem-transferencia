"use client";

import { Backdrop, Paper } from "@mui/material";
import { Loading } from "./Loading";

type LoadingBackdropProps = {
  open: boolean;
  description?: string;
  progress?: boolean;
  value?: number;
};

export const LoadingBackdrop = ({
  open,
  description = "Aguarde...",
  progress,
  value,
}: LoadingBackdropProps) => {
  if (!open) return null;
  
  return (
    <Backdrop
      open={open}
      sx={{
        zIndex: () => 1500,
        color: "#fff",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "25%",
          minHeight: "30%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 4,
          borderRadius: 2,
        }}
      >
        <Loading
          description={description}
          progress={progress}
          value={value}
        />
      </Paper>
    </Backdrop>
  );
};
