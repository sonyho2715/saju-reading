'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface ReadingSectionProps {
  title: string;
  icon: string;
  content: string;
  defaultExpanded?: boolean;
}

function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      elements.push(<div key={key++} className="h-3" />);
      continue;
    }

    // Bold text
    const boldParsed = trimmed.replace(
      /\*\*(.+?)\*\*/g,
      '<strong class="font-semibold text-foreground">$1</strong>'
    );

    // Italic text
    const italicParsed = boldParsed.replace(
      /\*(.+?)\*/g,
      '<em>$1</em>'
    );

    // List items
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      elements.push(
        <li
          key={key++}
          className="ml-4 text-sm leading-relaxed text-muted-foreground list-disc"
          dangerouslySetInnerHTML={{ __html: italicParsed.slice(2) }}
        />
      );
      continue;
    }

    // Numbered lists
    const numMatch = trimmed.match(/^(\d+)\.\s+(.+)/);
    if (numMatch) {
      elements.push(
        <li
          key={key++}
          className="ml-4 text-sm leading-relaxed text-muted-foreground list-decimal"
          dangerouslySetInnerHTML={{ __html: numMatch[2] }}
        />
      );
      continue;
    }

    // Regular paragraphs
    elements.push(
      <p
        key={key++}
        className="text-sm leading-relaxed text-muted-foreground"
        dangerouslySetInnerHTML={{ __html: italicParsed }}
      />
    );
  }

  return elements;
}

export default function ReadingSection({
  title,
  icon,
  content,
  defaultExpanded = false,
}: ReadingSectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="flex items-center w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors"
      >
        <span className="text-lg mr-2">{icon}</span>
        <span className="font-semibold text-sm flex-1">{title}</span>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-muted-foreground transition-transform duration-200',
            expanded && 'rotate-180'
          )}
        />
      </button>

      <div
        className={cn(
          'grid transition-all duration-300 ease-in-out',
          expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        )}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 pt-1 space-y-1">
            {renderMarkdown(content)}
          </div>
        </div>
      </div>
    </div>
  );
}
