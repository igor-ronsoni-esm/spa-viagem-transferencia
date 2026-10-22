import { Link } from "@mui/material";

export type BreadcrumbsLinkProps = {
  title: string;
  link: string;
};

export const BreadcrumbsLink = ({ title, link }: BreadcrumbsLinkProps) => {
  return (
    <Link underline="hover" color="inherit" href={link}>
      {title}
    </Link>
  );
};
