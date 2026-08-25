import { Button, Group, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { createId } from "@/features/bill/domain/bill.factory";
import { getPersonColor } from "@/features/bill/domain/person-colors";
import { useBillStore } from "@/features/bill/store/bill.store";
import styles from "../../../../BillWorkspace.module.css";

export function AddPersonForm() {
  const peopleCount = useBillStore((state) => state.bill.people.length);
  const addPerson = useBillStore((state) => state.addPerson);
  const form = useForm({
    initialValues: { name: "" },
    validate: { name: (value) => (value.trim() ? null : "Enter a name") },
  });
  const submit = form.onSubmit(({ name }) => {
    addPerson({
      id: createId(),
      name: name.trim(),
      color: getPersonColor(peopleCount),
    });
    form.reset();
  });
  return (
    <form onSubmit={submit}>
      <Group align="flex-start">
        <TextInput
          className={styles.textInput}
          size="md"
          placeholder="Name"
          aria-label="Person name"
          style={{ flex: 1 }}
          {...form.getInputProps("name")}
        />
        <Button size="md" type="submit">
          Add
        </Button>
      </Group>
    </form>
  );
}
