const PERSON_COLORS = [
  "#754cff",
  "#ed5db5",
  "#20a684",
  "#5677e8",
  "#b36ae2",
  "#e24b72",
] as const;

/** Returns the next color in the repeating person palette. */
export function getPersonColor(index: number): string {
  return PERSON_COLORS[index % PERSON_COLORS.length];
}
