'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BirthFormData {
  year: number;
  month: number;
  day: number;
  hour?: number;
  minute?: number;
  birthTimeKnown: boolean;
  gender: 'male' | 'female';
  calendarType: 'solar' | 'lunar';
  isLeapMonth: boolean;
}

interface BirthFormProps {
  onSubmit: (data: BirthFormData) => void;
  isLoading?: boolean;
}

// ---------------------------------------------------------------------------
// Traditional two-hour blocks (시진)
// ---------------------------------------------------------------------------

interface TraditionalHour {
  label: string;
  hanja: string;
  korean: string;
  hourStart: number;
  hourEnd: number;
  midpointHour: number;
}

const TRADITIONAL_HOURS: TraditionalHour[] = [
  { label: '子時', hanja: '子', korean: '자시', hourStart: 23, hourEnd: 1, midpointHour: 0 },
  { label: '丑時', hanja: '丑', korean: '축시', hourStart: 1, hourEnd: 3, midpointHour: 2 },
  { label: '寅時', hanja: '寅', korean: '인시', hourStart: 3, hourEnd: 5, midpointHour: 4 },
  { label: '卯時', hanja: '卯', korean: '묘시', hourStart: 5, hourEnd: 7, midpointHour: 6 },
  { label: '辰時', hanja: '辰', korean: '진시', hourStart: 7, hourEnd: 9, midpointHour: 8 },
  { label: '巳時', hanja: '巳', korean: '사시', hourStart: 9, hourEnd: 11, midpointHour: 10 },
  { label: '午時', hanja: '午', korean: '오시', hourStart: 11, hourEnd: 13, midpointHour: 12 },
  { label: '未時', hanja: '未', korean: '미시', hourStart: 13, hourEnd: 15, midpointHour: 14 },
  { label: '申時', hanja: '申', korean: '신시', hourStart: 15, hourEnd: 17, midpointHour: 16 },
  { label: '酉時', hanja: '酉', korean: '유시', hourStart: 17, hourEnd: 19, midpointHour: 18 },
  { label: '戌時', hanja: '戌', korean: '술시', hourStart: 19, hourEnd: 21, midpointHour: 20 },
  { label: '亥時', hanja: '亥', korean: '해시', hourStart: 21, hourEnd: 23, midpointHour: 22 },
];

