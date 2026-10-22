'use client';

import { Breadcrumbs } from '@components/breadcrumbs';
import { v4 as uuid } from 'uuid';

export type BreadcrumbsProps = {
  title: string;
  link?: string;
};

export type HeaderBreadcrumbsProps = {
  breadcrumbs: BreadcrumbsProps[];
};

export const HeaderBreadcrumbs = ({ breadcrumbs }: HeaderBreadcrumbsProps) => {
  return (
    <Breadcrumbs.Root>
      {breadcrumbs.map((item, index) => {
        if (index !== breadcrumbs.length - 1) return <Breadcrumbs.Link key={uuid()} title={item.title} link={item.link ?? "/"}/>;
        else return <Breadcrumbs.Target key={uuid()} title={item.title}/>;
      })}
    </Breadcrumbs.Root>
  );
};
