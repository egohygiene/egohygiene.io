import { forwardRef } from "react";
import {
  Link,
  type LinkProps,
  NavLink,
  type NavLinkProps,
  parsePath,
  type To,
} from "react-router-dom";

import { useSiteLocale } from "./LocaleProvider";
import { getRequestedLocale, withLocaleSearch } from "./selection";

function useLocaleDestination(to: To): To {
  const selection = useSiteLocale();
  // Provider handoffs and other absolute destinations must never receive language parameters.
  if (
    !selection?.preserveSelection ||
    (typeof to === "string" && /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(to))
  )
    return to;
  const destination = typeof to === "string" ? parsePath(to) : to;
  if (getRequestedLocale(selection.registry, destination.search ?? "")) return to;
  return {
    ...destination,
    search: withLocaleSearch(selection.registry, destination.search ?? "", selection.locale.id),
  };
}

export const LocaleLink = forwardRef<HTMLAnchorElement, LinkProps>(function LocaleLink(
  { to, ...props },
  ref,
) {
  return <Link {...props} to={useLocaleDestination(to)} ref={ref} />;
});

export const LocaleNavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(function LocaleNavLink(
  { to, ...props },
  ref,
) {
  return <NavLink {...props} to={useLocaleDestination(to)} ref={ref} />;
});
