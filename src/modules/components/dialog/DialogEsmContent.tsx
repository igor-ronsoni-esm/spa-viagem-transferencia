import { DialogContent } from "@mui/material";
import React from "react";

export type DialogContentProps = {
  children: React.ReactNode;
} & React.ComponentProps<typeof DialogContent>;

export const DialogEsmContent = ({ children, ...rest }: Readonly<DialogContentProps>) => {
  return (
    <DialogContent className="flex flex-col p-4!" {...rest}>
      {children}
    </DialogContent>
  );
};
