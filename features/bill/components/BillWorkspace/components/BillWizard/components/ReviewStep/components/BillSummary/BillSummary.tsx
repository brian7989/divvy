import { Card, Divider, Stack, Title } from "@mantine/core";
import { BillBreakdown } from "./components/BillBreakdown/BillBreakdown";
import { BillSettings } from "./components/BillSettings/BillSettings";
import { BillTotal } from "./components/BillTotal/BillTotal";
import { PersonShareList } from "./components/PersonShareList/PersonShareList";
import { ServiceFeeWarning } from "./components/ServiceFeeWarning/ServiceFeeWarning";

export function BillSummary() {
  return (
    <Card withBorder radius="xl" p="xl">
      <Title order={2} mb="lg">
        Your split
      </Title>
      <Stack gap="sm">
        <BillBreakdown />
        <BillSettings />
        <Divider />
        <BillTotal />
        <ServiceFeeWarning />
        <PersonShareList />
      </Stack>
    </Card>
  );
}
