import React, { useState } from 'react';
import { Code2, RotateCcw, Copy, Check } from 'lucide-react';

interface CodeEditorProps {
  initialCode?: string;
  onCodeChange: (code: string, language: string) => void;
}

const TEMPLATES: Record<string, string> = {
  python: `# Write your solution in Python 3\ndef solution(input_data):\n    # TODO: Implement optimal solution\n    result = []\n    return result\n`,
  javascript: `// Write your solution in JavaScript (ES6+)\nfunction solution(inputData) {\n    // TODO: Implement optimal solution\n    return [];\n}\n`,
  java: `// Write your solution in Java\npublic class Solution {\n    public static void main(String[] args) {\n        // TODO: Implement optimal solution\n    }\n}\n`,
  cpp: `// Write your solution in C++\n#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    // TODO: Implement optimal solution\n    return 0;\n}\n`
};

export const CodeEditor: React.FC<CodeEditorProps> = ({ initialCode, onCodeChange }) => {
  const [language, setLanguage] = useState<string>('python');
  const [code, setCode] = useState<string>(initialCode || TEMPLATES['python']);
  const [copied, setCopied] = useState<boolean>(false);

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    const newTemplate = TEMPLATES[newLang] || '';
    setCode(newTemplate);
    onCodeChange(newTemplate, newLang);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setCode(val);
    onCodeChange(val, language);
  };

  const handleReset = () => {
    const defaultCode = TEMPLATES[language] || '';
    setCode(defaultCode);
    onCodeChange(defaultCode, language);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Syntax highlighting renderer
  const renderHighlightedCode = (rawCode: string) => {
    const lines = rawCode.split('\n');
    return lines.map((line, lineIdx) => {
      // Tokenize line into comments, strings, keywords, numbers, and identifiers
      const tokens = line.split(/(\/\/.+$|#+$|#\s+.+$|".*?"|'.*?'|\b(?:def|function|public|class|static|void|int|const|let|var|if|else|for|while|return|import|from|include|using|namespace|true|false|null)\b|\b\d+\b)/g);

      return (
        <div key={lineIdx} style={{ minHeight: '1.5em', whiteSpace: 'pre' }}>
          {tokens.map((token, tIdx) => {
            if (!token) return null;

            // Comment (# or //)
            if (token.startsWith('//') || token.startsWith('#')) {
              return <span key={tIdx} style={{ color: '#71717A', fontStyle: 'italic' }}>{token}</span>;
            }
            // String ("..." or '...')
            if ((token.startsWith('"') && token.endsWith('"')) || (token.startsWith("'") && token.endsWith("'"))) {
              return <span key={tIdx} style={{ color: '#F59E0B' }}>{token}</span>;
            }
            // Keyword (def, function, public, class, return, etc.)
            if (/^(def|function|public|class|static|void|int|const|let|var|if|else|for|while|return|import|from|include|using|namespace)$/.test(token)) {
              return <span key={tIdx} style={{ color: '#10B981', fontWeight: 700 }}>{token}</span>;
            }
            // Booleans & Numbers (true, false, null, 0-9)
            if (/^(true|false|null|\d+)$/.test(token)) {
              return <span key={tIdx} style={{ color: '#EC4899' }}>{token}</span>;
            }
            // Types / Standard Functions
            if (/^(Solution|main|input_data|inputData|args|result|std|vector|string|iostream)$/.test(token)) {
              return <span key={tIdx} style={{ color: '#38BDF8' }}>{token}</span>;
            }

            return <span key={tIdx} style={{ color: '#FAFAFA' }}>{token}</span>;
          })}
        </div>
      );
    });
  };

  const lineCount = code.split('\n').length;

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border-color)',
      borderRadius: '10px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Editor Top Bar */}
      <div style={{
        background: 'var(--bg-card)',
        padding: '0.65rem 1rem',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem' }}>
            <Code2 size={16} /> Code Workspace
          </div>

          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            style={{
              background: 'var(--bg-secondary)',
              color: 'var(--text-main)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              padding: '0.25rem 0.65rem',
              fontSize: '0.8rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="python">Python 3</option>
            <option value="javascript">JavaScript (ES6)</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={handleCopy}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.8rem'
            }}
          >
            {copied ? <Check size={14} color="var(--success)" /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy'}
          </button>

          <button
            type="button"
            onClick={handleReset}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.8rem'
            }}
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div style={{ display: 'flex', position: 'relative', minHeight: '280px', background: '#0D0D0D' }}>
        {/* Line Numbers */}
        <div style={{
          padding: '0.85rem 0.5rem',
          background: 'rgba(0, 0, 0, 0.4)',
          borderRight: '1px solid var(--border-color)',
          color: '#52525B',
          fontSize: '0.85rem',
          fontFamily: 'var(--font-mono)',
          userSelect: 'none',
          textAlign: 'right',
          minWidth: '42px'
        }}>
          {Array.from({ length: Math.max(12, lineCount) }).map((_, idx) => (
            <div key={idx} style={{ lineHeight: '1.5em' }}>{idx + 1}</div>
          ))}
        </div>

        {/* Dual Layer: Colorized Highlight Overlay + Transparent Textarea */}
        <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
          {/* Syntax Highlight Overlay */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              padding: '0.85rem 1rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem',
              lineHeight: '1.5',
              pointerEvents: 'none',
              overflow: 'hidden'
            }}
          >
            {renderHighlightedCode(code)}
          </div>

          {/* Interactive Input Textarea */}
          <textarea
            value={code}
            onChange={handleTextChange}
            spellCheck={false}
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              minHeight: '280px',
              background: 'transparent',
              color: 'transparent',
              caretColor: '#10B981',
              border: 'none',
              outline: 'none',
              padding: '0.85rem 1rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem',
              lineHeight: '1.5',
              resize: 'vertical'
            }}
          />
        </div>
      </div>
    </div>
  );
};
