import { Group, Text } from "@mantine/core";

type Props = { label: string; value: string };

export function SummaryRow({ label, value }: Props) {
  return (
    <Group justify="space-between">
      <Text c="dimmed" size="sm">
        {label}
      </Text>
      <Text fw={700}>{value}</Text>
    </Group>
  );
}
