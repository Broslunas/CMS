# 🖼️ Automatic Image Path Conversion

## Overview
The editor now automatically converts relative image paths to full raw GitHub URLs during preview.

## How it Works

When you write Markdown with images using relative paths in your repository, the editor automatically converts them for display in the preview pane.

### Conversion Examples:

#### 1. **Absolute path from the repository root**
```markdown
![Stats](/src/assets/img/posts/stats.webp)
```
Converts to:
```
https://raw.githubusercontent.com/{owner}/{repo}/refs/heads/main/src/assets/img/posts/stats.webp
```

#### 2. **Relative path without a leading slash**
```markdown
![Example](src/assets/img/posts/example.png)
```
Converts to:
```
https://raw.githubusercontent.com/{owner}/{repo}/refs/heads/main/src/assets/img/posts/example.png
```

#### 3. **Absolute URLs (Unmodified)**
```markdown
![Remote](https://example.com/image.jpg)
```
Remains the same:
```
https://example.com/image.jpg
```

#### 4. **Relative paths with ./ or ../ (Unmodified)**
```markdown
![Local](./images/test.png)
```
Remains the same (relative to the actual document):
```
./images/test.png
```

## Features

✅ **Repository-specific**: The `owner` and `repo` are automatically retrieved from the current repository context.
✅ **Non-invasive**: Only affects the preview; it does not modify your Markdown source.
✅ **Smart Detection**: Detects the path type and only converts those that require it.
✅ **Compatible**: Works in both Preview and Split views of the content editor.
✅ **Metadata Support**: Also works for metadata fields containing images (e.g., `coverImage`, `avatar`).

## Technical Details

### Affected Components
- `components/post-editor/ContentEditor.tsx` - For Markdown content.
- `components/post-editor/MetadataField.tsx` - For metadata fields containing images.

### Main Function
```typescript
const convertToGitHubRawUrl = (
  src: string, 
  repoId?: string
): string
```

### Parameters
- `src`: The original image path.
- `repoId`: Repository ID in `"owner/repo"` format (e.g., `"Broslunas/portfolio-old"`).

### Conversion Logic
1. If `src` is a Blob or undefined → Returns as is.
2. If `src` is a full URL (http/https) → Returns as is.
3. If `src` starts with `/` → Prepends `https://raw.githubusercontent.com/{repoId}/refs/heads/main`.
4. If `src` does not start with `/`, `./`, or `../` → Prepends `https://raw.githubusercontent.com/{repoId}/refs/heads/main/`.
5. If `src` starts with `./` or `../` → Returns as is (maintains relative path).

## Usage

No additional action is required. Simply write your Markdown with image paths as you normally would:

```markdown
# My Post

Here is my statistics chart:

![Statistics](/src/assets/img/posts/stats.webp)

And here is another image:

![Example](assets/images/example.png)
```

The editor will automatically handle the conversion so that images display correctly in the preview.

## Metadata Usage

Conversion also works automatically for metadata fields that contain images. For example:

### `coverImage` Field:
```yaml
---
title: My Article
coverImage: /src/assets/img/posts/calc.webp
---
```

The preview image will be shown using:
```
https://raw.githubusercontent.com/{owner}/{repo}/refs/heads/main/src/assets/img/posts/calc.webp
```

### Other Supported Fields:
- `coverImage`, `cover`, `image`
- `avatar`, `thumbnail`, `banner`
- `poster`, `logo`, `icon`, `bg`
- Any field containing "image" or "img" in its name.

## Notes
- Conversion only occurs within the editor's preview view.
- Saved Markdown content **is not modified**.
- This allows paths to function correctly in both the CMS and when the content is rendered on your website.
