import { Group, Text } from "@mantine/core";
import { useBillTotals } from "@/features/bill/hooks/useBillTotals";
import { formatMoney } from "@/features/bill/domain/money";

type Props = { personId: string };

export function PersonShareRow({ personId }: Props) {
  const share = useBillTotals().shares.find(
    ({ person }) => person.id === personId,
  );
  if (!share) return null;
  return (
    <Group justify="space-between">
      <Group gap="xs">
        <span
          style={{
            width: 9,
            height: 9,
            borderRadius: 99,
            background: share.person.color,
          }}
        />
        <Text size="sm">{share.person.name}</Text>
      </Group>
      <Text fw={700} size="sm">
        {formatMoney(share.totalCents)}
      </Text>
    </Group>
  );
}
