"use client";

import React from "react";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";
import { usePathname } from "next/navigation";
import { Header } from ".";
import { BreadcrumbsProps } from "./HeaderBreadCrumbs";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { Pages } from "@configs/routes/routes-type";
import { menu } from "@configs/routes/route-configuration";
import { HelpDialog } from "@components/help/help.dialog";

type CompanyInfo = {
  code: number;
  acronym: string;
  name: string;
  active: boolean;
};

export type HeaderBreadcrumbsCompleteProps = {
  helpPath?: string;
  helpTitle?: string;
  breadcrumbs?: BreadcrumbsProps[];
  company?: CompanyInfo;
};

export default function HeaderBreadcrumbsComplete({
  helpPath,
  helpTitle,
  breadcrumbs: manualBreadcrumbs,
  company,
}: Readonly<HeaderBreadcrumbsCompleteProps>) {
  const findBreadcrumbPath = (currentRoute: string): Pages[] => {
    const path: Pages[] = [];

    function search(pages: Pages[], stack: Pages[]): boolean {
      for (const page of pages) {
        const newStack = [...stack, page];

        if (page.route === currentRoute) {
          path.push(...newStack);
          return true;
        }

        if (page.subpages && search(page.subpages, newStack)) {
          return true;
        }
      }
      return false;
    }

    for (const group of menu) {
      for (const page of group.pages) {
        if (search([page], [])) {
          break;
        }
      }
    }

    return path;
  };
  const [openHelp, setOpenHelp] = React.useState(false);
  const pathname = usePathname();

  const autoBreadcrumbs = React.useMemo(() => {
    const pages = findBreadcrumbPath(pathname);
    if (pages.length === 0) return [];

    return pages.map((page: Pages) => ({
      title: page.name,
      link: page.route,
    }));
  }, [pathname]);

  const breadcrumbs = manualBreadcrumbs ?? autoBreadcrumbs;

  return (
    
    <Header.Root>
      <Header.Breadcrumb breadcrumbs={breadcrumbs} />
      <Box className="grow" />

      {company && (
        <Box className="flex items-center mr-12 shrink-0 whitespace-nowrap">
          <Tooltip title={company.active ? "Empresa Ativa" : "Empresa Inativa"} arrow>
            {company.active ? (
              <CheckCircleIcon color="info" className="mr-1" />
            ) : (
              <RemoveCircleIcon color="error" className="mr-1" />
            )}
          </Tooltip>
          <Typography variant="subtitle2" component="span" className="font-semibold">
            {`${company.acronym} - ${company.name}`}
          </Typography>
        </Box>
      )}

      {helpPath && (
        <Box className="flex items-center gap-2">
          <Tooltip title="Ajuda" arrow>
            <IconButton color="primary" size="medium" onClick={() => setOpenHelp(true)}>
              <HelpIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      <HelpDialog
        open={openHelp}
        handleClose={() => setOpenHelp(false)}
        path={helpPath ?? ""}
        title={helpTitle ?? "Ajuda"}
      />
    </Header.Root>
  );
}
