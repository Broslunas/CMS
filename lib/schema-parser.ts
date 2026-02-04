
interface SchemaField {
    type: string;
    raw?: string;
    nestedFields?: Record<string, SchemaField>;
}

interface ParsedConfig {
    [collectionName: string]: Record<string, SchemaField>;
}

export function parseAstroConfig(content: string): ParsedConfig {
    const varDefinitions: Record<string, Record<string, SchemaField>> = {};

    // 1. Find variable names and their defineCollection blocks
    const defRegex = /const\s+(\w+)\s*=\s*defineCollection\s*\(\s*{([\s\S]*?)}\s*\);/g;
    let match;

    while ((match = defRegex.exec(content)) !== null) {
        const varName = match[1];
        const body = match[2];
        const fields: Record<string, SchemaField> = {};

        // 2. Extract the schema block: schema: z.object({ ... })
        // We use a simplified brace counting or just regex for the outer block.
        // Assuming schema is defined as: schema: z.object({ ... })
        const schemaRegex = /schema:\s*z\.object\s*\(\s*\{([\s\S]*?)\}\s*\)(?:\.optional\(\))?,?/g;
        const schemaMatch = schemaRegex.exec(body);
        
        if (schemaMatch) {
            const schemaContent = schemaMatch[1];
            // Helper to parse a block of fields
            const parseBlock = (block: string): Record<string, SchemaField> => {
                const parsed: Record<string, SchemaField> = {};
                
                // Regex to match keys and their definitions.
                // Challenges: nested types with braces.
                // We'll iterate through lines and try to handle simple nesting for 'social' or other objects.
                
                const lines = block.split('\n');
                let currentKey: string | null = null;
                let currentType: string = "string";
                let captureBlock = false;
                let blockContent = "";
                let braceCount = 0;

                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];
                    const trimmed = line.trim();
                    if (!trimmed || trimmed.startsWith("//")) continue;

                    if (captureBlock) {
                        blockContent += line + "\n";
                        braceCount += (line.match(/\{/g) || []).length;
                        braceCount -= (line.match(/\}/g) || []).length;

                        if (braceCount <= 0) {
                            // End of block
                            if (currentKey) {
                                let nested: Record<string, SchemaField> | undefined = undefined;
                                // If it was an object, parse recursively
                                if (currentType === "object") {
                                     // Remove the closing brace/parenthesis from the captured block
                                     // The captured block includes the opening brace line? No.
                                     // Actually, my captured logic is a bit manual.
                                     // Let's refine:
                                     // When we detect z.object({, we start capturing.
                                     // The content being captured is everything inside ().
                                     // But simpler: just use regex again on the blockContent?
                                     // Or just assume it's valid TS object literal-like.
                                     // Let's try to extract keys from blockContent.
                                     // blockContent contains: 
                                     // twitter: z.string(),
                                     // ...
                                     // });
                                     
                                     // Naive strip of last lines?
                                     nested = parseBlock(blockContent);
                                }
                                
                                parsed[currentKey] = { 
                                    type: currentType, 
                                    nestedFields: nested,
                                    raw: "object" 
                                };
                            }
                            captureBlock = false;
                            currentKey = null;
                            blockContent = "";
                        }
                        continue;
                    }

                    // Key detection: key: z.something
                    const keyMatch = trimmed.match(/^(\w+):\s*z\.([a-zA-Z0-9.]+)/);
                    if (keyMatch) {
                        const key = keyMatch[1];
                        const methodChain = keyMatch[2];
                        
                        if (methodChain.startsWith("object")) {
                             currentKey = key;
                             currentType = "object";
                             captureBlock = true;
                             braceCount = 1; // We assume the opening brace was on this line
                             // If the opening brace is NOT on this line, this logic fails.
                             // Example: social: z.object(
                             //    {
                             
                             // We assume: social: z.object({
                             // Check for brace
                             const hasOpenBrace = trimmed.includes("{");
                             if (!hasOpenBrace) {
                                 // Maybe next line? For now assume standard formatting.
                                 // If no brace, maybe treat as simple object?
                             }
                             blockContent = ""; 
                        } else {
                            // Simple type
                            let type = "string";
                            if (methodChain.includes("boolean")) type = "boolean";
                            else if (methodChain.includes("number")) type = "number";
                            else if (methodChain.includes("date") || methodChain.includes("coerce.date")) type = "date";
                            else if (methodChain.includes("array")) type = "array";
                            
                            parsed[key] = { type, raw: methodChain };
                        }
                    }
                }
                return parsed;
            };

            const rootFields = parseBlock(schemaContent);
            Object.assign(fields, rootFields);
        }
        varDefinitions[varName] = fields;
    }

    // 3. Find export const collections
    const collectionsMatch = /export\s+const\s+collections\s*=\s*{([\s\S]*?)};/.exec(content);
    const finalCollections: ParsedConfig = {};

    if (collectionsMatch) {
        const exportBody = collectionsMatch[1];
        const exports = exportBody.split(',').map(s => s.trim()).filter(s => s);
        
        exports.forEach(exp => {
            const parts = exp.split(':');
            let collectionName = parts[0].trim();
            let varName = parts[0].trim();
            
            if (parts.length > 1) {
                collectionName = parts[0].trim();
                varName = parts[1].trim();
            }

            if (varDefinitions[varName]) {
                finalCollections[collectionName] = varDefinitions[varName];
            }
        });
    } else {
        return varDefinitions; 
    }

    return finalCollections;
}

