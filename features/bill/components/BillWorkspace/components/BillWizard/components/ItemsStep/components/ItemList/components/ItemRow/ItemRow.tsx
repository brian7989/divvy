import { Group, Paper } from "@mantine/core";
import { useBillStore } from "@/features/bill/store/bill.store";
import styles from "../../ItemList.module.css";
import { ItemActions } from "./components/ItemActions/ItemActions";
import { ItemDetails } from "./components/ItemDetails/ItemDetails";
import { ItemOwners } from "./components/ItemOwners/ItemOwners";

type Props = { itemId: string };

export function ItemRow({ itemId }: Props) {
  const hasOwners = useBillStore((state) =>
    Boolean(state.bill.items.find(({ id }) => id === itemId)?.ownerIds.length),
  );
  return (
    <Paper className={`${styles.item} ${hasOwners ? "" : styles.unassigned}`}>
      <Group justify="space-between" wrap="nowrap">
        <ItemDetails itemId={itemId} />
        <Group gap="xs" wrap="nowrap">
          <ItemOwners itemId={itemId} />
          <ItemActions itemId={itemId} />
        </Group>
      </Group>
    </Paper>
  );
}
