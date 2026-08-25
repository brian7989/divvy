import { Group, Text, ThemeIcon } from "@mantine/core";
import type { ReactNode } from "react";
import styles from "./InstallStep.module.css";

type Props = {
  description: string;
  icon: ReactNode;
  number: number;
  title: string;
};

export function InstallStep({ description, icon, number, title }: Props) {
  return (
    <Group className={styles.step} gap="md">
      <div className={styles.icon}>
        <ThemeIcon size={44} radius="md" variant="light" color="party">
          {icon}
        </ThemeIcon>
        <span className={styles.number}>{number}</span>
      </div>
      <div>
        <Text fw={750}>{title}</Text>
        <Text size="sm" c="dimmed">
          {description}
        </Text>
      </div>
    </Group>
  );
}
