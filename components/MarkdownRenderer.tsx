"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const convertToGitHubRawUrl = (src: string | undefined, repoId?: string) => {
    if (!src) return src;
    if (src.startsWith('http://') || src.startsWith('https://')) return src;
    
    let baseUrl = 'https://raw.githubusercontent.com/Broslunas/portfolio-old/refs/heads/main';
    if (repoId) {
      baseUrl = `https://raw.githubusercontent.com/${repoId}/refs/heads/main`;
    }
    
    if (src.startsWith('/')) return `${baseUrl}${src}`;
    if (!src.startsWith('./') && !src.startsWith('../')) return `${baseUrl}/${src}`;
    
    return src;
};

export function MarkdownRenderer({ content, repoId }: { content: string, repoId: string }) {
  return (
    <ReactMarkdown 
      remarkPlugins={[remarkGfm]}
      components={{
        img: ({node, src, alt, ...props}) => {
          const imageSrc = typeof src === 'string' ? convertToGitHubRawUrl(src, repoId) : src;
          return (
            <img 
              src={typeof imageSrc === 'string' ? imageSrc : undefined} 
              alt={alt} 
              {...props}
              className="rounded-lg border border-border"
            />
          );
        }
      }}
    >
      {content || "*No content*"}
    </ReactMarkdown>
  );
}
