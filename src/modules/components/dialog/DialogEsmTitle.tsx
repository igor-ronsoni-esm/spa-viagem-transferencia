import { Box, DialogTitle, IconButton, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";

export type DialogEsmTitleProps = {
  title?: string;
  handleClose: () => void;
} & React.ComponentProps<typeof DialogTitle>;

export const DialogEsmTitle = ({ title, handleClose, ...rest }: Readonly<DialogEsmTitleProps>) => {
  return (
    <Box className="flex flex-row w-full items-center justify-between bg-primary">
      <DialogTitle id="alert-dialog-title" color="white" {...rest}>
        {title ?? "Expresso São Miguel"}
      </DialogTitle>
      <Tooltip arrow title="Fechar">
        <IconButton onClick={handleClose}>
          <CloseIcon sx={{ color: "white" }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
};
