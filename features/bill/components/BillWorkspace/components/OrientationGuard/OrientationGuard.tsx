import { IconRotateClockwise2 } from "@tabler/icons-react";
import styles from "../../BillWorkspace.module.css";

/** Blocks unsupported landscape use in installed mobile PWAs. */
export function OrientationGuard() {
  return (
    <aside className={styles.orientationGuard} role="status">
      <span className={styles.orientationIcon} aria-hidden="true">
        <IconRotateClockwise2 size={34} stroke={2.2} />
      </span>
      <strong>Portrait only</strong>
      <span>Rotate your phone</span>
    </aside>
  );
}
