import Link from "next/link";

import { copy } from "@/lib/copy";
import { FOOTER_NAV, ROUTES } from "@/lib/routes";
import { listSocialProfiles, site } from "@/lib/site";

import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  const socialProfiles = listSocialProfiles({ socials: site.socials });

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.identity}>
          <strong>{site.name}</strong> · {copy.layout.location}
        </p>
        <nav aria-label={copy.layout.footerNavLabel}>
          <ul className={styles.list}>
            {FOOTER_NAV.map((routeId) => (
              <li key={routeId}>
                <Link href={ROUTES[routeId]} className={styles.link}>
                  {copy.routes[routeId]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {socialProfiles.length > 0 ? (
          <nav aria-label={copy.layout.socialNavLabel}>
            <ul className={styles.list}>
              {socialProfiles.map((profile) => (
                <li key={profile.network}>
                  <a
                    href={profile.url}
                    className={styles.link}
                    rel="me noopener"
                  >
                    {copy.socials[profile.network]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </div>
    </footer>
  );
}
