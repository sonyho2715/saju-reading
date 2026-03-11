'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'ko', label: '한국어' },
  { code: 'vi', label: 'Tiếng Việt' },
] as const;

interface LanguageSwitcherProps {
  onChange?: (lang: string) => void;
  className?: string;
}

export default function LanguageSwitcher({ onChange, className }: LanguageSwitcherProps) {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const saved = localStorage.getItem('saju-lang');
    if (saved && LANGUAGES.some((l) => l.code === saved)) {
      setLang(saved);
    }
  }, []);

  const handleChange = (code: string) => {
    setLang(code);
    localStorage.setItem('saju-lang', code);
    onChange?.(code);
  };

  return (
    <div className={cn('inline-flex rounded-lg border overflow-hidden', className)}>
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => handleChange(l.code)}
          className={cn(
            'px-3 py-1.5 text-xs font-medium transition-colors',
            lang === l.code
              ? 'bg-primary text-primary-foreground'
              : 'bg-background hover:bg-muted text-muted-foreground'
          )}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
