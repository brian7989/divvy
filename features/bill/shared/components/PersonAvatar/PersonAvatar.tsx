import { Avatar } from "@mantine/core";
import type { Person } from "@/features/bill/domain/bill.schema";
import { getPersonEmoji } from "@/features/bill/domain/person-emojis";

export function PersonAvatar({
  person,
  size = "sm",
}: {
  person: Person;
  size?: "sm" | "md";
}) {
  return (
    <Avatar color={person.color} size={size} radius="xl">
      <span role="img" aria-label={`${person.name}'s character`}>
        {getPersonEmoji(person.id)}
      </span>
    </Avatar>
  );
}
