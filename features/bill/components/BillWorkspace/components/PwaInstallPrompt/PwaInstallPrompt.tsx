import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import { IconDownload, IconShare3 } from "@tabler/icons-react";
import styles from "../../BillWorkspace.module.css";
import { usePwaInstallPrompt } from "./hooks/usePwaInstallPrompt";

export function PwaInstallPrompt() {
  const { appleMobile, appleSafari, canInstall, dismiss, install, opened } =
    usePwaInstallPrompt();

  return (
    <Modal
      opened={opened}
      onClose={dismiss}
      title="Add Divvy to your phone"
      centered
      classNames={{
        inner: styles.modalInner,
        content: styles.modalContent,
        header: styles.modalHeader,
        title: styles.modalTitle,
        body: styles.modalBody,
        close: styles.closeButton,
      }}
      transitionProps={{ transition: "slide-up", duration: 180 }}
    >
      <div className={styles.sheetLayout}>
        <div className={styles.sheetBody}>
          <Stack gap="sm">
            {appleMobile && appleSafari ? (
              <>
                <Group gap="xs" wrap="nowrap">
                  <IconShare3 size={22} />
                  <Text>Tap Share in Safari.</Text>
                </Group>
                <Text>Then tap Add to Home Screen.</Text>
              </>
            ) : appleMobile ? (
              <Text>
                Open this page in Safari, then tap Share and Add to Home Screen.
              </Text>
            ) : (
              <Text>
                {canInstall
                  ? "Install Divvy for quick access from your home screen."
                  : "Open your browser menu and tap Install app or Add to Home screen."}
              </Text>
            )}
          </Stack>
        </div>
        <div className={styles.sheetFooter}>
          <Group grow>
            <Button size="md" variant="default" onClick={dismiss}>
              Not now
            </Button>
            {canInstall && (
              <Button
                size="md"
                leftSection={<IconDownload size={18} />}
                onClick={install}
              >
                Install
              </Button>
            )}
          </Group>
        </div>
      </div>
    </Modal>
  );
}
