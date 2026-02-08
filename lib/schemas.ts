import { z } from "zod";

// Schema for transcription blocks
export const TranscriptionBlockSchema = z.object({
  time: z.string(),
  text: z.string(),
});

// Schema for post metadata
export const PostMetadataSchema = z.object({
  title: z.string(),
  slug: z.string(),
  tags: z.array(z.string()).optional(),
  episodeUrl: z.string().url().optional(),
  transcription: z.array(TranscriptionBlockSchema).optional(),
  // Add more fields as needed
});

// Complete post schema in MongoDB
export const PostSchema = z.object({
  _id: z.string().optional(),
  userId: z.string(),
  repoId: z.string(), // "owner/repo"
  filePath: z.string(),
  sha: z.string(),
  metadata: PostMetadataSchema,
  content: z.string(),
  status: z.enum(["synced", "draft", "modified"]),
  lastCommitAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Schema for imported projects
export const ProjectSchema = z.object({
  _id: z.string().optional(),
  userId: z.string(),
  repoId: z.string(), // "owner/repo"
  name: z.string(),
  description: z.string().optional(),
  postsCount: z.number().default(0),
  lastSync: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type TranscriptionBlock = z.infer<typeof TranscriptionBlockSchema>;
export type PostMetadata = z.infer<typeof PostMetadataSchema>;
export type Post = z.infer<typeof PostSchema>;
export type Project = z.infer<typeof ProjectSchema>;