function formatTraditionalRange(h: TraditionalHour): string {
  const fmt = (hour: number) => {
    const h12 = hour % 12 || 12;
    const ampm = hour < 12 || hour === 24 ? 'AM' : 'PM';
    // Special handling for hour 0 and 23
    if (hour === 0 || hour === 24) return '12AM';
    if (hour === 12) return '12PM';
    return `${h12}${ampm}`;
  };
  return `${fmt(h.hourStart)}-${fmt(h.hourEnd)}`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function BirthForm({ onSubmit, isLoading = false }: BirthFormProps) {
  const currentYear = new Date().getFullYear();

  const [year, setYear] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const [day, setDay] = useState<string>('');
  const [timeMode, setTimeMode] = useState<'traditional' | 'exact' | 'unknown'>('traditional');
  const [traditionalHour, setTraditionalHour] = useState<string>('');
  const [exactTime, setExactTime] = useState<string>('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [calendarType, setCalendarType] = useState<'solar' | 'lunar'>('solar');
  const [isLeapMonth, setIsLeapMonth] = useState(false);

  // Determine max days for selected month
  const maxDays = useCallback(() => {
    const m = parseInt(month);
    const y = parseInt(year);
    if (!m) return 31;
    if ([4, 6, 9, 11].includes(m)) return 30;
    if (m === 2) {
      if (!y) return 29;
      return (y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0)) ? 29 : 28;
    }
    return 31;
  }, [month, year]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const y = parseInt(year);
    const m = parseInt(month);
    const d = parseInt(day);

    if (!y || !m || !d) return;

    let hour: number | undefined;
    let minute: number | undefined;
    const birthTimeKnown = timeMode !== 'unknown';

    if (timeMode === 'traditional' && traditionalHour) {
      const selected = TRADITIONAL_HOURS[parseInt(traditionalHour)];
      if (selected) {
        hour = selected.midpointHour;
        minute = 0;
      }
    } else if (timeMode === 'exact' && exactTime) {
      const [h, min] = exactTime.split(':').map(Number);
      if (h !== undefined && min !== undefined) {
        hour = h;
        minute = min;
      }
    }

    onSubmit({
      year: y,
      month: m,
      day: d,
      hour,
      minute,
      birthTimeKnown,
      gender,
      calendarType,
      isLeapMonth,
    });
  };

  // Generate year options
  const years: number[] = [];
  for (let i = currentYear; i >= 1900; i--) {
    years.push(i);
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl font-bold">
          <span className="block text-sm text-muted-foreground font-normal mb-1">사주팔자 (四柱八字)</span>
          Birth Data Input
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date of Birth */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Date of Birth (생년월일)</Label>
            <div className="grid grid-cols-3 gap-2">
              <Select value={year} onValueChange={(v) => setYear(v ?? '')}>
                <SelectTrigger>
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {years.map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={month} onValueChange={(v) => setMonth(v ?? '')}>
                <SelectTrigger>
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <SelectItem key={m} value={String(m)}>
                      {m}月
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={day} onValueChange={(v) => setDay(v ?? '')}>
                <SelectTrigger>
                  <SelectValue placeholder="Day" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {Array.from({ length: maxDays() }, (_, i) => i + 1).map((d) => (
                    <SelectItem key={d} value={String(d)}>
                      {d}日
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Birth Time */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Birth Time (출생 시각)</Label>

            {/* Time mode selector */}
            <div className="flex rounded-lg border overflow-hidden">
              <button
                type="button"
                className={`flex-1 py-2 px-3 text-sm font-medium transition-colors ${
                  timeMode === 'traditional'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background hover:bg-muted'
                }`}
                onClick={() => setTimeMode('traditional')}
              >
                Traditional (시진)
              </button>
              <button
                type="button"
                className={`flex-1 py-2 px-3 text-sm font-medium transition-colors border-x ${
                  timeMode === 'exact'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background hover:bg-muted'
                }`}
                onClick={() => setTimeMode('exact')}
              >
                Exact Time
              </button>
              <button
                type="button"
                className={`flex-1 py-2 px-3 text-sm font-medium transition-colors ${
                  timeMode === 'unknown'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background hover:bg-muted'
                }`}
                onClick={() => setTimeMode('unknown')}
              >
                Unknown
              </button>
            </div>

            {/* Traditional time blocks */}
            {timeMode === 'traditional' && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {TRADITIONAL_HOURS.map((h, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setTraditionalHour(String(i))}
                    className={`p-2 rounded-md border text-center transition-all text-xs leading-tight ${
                      traditionalHour === String(i)
                        ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
                        : 'border-border hover:border-primary/50 hover:bg-muted'
                    }`}
                  >
                    <div className="font-bold text-sm">{h.hanja}</div>
                    <div className="text-muted-foreground">{h.korean}</div>
                    <div className="text-muted-foreground mt-0.5">{formatTraditionalRange(h)}</div>
                  </button>
                ))}
              </div>
            )}

            {/* Exact time input */}
            {timeMode === 'exact' && (
              <Input
                type="time"
                value={exactTime}
                onChange={(e) => setExactTime(e.target.value)}
                className="w-full"
              />
            )}

            {/* Unknown time note */}
            {timeMode === 'unknown' && (
              <p className="text-sm text-muted-foreground bg-muted/50 rounded-md p-3">
                Without birth time, the Hour Pillar (시주) cannot be calculated.
                Your reading will be based on 3 pillars only.
              </p>
            )}
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Gender (성별)</Label>
            <div className="flex rounded-lg border overflow-hidden">
              <button
                type="button"
                className={`flex-1 py-2.5 px-4 text-sm font-medium transition-colors ${
                  gender === 'male'
                    ? 'bg-blue-600 text-white'
                    : 'bg-background hover:bg-muted'
                }`}
                onClick={() => setGender('male')}
              >
                Male (남)
              </button>
              <button
                type="button"
                className={`flex-1 py-2.5 px-4 text-sm font-medium transition-colors border-l ${
                  gender === 'female'
                    ? 'bg-pink-600 text-white'
                    : 'bg-background hover:bg-muted'
                }`}
                onClick={() => setGender('female')}
              >
                Female (여)
              </button>
            </div>
          </div>

          {/* Calendar Type */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Calendar Type (역법)</Label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="calendarType"
                  checked={calendarType === 'solar'}
                  onChange={() => {
                    setCalendarType('solar');
                    setIsLeapMonth(false);
                  }}
                  className="accent-primary w-4 h-4"
                />
                <span className="text-sm">Solar (양력)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="calendarType"
                  checked={calendarType === 'lunar'}
                  onChange={() => setCalendarType('lunar')}
                  className="accent-primary w-4 h-4"
                />
                <span className="text-sm">Lunar (음력)</span>
              </label>
            </div>

            {/* Leap month checkbox (only for lunar) */}
            {calendarType === 'lunar' && (
              <label className="flex items-center gap-2 cursor-pointer mt-2 pl-1">
                <input
                  type="checkbox"
                  checked={isLeapMonth}
                  onChange={(e) => setIsLeapMonth(e.target.checked)}
                  className="accent-primary w-4 h-4 rounded"
                />
                <span className="text-sm text-muted-foreground">Leap Month (윤달)</span>
              </label>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold"
            disabled={!year || !month || !day || isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Calculating...
              </span>
            ) : (
              'Calculate My Destiny (사주 분석)'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
