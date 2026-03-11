import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Saju Reading - Discover Your Destiny Through Korean Four Pillars',
  description: 'Ancient Korean Saju astrology meets modern AI. Calculate your Four Pillars of Destiny and receive personalized readings in 60 seconds.',
};

const FEATURES = [
  { icon: '\uD83D\uDD2E', title: 'Free Quick Reading', desc: 'Get a snapshot of your destiny in seconds' },
  { icon: '\uD83C\uDF19', title: 'Day Master Analysis', desc: 'Understand your core identity and element' },
  { icon: '\u2728', title: 'Luck Cycle Forecast', desc: '10-year cycle predictions for life planning' },
  { icon: '\u2764\uFE0F', title: 'Compatibility Check', desc: 'Compare charts with a partner or friend' },
  { icon: '\uD83C\uDF8B', title: 'Baby Name Generator', desc: 'Find names that balance your child\'s chart' },
  { icon: '\uD83D\uDCC5', title: 'Lucky Date Calculator', desc: 'Choose auspicious dates for important events' },
];

const TESTIMONIALS = [
  {
    text: 'The personality reading was incredibly accurate. It captured aspects of myself I had never put into words. The career guidance helped me make a pivotal decision.',
    name: 'Minjun K.',
    role: 'Software Engineer',
  },
  {
    text: 'I was skeptical, but the compatibility analysis between me and my partner was spot on. It helped us understand our differences and grow together.',
    name: 'Sarah L.',
    role: 'Teacher',
  },
  {
    text: 'The annual forecast guided me through a challenging year. Knowing which months to push forward and which to reflect was invaluable for my business.',
    name: 'Hyunwoo P.',
    role: 'Entrepreneur',
  },
];

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    features: ['1 quick reading/day', 'Basic chart display', 'Element balance view'],
    popular: false,
  },
  {
    name: 'Basic',
    price: '$9.99',
    interval: '/mo',
    features: ['3 full readings/month', '1 compatibility reading', '1 annual forecast', 'Chart export'],
    popular: false,
  },
  {
    name: 'Premium',
    price: '$24.99',
    interval: '/mo',
    features: ['Unlimited everything', 'PDF export', 'Lucky dates', 'Baby names', 'Daily energy'],
    popular: true,
  },
];

const FAQ = [
  {
    q: 'What is Saju?',
    a: 'Saju (also known as Four Pillars of Destiny) is a traditional Korean and East Asian system of astrology. It analyzes the Heavenly Stems and Earthly Branches of your birth year, month, day, and hour to reveal your destiny patterns.',
  },
  {
    q: 'How accurate is this?',
    a: 'The chart calculations are mathematically precise based on the traditional sexagenary calendar. Our AI interprets your chart using established Saju principles, providing insights that many users find remarkably relevant.',
  },
  {
    q: 'How is Saju different from Western astrology?',
    a: 'Saju uses the Five Elements (Wood, Fire, Earth, Metal, Water), Yin-Yang theory, and the Chinese sexagenary cycle rather than zodiac signs and planetary positions. It focuses on life destiny patterns and elemental balance.',
  },
  {
    q: 'Do I need to know my exact birth time?',
    a: 'For the most accurate reading, yes. But you can still get meaningful insights from a three-pillar reading (without the Hour Pillar) if your birth time is unknown.',
  },
  {
    q: 'What languages are supported?',
    a: 'We currently support English, Korean, and Vietnamese. All chart labels show original Korean Hanja characters alongside translations.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Absolutely. Cancel your subscription anytime from the dashboard. You keep access until the end of your billing period. Credit packs never expire.',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg">
            <span className="text-muted-foreground text-sm mr-1">四柱</span>
            Saju Reading
          </Link>
          <nav className="hidden sm:flex items-center gap-6 text-sm">
            <Link href="/reading" className="text-muted-foreground hover:text-foreground transition-colors">
              Reading
            </Link>
            <Link href="/compatibility" className="text-muted-foreground hover:text-foreground transition-colors">
              Compatibility
            </Link>
            <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="sm">Sign In</Button>
            </Link>
          </nav>
          <Link href="/reading" className="sm:hidden">
            <Button size="sm">Start</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-1/3 w-56 h-56 bg-amber-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 py-24 sm:py-32 text-center">
          <Badge variant="secondary" className="mb-4">
            Powered by Traditional Saju Principles + AI
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
            Discover Your Destiny{' '}
            <span className="text-muted-foreground">Through Korean Four Pillars</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Ancient Korean astrology meets modern AI. Get your free Saju reading in 60 seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/reading">
              <Button size="lg" className="text-base px-8">
                Calculate My Destiny
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button size="lg" variant="outline" className="text-base px-8">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="border-t bg-muted/30 py-20">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Enter Your Birth Data', desc: 'Date, time (traditional Korean time blocks supported), and gender.' },
              { step: '2', title: 'AI Calculates Your Pillars', desc: 'Precise Four Pillars calculation with element balance, Ten Gods, and special stars.' },
              { step: '3', title: 'Receive Your Reading', desc: 'AI-powered interpretation of your chart covering personality, career, love, and more.' },
            ].map((item) => (
              <div key={item.step} className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Everything You Need</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
            Comprehensive Saju analysis powered by traditional principles and modern AI
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((feature) => (
              <Card key={feature.title} className="hover:border-primary/30 transition-all">
                <CardContent className="pt-6">
                  <div className="text-2xl mb-2">{feature.icon}</div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t bg-muted/30 py-20">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <Card key={idx}>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    &quot;{t.text}&quot;
                  </p>
                  <div>
                    <div className="font-medium text-sm">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Simple Pricing</h2>
          <p className="text-center text-muted-foreground mb-12">
            Start free, upgrade when you need more
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {PLANS.map((plan) => (
              <Card
                key={plan.name}
                className={`relative ${plan.popular ? 'border-primary shadow-lg shadow-primary/10' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                  </div>
                )}
                <CardContent className="pt-8 space-y-4">
                  <div className="text-center">
                    <h3 className="font-semibold text-lg">{plan.name}</h3>
                    <div className="mt-2">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      {plan.interval && (
                        <span className="text-muted-foreground text-sm">{plan.interval}</span>
                      )}
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <Check className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/pricing">
              <Button variant="outline" size="lg">View Full Pricing</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t bg-muted/30 py-20">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">FAQ</h2>
          <div className="space-y-4">
            {FAQ.map((item, idx) => (
              <details key={idx} className="group border rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-sm hover:bg-muted/50 transition-colors list-none flex items-center justify-between">
                  {item.q}
                  <span className="text-muted-foreground group-open:rotate-180 transition-transform">
                    &#x25BC;
                  </span>
                </summary>
                <div className="px-4 pb-4 text-sm text-muted-foreground">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Discover Your Destiny?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Calculate your Four Pillars for free. No signup required.
          </p>
          <Link href="/reading">
            <Button size="lg" className="text-base px-10">
              Calculate My Destiny
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <div className="max-w-5xl mx-auto px-4">
          <p>Saju Reading. Ancient wisdom, modern insight.</p>
          <div className="flex justify-center gap-6 mt-4">
            <Link href="/reading" className="hover:text-foreground transition-colors">Reading</Link>
            <Link href="/compatibility" className="hover:text-foreground transition-colors">Compatibility</Link>
            <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            <Link href="/auth/login" className="hover:text-foreground transition-colors">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
