/**
 * Parses the Astro Content Collections config.ts file
 * Extracts schema definitions for each collection
 */

import { getFileContent } from "./octokit";

export interface CollectionSchema {
  name: string; // Collection name (blog, projects, etc.)
  fields: {
    [key: string]: {
      type: string; // string, number, boolean, array, date, etc.
      optional: boolean;
      description?: string;
    };
  };
  rawSchema?: string; // Original Zod schema (optional)
}

/**
 * Extracts collections from config.ts
 */
export async function parseContentConfig(
  accessToken: string,
  owner: string,
  repo: string
): Promise<CollectionSchema[]> {
  try {
    // Read config.ts file
    const configData = await getFileContent(
      accessToken,
      owner,
      repo,
      "src/content/config.ts"
    );

    if (!configData) {
      console.log("No config.ts found, using default schema");
      return [getDefaultSchema()];
    }

    const content = configData.content;

    // Parse defined collections
    const collections = extractCollections(content);

    if (collections.length === 0) {
      console.log("No collections found in config.ts, using default");
      return [getDefaultSchema()];
    }

    return collections;
  } catch (error) {
    console.error("Error parsing content config:", error);
    return [getDefaultSchema()];
  }
}

/**
 * Extracts collection definitions from config.ts content
 */
function extractCollections(configContent: string): CollectionSchema[] {
  const collections: CollectionSchema[] = [];

  // Regex to find defineCollection
  // Example: blog: defineCollection({ ... })
  const collectionRegex = /(\w+):\s*defineCollection\s*\(\s*\{([\s\S]*?)\}\s*\)/g;

  let match;
  while ((match = collectionRegex.exec(configContent)) !== null) {
    const collectionName = match[1];
    const collectionBody = match[2];

    // Extract schema from body
    const schema = extractSchemaFromBody(collectionBody);

    collections.push({
      name: collectionName,
      fields: schema,
    });
  }

  return collections;
}

/**
 * Extracts schema fields from a collection
 */
function extractSchemaFromBody(body: string): CollectionSchema["fields"] {
  const fields: CollectionSchema["fields"] = {};

  // Search for z.object({ ... })
  const schemaMatch = body.match(/schema:\s*z\.object\s*\(\s*\{([\s\S]*?)\}\s*\)/);

  if (!schemaMatch) {
    return fields;
  }

  const schemaContent = schemaMatch[1];

  // Parse each schema field
  // Example: title: z.string()
  // Example: tags: z.array(z.string()).optional()
  const fieldRegex = /(\w+):\s*z\.([\w.()]+)/g;

  let fieldMatch;
  while ((fieldMatch = fieldRegex.exec(schemaContent)) !== null) {
    const fieldName = fieldMatch[1];
    const fieldDefinition = fieldMatch[2];

    fields[fieldName] = parseFieldDefinition(fieldDefinition);
  }

  return fields;
}

/**
 * Parses a Zod field definition
 */
function parseFieldDefinition(definition: string): CollectionSchema["fields"][string] {
  const optional = definition.includes("optional()");
  
  // Detect base type
  let type = "string";
  
  if (definition.startsWith("string")) type = "string";
  else if (definition.startsWith("number")) type = "number";
  else if (definition.startsWith("boolean")) type = "boolean";
  else if (definition.startsWith("date")) type = "date";
  else if (definition.startsWith("array")) type = "array";
  else if (definition.startsWith("object")) type = "object";

  return {
    type,
    optional,
  };
}

/**
 * Default schema if config.ts is not found
 */
function getDefaultSchema(): CollectionSchema {
  return {
    name: "blog",
    fields: {
      title: { type: "string", optional: false },
      slug: { type: "string", optional: false },
      tags: { type: "array", optional: true },
      episodeUrl: { type: "string", optional: true },
      transcription: { type: "array", optional: true },
    },
  };
}

/**
 * Validates markdown metadata against a collection schema
 */
export function validateAgainstSchema(
  metadata: any,
  schema: CollectionSchema
): { valid: boolean; data?: any; errors?: string[] } {
  const errors: string[] = [];
  const validatedData: any = {};

  // Validate each schema field
  for (const [fieldName, fieldDef] of Object.entries(schema.fields)) {
    const value = metadata[fieldName];

    // Missing field (allow for later editing)
    if (value === undefined || value === null) {
      continue;
    }

    // Validate type
    const typeValid = validateFieldType(value, fieldDef.type);
    if (!typeValid) {
      errors.push(`Field ${fieldName} must be of type ${fieldDef.type}`);
      continue;
    }

    validatedData[fieldName] = value;
  }

  // Add extra fields not in schema (permissive)
  for (const [key, value] of Object.entries(metadata)) {
    if (!(key in schema.fields)) {
      validatedData[key] = value;
    }
  }

  return {
    valid: errors.length === 0,
    data: validatedData,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * Validates if a value matches a type
 */
function validateFieldType(value: any, type: string): boolean {
  switch (type) {
    case "string":
      return typeof value === "string";
    case "number":
      return typeof value === "number";
    case "boolean":
      return typeof value === "boolean";
    case "date":
      return value instanceof Date || typeof value === "string";
    case "array":
      return Array.isArray(value);
    case "object":
      return typeof value === "object" && !Array.isArray(value);
    default:
      return true; // Allow any unknown type
  }
}

/**
 * Detects which collection a file belongs to based on its path
 */
export function detectCollectionFromPath(filePath: string): string {
  // Example: src/content/blog/post.md -> "blog"
  // Example: src/content/projects/project.md -> "projects"
  const match = filePath.match(/src\/content\/([^/]+)\//);
  return match ? match[1] : "blog";
}
