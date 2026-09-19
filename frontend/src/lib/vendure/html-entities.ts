const HTML_ENTITIES: Record<string, string> = {
  "&quot;": '"',
  "&amp;": "&",
  "&#39;": "'",
  "&apos;": "'",
  "&lt;": "<",
  "&gt;": ">",
};

/**
 * Decodes the handful of entities that arrive escaped from the catalogue source.
 *
 * Product names routinely contain screen sizes written as `14&quot;`. React escapes on
 * render, so an undecoded name shows the entity to the shopper verbatim. Shared by both
 * the products query and the search index mapper — they were decoding differently, so
 * the same product read `14"` on its detail page and `14&quot;` in the grid.
 */
export function decodeHtmlEntities(value: string): string {
  return value.replace(/&quot;|&amp;|&#39;|&apos;|&lt;|&gt;/g, (match) => HTML_ENTITIES[match]);
}
