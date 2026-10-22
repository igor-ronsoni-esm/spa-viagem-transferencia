import { HeaderAtom } from "./header";
import { HeaderBreadcrumbs } from "./HeaderBreadCrumbs";
import { HeaderTitle } from "./HeaderTitle";

export const Header = {
  Root: HeaderAtom,
  Title: HeaderTitle,
  Breadcrumb: HeaderBreadcrumbs
}
export { default as HeaderBreadcrumbsComplete } from "./HeaderBreadcrumbsComplete"