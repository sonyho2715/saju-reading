import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getUserFromSession } from '@/lib/auth';
import { getUserProfiles, getUserReadings, getUserCreditBalance, type BirthProfileRow, type ReadingRow } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Dashboard - Saju Reading',
  description: 'Your Saju reading dashboard with saved profiles, reading history, and credit balance.',
};

const READING_TYPE_LABELS: Record<string, string> = {
  quick: 'Quick',
  personality: 'Personality',
  career: 'Career',
  love: 'Love',
  health: 'Health',
  annual: 'Annual',
  monthly: 'Monthly',
  compatibility: 'Compatibility',
  full: 'Full',
};

export default async function DashboardPage() {
  const user = await getUserFromSession();
  if (!user) {
    redirect('/auth/login');
  }

  let profiles: BirthProfileRow[] = [];
  let readings: ReadingRow[] = [];
  let creditBalance = 0;

  try {
    [profiles, readings, creditBalance] = await Promise.all([
      getUserProfiles(user.id),
      getUserReadings(user.id, 5),
      getUserCreditBalance(user.id),
    ]);
  } catch (err) {
    console.error('[dashboard] Error loading data:', err);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
          <Badge variant="secondary" className="text-sm capitalize">
            {user.tier} Plan
          </Badge>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link href="/reading">
            <Card className="hover:border-primary/50 transition-all cursor-pointer h-full">
              <CardContent className="pt-6 text-center">
                <div className="text-2xl mb-1">{'\uD83D\uDD2E'}</div>
                <p className="text-sm font-medium">New Reading</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/compatibility">
            <Card className="hover:border-primary/50 transition-all cursor-pointer h-full">
              <CardContent className="pt-6 text-center">
                <div className="text-2xl mb-1">{'\u2764\uFE0F'}</div>
                <p className="text-sm font-medium">Compatibility</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/pricing">
            <Card className="hover:border-primary/50 transition-all cursor-pointer h-full">
              <CardContent className="pt-6 text-center">
                <div className="text-2xl mb-1">{'\u2B50'}</div>
                <p className="text-sm font-medium">Upgrade</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/reading?step=1">
            <Card className="hover:border-primary/50 transition-all cursor-pointer h-full">
              <CardContent className="pt-6 text-center">
                <div className="text-2xl mb-1">{'\uD83D\uDCC5'}</div>
                <p className="text-sm font-medium">Annual Forecast</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Credit balance */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Credit Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{creditBalance}</div>
              <p className="text-xs text-muted-foreground mt-1">credits available</p>
              <Link href="/pricing" className="block mt-3">
                <Button size="sm" variant="outline" className="w-full">
                  Buy Credits
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Today's energy card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Today&apos;s Energy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-2">
                <div className="text-2xl mb-1">{'\u2600\uFE0F'}</div>
                <p className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Check back soon for daily pillar insights
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Subscription */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold capitalize">{user.tier}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {user.tier === 'free'
                  ? '1 quick reading per day'
                  : user.tier === 'basic'
                    ? '3 full readings per month'
                    : 'Unlimited readings'}
              </p>
              {user.tier !== 'premium' && (
                <Link href="/pricing" className="block mt-3">
                  <Button size="sm" className="w-full">
                    Upgrade
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Saved profiles */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Saved Profiles</CardTitle>
            <Link href="/reading">
              <Button size="sm" variant="outline">Add Profile</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {profiles.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No saved profiles yet. Calculate your first chart to get started.
              </p>
            ) : (
              <div className="space-y-2">
                {profiles.map((profile) => (
                  <div
                    key={profile.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div>
                      <div className="font-medium text-sm">{profile.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {profile.birth_date} | {profile.gender === 'male' ? 'Male' : 'Female'}
                        {profile.is_primary && (
                          <Badge variant="secondary" className="ml-2 text-[10px]">Primary</Badge>
                        )}
                      </div>
                    </div>
                    <Link href="/reading">
                      <Button size="sm" variant="ghost">View Chart</Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reading history */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Readings</CardTitle>
          </CardHeader>
          <CardContent>
            {readings.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No readings yet. Get your first reading to see history here.
              </p>
            ) : (
              <div className="space-y-2">
                {readings.map((reading) => (
                  <Link
                    key={reading.id}
                    href={`/reading/${reading.id}`}
                    className="flex items-center justify-between p-3 rounded-lg border hover:border-primary/50 transition-all"
                  >
                    <div>
                      <div className="font-medium text-sm">
                        {READING_TYPE_LABELS[reading.reading_type] ?? reading.reading_type} Reading
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(reading.created_at).toLocaleDateString()} | {reading.language.toUpperCase()}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      View
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
