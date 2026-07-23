"use client";

import { usePathname } from "next/navigation";
import HeaderActions from "./HeaderActions";
import styles from "./GlobalHeaderActions.module.css";

/**
 * Renders the shared top-right actions cluster as a fixed overlay on pages that
 * have no header of their own (Use Case, Sources). On the Document Intelligence
 * step, AppHeader renders HeaderActions inline instead, so this returns null
 * there to avoid overlapping the Start Over button.
 */
export default function GlobalHeaderActions() {
  const pathname = usePathname();
  if (pathname?.includes("/document-intelligence")) return null;

  return (
    <div className={styles.overlay}>
      <HeaderActions />
    </div>
  );
}
