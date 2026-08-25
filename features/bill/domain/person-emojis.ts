const PERSON_EMOJIS = ["🥳", "😎", "🤠", "🦄", "🐸", "👽", "🐯", "🧚"] as const;

/** Returns a stable emoji character for a person identifier. */
export function getPersonEmoji(personId: string): string {
  const hash = [...personId].reduce(
    (total, character) => total + character.codePointAt(0)!,
    0,
  );
  return PERSON_EMOJIS[hash % PERSON_EMOJIS.length];
}
