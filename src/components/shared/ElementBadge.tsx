import { cn } from '@/lib/utils';
import type { Element } from '@/engine/types';

interface ElementBadgeProps {
  element: Element;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ELEMENT_STYLES: Record<Element, { bg: string; text: string; border: string }> = {
  Wood: { bg: 'bg-green-500/15', text: 'text-green-700 dark:text-green-400', border: 'border-green-500/30' },
  Fire: { bg: 'bg-red-500/15', text: 'text-red-700 dark:text-red-400', border: 'border-red-500/30' },
  Earth: { bg: 'bg-amber-500/15', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-500/30' },
  Metal: { bg: 'bg-gray-500/15', text: 'text-gray-700 dark:text-gray-400', border: 'border-gray-500/30' },
  Water: { bg: 'bg-blue-500/15', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-500/30' },
};

const ELEMENT_LABELS: Record<Element, { korean: string; chinese: string }> = {
  Wood: { korean: '목', chinese: '木' },
  Fire: { korean: '화', chinese: '火' },
  Earth: { korean: '토', chinese: '土' },
  Metal: { korean: '금', chinese: '金' },
  Water: { korean: '수', chinese: '水' },
};

const SIZE_CLASSES = {
  sm: 'text-xs px-1.5 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5',
};

export default function ElementBadge({ element, size = 'md', className }: ElementBadgeProps) {
  const style = ELEMENT_STYLES[element];
  const label = ELEMENT_LABELS[element];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border font-medium',
        style.bg,
        style.text,
        style.border,
        SIZE_CLASSES[size],
        className
      )}
    >
      {label.korean}/{label.chinese} {element}
    </span>
  );
}
