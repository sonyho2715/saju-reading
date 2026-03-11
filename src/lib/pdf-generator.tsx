import React from 'react';
import { Document, Page, Text, View, StyleSheet, renderToBuffer, type DocumentProps } from '@react-pdf/renderer';
import type { ChartAnalysis } from '../engine/types';
import type { ReadingResult, ReadingSection } from './reading-generator';
import { STEMS } from '../engine/constants/stems';
import { BRANCHES } from '../engine/constants/branches';

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.6,
  },
  coverPage: {
    backgroundColor: '#1a1a2e',
    padding: 40,
    fontFamily: 'Helvetica',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverTitle: {
    fontSize: 36,
    color: '#e0e0ff',
    marginBottom: 12,
    textAlign: 'center',
  },
  coverSubtitle: {
    fontSize: 16,
    color: '#9090b0',
    marginBottom: 40,
    textAlign: 'center',
  },
  coverName: {
    fontSize: 24,
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  coverDate: {
    fontSize: 12,
    color: '#8080a0',
    textAlign: 'center',
  },
  coverPattern: {
    fontSize: 14,
    color: '#a0a0c0',
    marginTop: 24,
    textAlign: 'center',
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center',
    color: '#1a1a2e',
  },
  sectionTitle: {
    fontSize: 14,
    marginTop: 20,
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#302b63',
    borderBottom: '1pt solid #e0e0e0',
    paddingBottom: 4,
  },
  text: {
    fontSize: 10,
    lineHeight: 1.6,
    marginBottom: 8,
    color: '#333333',
  },
  pillarsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    justifyContent: 'center',
    gap: 8,
  },
  pillar: {
    width: 110,
    padding: 10,
    border: '1pt solid #cccccc',
    borderRadius: 4,
    alignItems: 'center',
    backgroundColor: '#f8f8ff',
  },
  pillarLabel: {
    fontSize: 9,
    color: '#666666',
    marginBottom: 6,
    textAlign: 'center',
  },
  stemText: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 2,
    color: '#1a1a2e',
  },
  branchText: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 4,
    color: '#302b63',
  },
  elementBadge: {
    fontSize: 8,
    color: '#555555',
    textAlign: 'center',
    backgroundColor: '#eeeeff',
    padding: '2 6',
    borderRadius: 3,
  },
  elementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    paddingHorizontal: 20,
  },
  elementLabel: {
    fontSize: 10,
    color: '#444444',
    width: 80,
  },
  elementBar: {
    height: 12,
    backgroundColor: '#302b63',
    borderRadius: 2,
  },
  elementValue: {
    fontSize: 9,
    color: '#666666',
    width: 30,
    textAlign: 'right',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#999999',
  },
});

// ---------------------------------------------------------------------------
// Element balance bar width calculation
// ---------------------------------------------------------------------------

function elementBarWidth(value: number, max: number): number {
  return Math.max(10, (value / Math.max(max, 1)) * 300);
}

// ---------------------------------------------------------------------------
// PDF Document Component
// ---------------------------------------------------------------------------

interface ReadingPDFProps {
  chart: ChartAnalysis;
  reading: ReadingResult;
  userName?: string;
}

function ReadingPDF({ chart, reading, userName }: ReadingPDFProps) {
  const fp = chart.fourPillars;
  const maxBalance = Math.max(
    chart.elementBalance.wood,
    chart.elementBalance.fire,
    chart.elementBalance.earth,
    chart.elementBalance.metal,
    chart.elementBalance.water,
    1
  );

  const pillars = [
    { label: 'Year', pillar: fp.year },
    { label: 'Month', pillar: fp.month },
    { label: 'Day', pillar: fp.day },
    { label: 'Hour', pillar: fp.hour },
  ];

  const elements: { name: string; value: number }[] = [
    { name: 'Wood', value: chart.elementBalance.wood },
    { name: 'Fire', value: chart.elementBalance.fire },
    { name: 'Earth', value: chart.elementBalance.earth },
    { name: 'Metal', value: chart.elementBalance.metal },
    { name: 'Water', value: chart.elementBalance.water },
  ];

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.coverPage}>
        <Text style={styles.coverTitle}>四柱推命</Text>
        <Text style={styles.coverSubtitle}>Saju Reading - Four Pillars of Destiny</Text>
        {userName && <Text style={styles.coverName}>{userName}</Text>}
        <Text style={styles.coverDate}>
          Generated {reading.generatedAt.toISOString().slice(0, 10)}
        </Text>
        <Text style={styles.coverPattern}>
          Chart Pattern: {chart.chartPattern} ({chart.chartPatternKorean})
        </Text>
        <Text style={{ ...styles.coverDate, marginTop: 8 }}>
          Day Master: {chart.dayMaster.hanja} {chart.dayMaster.korean} ({chart.dayMaster.element} {chart.dayMaster.yinYang})
        </Text>
      </Page>

      {/* Four Pillars Page */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Four Pillars Chart</Text>

        <View style={styles.pillarsContainer}>
          {pillars.map((p) => (
            <View key={p.label} style={styles.pillar}>
              <Text style={styles.pillarLabel}>{p.label} Pillar</Text>
              <Text style={styles.stemText}>{p.pillar?.stem.hanja ?? '?'}</Text>
              <Text style={styles.branchText}>{p.pillar?.branch.hanja ?? '?'}</Text>
              {p.pillar && (
                <Text style={styles.elementBadge}>
                  {p.pillar.stem.element} / {p.pillar.branch.animal}
                </Text>
              )}
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Element Balance</Text>
        {elements.map((el) => (
          <View key={el.name} style={styles.elementRow}>
            <Text style={styles.elementLabel}>{el.name}</Text>
            <View style={{ ...styles.elementBar, width: elementBarWidth(el.value, maxBalance) }} />
            <Text style={styles.elementValue}>{el.value.toFixed(1)}</Text>
          </View>
        ))}

        <View style={{ marginTop: 16 }}>
          <Text style={styles.text}>
            Day Master Strength: {chart.dayMasterStrength.replace('_', ' ')}
          </Text>
          <Text style={styles.text}>
            Useful God: {chart.usefulGod} | Jealousy God: {chart.jealousyGod}
          </Text>
          <Text style={styles.text}>
            Luck Direction: {chart.luckDirection} | Start Age: {chart.luckStartAge}
          </Text>
        </View>

        <Text style={styles.footer}>SajuReading.com - Four Pillars of Destiny</Text>
      </Page>

      {/* Reading Sections */}
      {reading.sections.map((section, idx) => (
        <Page key={idx} size="A4" style={styles.page}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Text style={styles.text}>{section.content}</Text>
          <Text style={styles.footer}>
            SajuReading.com - Page {idx + 3}
          </Text>
        </Page>
      ))}
    </Document>
  );
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function generateReadingPDF(
  chart: ChartAnalysis,
  reading: ReadingResult,
  userName?: string,
): React.ReactElement<DocumentProps> {
  return <ReadingPDF chart={chart} reading={reading} userName={userName} />;
}

export async function renderPDFToBuffer(element: React.ReactElement<DocumentProps>): Promise<Buffer> {
  return renderToBuffer(element) as unknown as Promise<Buffer>;
}
