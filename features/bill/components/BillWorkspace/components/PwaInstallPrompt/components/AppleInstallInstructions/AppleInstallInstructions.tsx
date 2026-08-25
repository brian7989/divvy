import { Stack } from "@mantine/core";
import {
  IconCheck,
  IconDots,
  IconShare3,
  IconSquarePlus,
} from "@tabler/icons-react";
import { InstallStep } from "../InstallStep/InstallStep";

type Props = { safari: boolean };

export function AppleInstallInstructions({ safari }: Props) {
  return (
    <Stack gap="lg">
      {!safari && (
        <InstallStep
          number={1}
          icon={<IconShare3 size={22} />}
          title="Open this page in Safari"
          description="Installation from other iPhone browsers is not supported."
        />
      )}
      <InstallStep
        number={safari ? 1 : 2}
        icon={safari ? <IconDots size={24} /> : <IconShare3 size={22} />}
        title="Open Share"
        description="Tap •••, then Share. If Share is already visible, tap it directly."
      />
      <InstallStep
        number={safari ? 2 : 3}
        icon={<IconSquarePlus size={24} />}
        title="Add to Home Screen"
        description="Scroll down and tap Add to Home Screen [+]."
      />
      <InstallStep
        number={safari ? 3 : 4}
        icon={<IconCheck size={23} />}
        title="Finish"
        description="Turn on Open as Web App, then tap Add."
      />
    </Stack>
  );
}
