import { ActionIcon, Group, Input, NumberInput } from "@mantine/core";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import type { ReactNode } from "react";
import styles from "../../../BillModals.module.css";

const { Label: InputLabel } = Input;

type Props = {
  value: number;
  onChange: (value: number) => void;
  onBlur?: () => void;
  error?: ReactNode;
};

export function QuantityInput({ value, onChange, onBlur, error }: Props) {
  const quantity = value || 1;

  return (
    <div>
      <InputLabel mb={5} htmlFor="item-quantity">
        Quantity
      </InputLabel>
      <Group gap="xs" wrap="nowrap">
        <ActionIcon
          size={44}
          variant="default"
          aria-label="Decrease quantity"
          disabled={quantity <= 1}
          onClick={() => onChange(Math.max(1, quantity - 1))}
        >
          <IconMinus size={18} />
        </ActionIcon>
        <NumberInput
          id="item-quantity"
          className={styles.quantityInput}
          size="md"
          value={value}
          onChange={(nextValue) => onChange(Number(nextValue) || 1)}
          onBlur={onBlur}
          error={error}
          min={1}
          step={1}
          allowDecimal={false}
          hideControls
          aria-label="Quantity"
        />
        <ActionIcon
          size={44}
          variant="default"
          aria-label="Increase quantity"
          onClick={() => onChange(quantity + 1)}
        >
          <IconPlus size={18} />
        </ActionIcon>
      </Group>
    </div>
  );
}
