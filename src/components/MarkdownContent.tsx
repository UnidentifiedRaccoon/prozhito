import Markdown from "react-markdown";

interface MarkdownContentProps {
  children: string;
}

export function MarkdownContent({ children }: MarkdownContentProps) {
  return (
    <div className="markdown-content">
      <Markdown skipHtml>{children}</Markdown>
    </div>
  );
}
