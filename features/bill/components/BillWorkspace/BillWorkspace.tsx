"use client";

import {
  ActionIcon,
  Box,
  Group,
  Loader,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconRefresh } from "@tabler/icons-react";
import { useState } from "react";
import { useBillPersistence } from "../../hooks/useBillPersistence";
import { usePwa } from "../../hooks/usePwa";
import { useBillStore } from "../../model/bill.store";
import { BillSummary } from "./components/BillSummary/BillSummary";
import { ItemList } from "./components/ItemList/ItemList";
import { PeopleBar } from "./components/PeopleBar/PeopleBar";
import { AssignmentModal } from "./components/modals/AssignmentModal";
import { ItemEditorModal } from "./components/modals/ItemEditorModal";
import { PeopleModal } from "./components/modals/PeopleModal";
import styles from "./BillWorkspace.module.css";

export function BillWorkspace() {
  usePwa();
  const hydrated = useBillPersistence();
  const bill = useBillStore((state) => state.bill);
  const updateTitle = useBillStore((state) => state.updateTitle);
  const reset = useBillStore((state) => state.reset);
  const [peopleOpen, setPeopleOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null | undefined>(
    undefined,
  );
  const [assigningItemId, setAssigningItemId] = useState<string | null>(null);

  const startNewBill = () =>
    modals.openConfirmModal({
      title: "Start a new bill?",
      children: (
        <Text size="sm" c="dimmed">
          Your current bill stays saved in your device history.
        </Text>
      ),
      labels: { confirm: "Start new bill", cancel: "Keep editing" },
      confirmProps: { color: "coral" },
      onConfirm: reset,
    });

  if (!hydrated)
    return (
      <Box mih="100vh" display="grid" style={{ placeItems: "center" }}>
        <Loader color="coral" />
      </Box>
    );

  return (
    <main className={styles.shell}>
      <header className={styles.topbar}>
        <div className={styles.brand}>
          <span className={styles.mark}>D</span> divvy
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
      <div className={styles.workspace}>
        <section className={styles.main}>
          <Text className={styles.saved}>Saved on this device</Text>
          <TextInput
            className={styles.title}
            variant="unstyled"
            value={bill.title}
            onChange={(event) => updateTitle(event.currentTarget.value)}
            aria-label="Bill name"
          />
          <div className={styles.people}>
            <PeopleBar
              people={bill.people}
              onManage={() => setPeopleOpen(true)}
            />
          </div>
          <Group justify="space-between" align="center" mb={4}>
            <div className={styles.sectionTitle}>
              <span className={styles.step}>1</span>
              <Title order={2} size="h3">
                Who had what?
              </Title>
            </div>
            <Text
              size="xs"
              fw={700}
              c={
                bill.items.some((item) => !item.ownerIds.length)
                  ? "orange.8"
                  : "teal.7"
              }
            >
              {bill.items.filter((item) => !item.ownerIds.length).length ||
                "All"}{" "}
              {bill.items.some((item) => !item.ownerIds.length)
                ? "unassigned"
                : "assigned"}
            </Text>
          </Group>
          <Text size="sm" c="dimmed" ml={40} mb="md">
            Tap an item, then choose everyone who shared it.
          </Text>
          <ItemList
            items={bill.items}
            people={bill.people}
            onAssign={setAssigningItemId}
            onAdd={() => setEditingItemId(null)}
            onEdit={setEditingItemId}
          />
        </section>
        <aside className={styles.summary}>
          <BillSummary />
        </aside>
      </div>
      <PeopleModal opened={peopleOpen} onClose={() => setPeopleOpen(false)} />
      <ItemEditorModal
        itemId={editingItemId}
        opened={editingItemId !== undefined}
        onClose={() => setEditingItemId(undefined)}
      />
      <AssignmentModal
        itemId={assigningItemId}
        opened={Boolean(assigningItemId)}
        onClose={() => setAssigningItemId(null)}
        onEdit={(id) => {
          setAssigningItemId(null);
          setEditingItemId(id);
        }}
      />
    </main>
  );
}
