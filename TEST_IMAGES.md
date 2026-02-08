# Image Test with Relative Paths

This file is for testing that images with relative paths are correctly converted to raw GitHub URLs.

## Path Examples:

### 1. Absolute path from the repository root:
![Stats](/src/assets/img/posts/stats.webp)

### 2. Relative path without a leading slash:
![Example](src/assets/img/posts/example.png)

### 3. Full URL (should not be modified):
![Remote](https://example.com/image.jpg)

### 4. Relative path with ./
![Local](./images/test.png)

## Notes:
- Paths starting with `/` are converted to: `https://raw.githubusercontent.com/{owner}/{repo}/refs/heads/main/path`
- Paths without `/` are also converted by adding `/` before the path.
- Full URLs (http/https) remain unmodified.
- Paths with `./` or `../` are also left unmodified (they stay relative).
