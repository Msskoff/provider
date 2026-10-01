import Link from "next/link";

import { copy } from "@/lib/copy";
import { MAIN_NAV, ROUTES } from "@/lib/routes";
import { site } from "@/lib/site";

import styles from "./SiteHeader.module.css";

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link
          href={ROUTES.home}
          className={styles.brand}
          aria-label={copy.layout.homeLinkLabel}
        >
          {site.name}
        </Link>
        <nav aria-label={copy.layout.mainNavLabel}>
          <ul className={styles.nav}>
            {MAIN_NAV.map((routeId) => (
              <li key={routeId}>
                <Link href={ROUTES[routeId]} className={styles.link}>
                  {copy.routes[routeId]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
