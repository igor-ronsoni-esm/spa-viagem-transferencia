import { Dialog } from "@mui/material";
import React from "react";
import { Transition } from "./Transition";

export type DialogEsmRootProps = {
  children: React.ReactNode;
  open: boolean;
  transition?: boolean
} & React.ComponentProps<typeof Dialog>;

export const DialogEsmRoot = ({ children, open, transition, ...rest }: Readonly<DialogEsmRootProps>) => {
  return (
    <Dialog open={open} {...rest}  slots={{
        transition: transition ? Transition : undefined,
      }}>
      {children}
    </Dialog>
  );
};
