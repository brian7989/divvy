import { Button } from "@mantine/core";
import { useState } from "react";
import { BillSettingsModal } from "./components/BillSettingsModal/BillSettingsModal";

export function BillSettings() {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Button
        variant="subtle"
        size="compact-sm"
        onClick={() => setOpened(true)}
      >
        Edit tax, tip & discounts
      </Button>
      <BillSettingsModal opened={opened} onClose={() => setOpened(false)} />
    </>
  );
}
