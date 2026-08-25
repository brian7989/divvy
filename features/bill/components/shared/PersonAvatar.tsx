import { Avatar } from "@mantine/core";
import type { Person } from "../../model/bill.schema";

export function PersonAvatar({
  person,
  size = "sm",
}: {
  person: Person;
  size?: "sm" | "md";
}) {
  return (
    <Avatar color={person.color} size={size} radius="xl">
      {person.name.slice(0, 1).toUpperCase()}
    </Avatar>
  );
}
