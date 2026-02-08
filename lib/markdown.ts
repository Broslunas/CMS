import matter from "gray-matter";

/**
 * Parses a Markdown file and separates the frontmatter from the content
 */
export function parseMarkdown(rawContent: string) {
  const { data: metadata, content } = matter(rawContent);
  return { metadata, content };
}

/**
 * Serializes metadata and content back to Markdown format
 */
export function serializeMarkdown(metadata: Record<string, any>, content: string) {
  // Serialize using gray-matter
  const stringified = matter.stringify(content, metadata);

  // Post-process to remove quotes from dates in "YYYY-MM-DD" format
  // We only do this in the frontmatter block to avoid touching the content.
  // The frontmatter is delimited by ---
  return stringified.replace(/^---([\s\S]*?)\n---/m, (match, frontmatter) => {
    const cleanFrontmatter = frontmatter.replace(/([:-]\s*)["'](\d{4}-\d{2}-\d{2})["']/g, '$1$2');
    return `---${cleanFrontmatter}\n---`;
  });
}

/**
 * Validates that the metadata has the expected structure
 * (This can be extended with Zod for more robust validation)
 */
export function validateMetadata(metadata: any): boolean {
  // Basic validation - can be improved with Zod
  if (!metadata.title || typeof metadata.title !== "string") {
    return false;
  }
  if (!metadata.slug || typeof metadata.slug !== "string") {
    return false;
  }
  return true;
}
