'use client';

import { Typography } from "@mui/material";

export type HeaderProps = {
  title: string;
};

export const HeaderTitle = ({ title }: HeaderProps) => {
  return <Typography variant="h6">{title}</Typography>;
};
