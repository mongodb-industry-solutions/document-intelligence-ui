"use client";

import Icon from "@leafygreen-ui/icon";
import { Body } from "@leafygreen-ui/typography";
import UserMenu from "./UserMenu";
import styles from "./HeaderActions.module.css";

// Browser-facing URL of the standalone BIAN Data Model Explorer. A NEXT_PUBLIC_*
// var so it can be read here in a client component; baked at build time (see
// Dockerfile.frontend / .drone.yml). Unset (local dev) → deployed staging
// explorer, since this repo's docker-compose does not run the explorer.
const BIAN_MODEL_URL =
  process.env.NEXT_PUBLIC_BIAN_MODEL_URL ||
  "https://leafy-bank-bian-model.industrysolutions.staging.corp.mongodb.com";

/**
 * Top-right actions cluster shared across the app: a link out to the BIAN Data
 * Model Explorer (with this demo's lens) and the switch-user panel.
 */
export default function HeaderActions() {
  return (
    <div className={styles.actions}>
      <a
        href={`${BIAN_MODEL_URL}/bian-data-model?demo=document-intelligence`}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.bianModelLink}
        title="Explore the BIAN-aligned data model"
      >
        <Icon glyph="Visibility" size="small" />
        <Body weight="medium">View Data Model</Body>
      </a>
      <UserMenu />
    </div>
  );
}
