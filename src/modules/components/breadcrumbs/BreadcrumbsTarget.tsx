import { Typography } from "@mui/material";

export type BreadcrumbsTargetProps = {
  title: string;
};

export const BreadcrumbsTarget = ({ title }: BreadcrumbsTargetProps) => {
  return <Typography sx={{ color: "text.primary" }}>{title}</Typography>;
};
