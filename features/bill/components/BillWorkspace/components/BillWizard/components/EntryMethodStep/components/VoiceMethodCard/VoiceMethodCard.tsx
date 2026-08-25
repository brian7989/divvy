import { UnstyledButton } from "@mantine/core";
import { IconMicrophone } from "@tabler/icons-react";
import styles from "@/features/bill/components/BillWorkspace/BillWorkspace.module.css";

/** Previews the planned voice entry mode without requesting microphone access. */
export function VoiceMethodCard() {
  return (
    <UnstyledButton
      className={`${styles.methodCard} ${styles.voiceMethodCard}`}
      disabled
    >
      <span className={styles.comingSoonBadge}>Coming soon</span>
      <span className={styles.methodIcon}>
        <IconMicrophone size={24} />
      </span>
      <span className={styles.voiceMethodCopy}>
        <strong>Voice mode</strong>
        <span className={styles.methodDescription}>Say the items</span>
      </span>
    </UnstyledButton>
  );
}

