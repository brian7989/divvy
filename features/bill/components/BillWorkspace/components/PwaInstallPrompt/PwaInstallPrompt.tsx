import { Button, Group, Modal, Text } from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";
import styles from "../../BillWorkspace.module.css";
import { AppleInstallInstructions } from "./components/AppleInstallInstructions/AppleInstallInstructions";
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
          {appleMobile ? (
            <AppleInstallInstructions safari={appleSafari} />
          ) : (
            <Text>
              {canInstall
                ? "Install Divvy for quick access from your home screen."
                : "Open your browser menu and tap Install app or Add to Home screen."}
            </Text>
          )}
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
