"use client";

import { Box, Loader } from "@mantine/core";
import { useBillHydration } from "../../hooks/useBillHydration";
import { usePwa } from "../../hooks/usePwa";
import { BillWizard } from "./components/BillWizard/BillWizard";
import { AssignmentModal } from "./components/modals/AssignmentModal/AssignmentModal";
import { ItemEditorModal } from "./components/modals/ItemEditorModal/ItemEditorModal";
import { PeopleModal } from "./components/modals/PeopleModal/PeopleModal";
import { WorkspaceHeader } from "./components/WorkspaceHeader/WorkspaceHeader";
import styles from "./BillWorkspace.module.css";

export function BillWorkspace() {
  usePwa();
  const hydrated = useBillHydration();

  if (!hydrated)
    return (
      <Box mih="100vh" display="grid" style={{ placeItems: "center" }}>
        <Loader color="party" />
      </Box>
    );

  return (
    <main className={styles.shell}>
      <WorkspaceHeader />
      <div className={styles.workspace}>
        <BillWizard />
      </div>
      <PeopleModal />
      <ItemEditorModal />
      <AssignmentModal />
    </main>
  );
}
