-- Saju Reading Platform - Initial Schema
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'ko', 'vi')),
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'basic', 'premium')),
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Birth profiles
CREATE TABLE birth_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  birth_time TIME,
  birth_time_known BOOLEAN DEFAULT true,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  calendar_type TEXT DEFAULT 'solar' CHECK (calendar_type IN ('solar', 'lunar')),
  is_leap_month BOOLEAN DEFAULT false,
  timezone TEXT DEFAULT 'Asia/Seoul',
  is_primary BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Charts (calculated saju data)
CREATE TABLE charts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES birth_profiles(id) ON DELETE CASCADE,
  hour_stem INTEGER,
  hour_branch INTEGER,
  day_stem INTEGER NOT NULL,
  day_branch INTEGER NOT NULL,
  month_stem INTEGER NOT NULL,
  month_branch INTEGER NOT NULL,
  year_stem INTEGER NOT NULL,
  year_branch INTEGER NOT NULL,
  day_master INTEGER NOT NULL,
  day_master_strength TEXT NOT NULL,
  element_balance JSONB NOT NULL DEFAULT '{}',
  ten_gods JSONB NOT NULL DEFAULT '{}',
  hidden_stems JSONB NOT NULL DEFAULT '{}',
  useful_god INTEGER,
  jealousy_god INTEGER,
  chart_pattern TEXT,
  special_stars JSONB DEFAULT '[]',
  combinations JSONB DEFAULT '[]',
  clashes JSONB DEFAULT '[]',
  life_stages JSONB DEFAULT '{}',
  luck_cycles JSONB DEFAULT '[]',
  engine_version TEXT NOT NULL,
  calculated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Readings (AI-generated interpretations)
CREATE TABLE readings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chart_id UUID REFERENCES charts(id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  reading_type TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  content JSONB NOT NULL DEFAULT '{}',
  target_year INTEGER,
  target_month INTEGER,
  partner_chart_id UUID REFERENCES charts(id) ON DELETE SET NULL,
  ai_model TEXT,
  token_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Compatibility analyses
CREATE TABLE compatibility (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chart_a_id UUID REFERENCES charts(id) ON DELETE CASCADE,
  chart_b_id UUID REFERENCES charts(id) ON DELETE CASCADE,
  overall_score INTEGER,
  analysis JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Credits (monetization)
CREATE TABLE credits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('purchase', 'use', 'bonus', 'refund')),
  description TEXT,
  stripe_payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Daily energies (pre-calculated cache)
CREATE TABLE daily_energies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL UNIQUE,
  stem_index INTEGER NOT NULL,
  branch_index INTEGER NOT NULL,
  element_highlights JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_birth_profiles_user_id ON birth_profiles(user_id);
CREATE INDEX idx_charts_profile_id ON charts(profile_id);
CREATE INDEX idx_readings_chart_id ON readings(chart_id);
CREATE INDEX idx_readings_user_id ON readings(user_id);
CREATE INDEX idx_readings_type ON readings(reading_type);
CREATE INDEX idx_daily_energies_date ON daily_energies(date);
CREATE INDEX idx_credits_user_id ON credits(user_id);
CREATE INDEX idx_compatibility_charts ON compatibility(chart_a_id, chart_b_id);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE birth_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE charts ENABLE ROW LEVEL SECURITY;
ALTER TABLE readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE compatibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_energies ENABLE ROW LEVEL SECURITY;

-- RLS Policies: users
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies: birth_profiles
CREATE POLICY "Users can manage own profiles" ON birth_profiles
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies: charts
CREATE POLICY "Users can read own charts" ON charts
  FOR SELECT USING (
    profile_id IN (SELECT id FROM birth_profiles WHERE user_id = auth.uid())
  );
CREATE POLICY "Users can insert own charts" ON charts
  FOR INSERT WITH CHECK (
    profile_id IN (SELECT id FROM birth_profiles WHERE user_id = auth.uid())
  );

-- RLS Policies: readings
CREATE POLICY "Users can manage own readings" ON readings
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies: compatibility
CREATE POLICY "Users can read own compatibility" ON compatibility
  FOR SELECT USING (
    chart_a_id IN (
      SELECT c.id FROM charts c
      JOIN birth_profiles bp ON c.profile_id = bp.id
      WHERE bp.user_id = auth.uid()
    )
    OR
    chart_b_id IN (
      SELECT c.id FROM charts c
      JOIN birth_profiles bp ON c.profile_id = bp.id
      WHERE bp.user_id = auth.uid()
    )
  );

-- RLS Policies: credits
CREATE POLICY "Users can read own credits" ON credits
  FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies: daily_energies (public read)
CREATE POLICY "Daily energies are public" ON daily_energies
  FOR SELECT USING (true);
