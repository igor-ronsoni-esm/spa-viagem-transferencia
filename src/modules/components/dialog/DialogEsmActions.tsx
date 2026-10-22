import { DialogActions } from "@mui/material";
import React from "react";

export type DialogEsmActionsProps = {
  children: React.ReactNode
} & React.ComponentProps<typeof DialogActions>;

export const DialogEsmActions = ({ children, ...rest }: Readonly<DialogEsmActionsProps>) => {
  return (
    <DialogActions className="p-4! pt-0!" {...rest}>
      {children}
    </DialogActions>
  );
};
