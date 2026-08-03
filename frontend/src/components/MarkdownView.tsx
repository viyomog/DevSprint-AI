import React from 'react';

interface MarkdownViewProps {
  content: string;
}

export const MarkdownView: React.FC<MarkdownViewProps> = ({ content }) => {
  if (!content) return null;

  // Clean out wrapping outer quotes if present
  let cleanText = content.trim();
  if (cleanText.startsWith('"') && cleanText.endsWith('"')) {
    cleanText = cleanText.substring(1, cleanText.length - 1).trim();
  }

  // Split into paragraphs / lines
  const paragraphs = cleanText.split('\n\n');

  const renderFormattedLine = (line: string, lineIdx: number) => {
    // Regex for inline code `code`, bold **bold**, and italic *italic*
    const parts = line.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);

    return (
      <span key={lineIdx}>
        {parts.map((part, pIdx) => {
          if (part.startsWith('`') && part.endsWith('`')) {
            const codeText = part.slice(1, -1);
            return (
              <code
                key={pIdx}
                style={{
                  background: 'rgba(16, 185, 129, 0.12)',
                  color: 'var(--primary)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '5px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.88em',
                  fontWeight: 600
                }}
              >
                {codeText}
              </code>
            );
          }
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={pIdx} style={{ color: 'var(--text-main)', fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
          }
          if (part.startsWith('*') && part.endsWith('*')) {
            return <em key={pIdx} style={{ color: 'var(--text-secondary)' }}>{part.slice(1, -1)}</em>;
          }
          return part;
        })}
      </span>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', lineHeight: 1.65 }}>
      {paragraphs.map((para, idx) => {
        const trimmed = para.trim();
        if (!trimmed) return null;

        // Check if paragraph is a code block ```
        if (trimmed.startsWith('```') && trimmed.endsWith('```')) {
          const codeLines = trimmed.split('\n');
          const codeContent = codeLines.slice(1, -1).join('\n');
          return (
            <pre
              key={idx}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                padding: '1rem',
                borderRadius: '8px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.88rem',
                color: 'var(--primary)',
                overflowX: 'auto'
              }}
            >
              <code>{codeContent}</code>
            </pre>
          );
        }

        // Check if bullet point list item
        if (/^(\d+\.|\*|-)\s/.test(trimmed)) {
          const items = trimmed.split('\n');
          return (
            <ul key={idx} style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {items.map((item, itemIdx) => (
                <li key={itemIdx} style={{ color: 'var(--text-main)' }}>
                  {renderFormattedLine(item.replace(/^(\d+\.|\*|-)\s/, ''), itemIdx)}
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={idx} style={{ margin: 0, color: 'var(--text-main)' }}>
            {renderFormattedLine(trimmed, idx)}
          </p>
        );
      })}
    </div>
  );
};
