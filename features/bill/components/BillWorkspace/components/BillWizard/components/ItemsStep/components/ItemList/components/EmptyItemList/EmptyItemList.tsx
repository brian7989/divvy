import { Paper, Text } from "@mantine/core";

export function EmptyItemList() {
  return (
    <Paper withBorder p="xl" ta="center" radius="lg">
      <Text fz={34} mb={6} role="img" aria-label="Noodles">
        🍜
      </Text>
      <Text c="dimmed" size="sm">
        Add the first item.
      </Text>
    </Paper>
  );
}
