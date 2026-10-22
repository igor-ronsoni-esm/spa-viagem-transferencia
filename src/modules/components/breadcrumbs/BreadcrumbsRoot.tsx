'use client';

import { ReactNode } from "react";
import { Breadcrumbs } from "@mui/material";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export type BreadcrumbsRootProps = {
  children: ReactNode;
};

export const BreadcrumbsRoot = ({ children }: BreadcrumbsRootProps) => {
  return (
    <Breadcrumbs maxItems={4} aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />}>
      {children}
    </Breadcrumbs>
  );
};
