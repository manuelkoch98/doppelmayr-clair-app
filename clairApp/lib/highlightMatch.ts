export function highlightMatch(text: string, term: string) {
  if (!term) return [{ text, match: false }];
  const regex = new RegExp(`(${term})`, "gi");
  const parts = text.split(regex);

  return parts.map((part) => ({
    text: part,
    match: part.toLowerCase() === term.toLowerCase(),
  }));
}
