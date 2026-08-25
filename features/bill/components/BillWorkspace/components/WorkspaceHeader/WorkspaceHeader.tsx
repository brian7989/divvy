import { ActionIcon, Text, Tooltip } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconRefresh } from "@tabler/icons-react";
import Image from "next/image";
import { useBillStore } from "@/features/bill/store/bill.store";
import styles from "../../BillWorkspace.module.css";

export function WorkspaceHeader() {
  const reset = useBillStore((state) => state.reset);
  const goToStep = useBillStore((state) => state.goToStep);
  const startNewBill = () =>
    modals.openConfirmModal({
      title: "Start a new bill?",
      children: (
        <Text size="sm" c="dimmed">
          Your current bill stays saved in your device history.
        </Text>
      ),
      labels: { confirm: "Start new bill", cancel: "Keep editing" },
      confirmProps: { color: "party" },
      onConfirm: () => {
        reset();
        goToStep("people");
      },
    });

  return (
    <header className={styles.topbar}>
      <div className={styles.brand}>
        <Image
          className={styles.mark}
          src="/icon.svg?v=receipt"
          width={35}
          height={35}
          alt=""
          aria-hidden="true"
        />
        divvy
      </div>
      <Tooltip label="Start a new bill">
        <ActionIcon
          variant="default"
          radius="xl"
          size="lg"
          onClick={startNewBill}
          aria-label="Start a new bill"
        >
          <IconRefresh size={18} />
        </ActionIcon>
      </Tooltip>
    </header>
  );
}
