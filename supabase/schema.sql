-- =============================================
-- SUPABASE SCHEMA — App Corpo e Saúde
-- PRD v1.0 — Março 2026
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. PROFILES (extends auth.users)
-- =============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'aluno' CHECK (role IN ('aluno', 'instrutor', 'recepcionista', 'gestor', 'admin')),
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  unit_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: users can read/write own profile
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.phone,
    'aluno'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- 2. UNITS (35 academias)
-- =============================================
CREATE TABLE IF NOT EXISTS public.units (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT DEFAULT 'SP',
  phone TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can read units" ON public.units
  FOR SELECT TO authenticated USING (true);

-- Add FK to profiles
ALTER TABLE public.profiles
  ADD CONSTRAINT fk_profiles_unit
  FOREIGN KEY (unit_id) REFERENCES public.units(id);

-- =============================================
-- 3. MQV ASSESSMENTS
-- =============================================
CREATE TABLE IF NOT EXISTS public.mqv_assessments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  unit_id UUID REFERENCES public.units(id),
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Bloco 2: Perfil e Biometria
  height_cm INTEGER,
  weight_kg NUMERIC(5,2),
  gender TEXT CHECK (gender IN ('masculino', 'feminino', 'outros', 'prefiro_nao_opinar')),
  age_range TEXT CHECK (age_range IN ('abaixo_18', '18_29', '30_45', '46_59', '60_plus')),
  is_pne BOOLEAN,

  -- Bloco 3: Rotina e Trabalho
  work_hours TEXT,
  work_type TEXT[], -- multi-select array

  -- Bloco 4: Dor
  pain_level INTEGER CHECK (pain_level BETWEEN 0 AND 10),
  pain_frequency TEXT,
  pain_locations TEXT[],
  pain_side TEXT,
  pain_sensation TEXT,

  -- Bloco 5: Histórico de Saúde
  had_surgery BOOLEAN,
  uses_medication BOOLEAN,
  has_diabetes_hypertension BOOLEAN,
  had_fracture_injury BOOLEAN,
  diagnoses TEXT[],
  previous_treatments TEXT[],

  -- Bloco 6: Fisiologia e Hábitos
  sleep_quality TEXT,
  hydration TEXT,
  bowel_health TEXT,
  digestion_issues TEXT[],
  diet_quality TEXT,

  -- Bloco 7: Estilo de Vida e Metas
  physical_activity TEXT,
  is_smoker BOOLEAN,
  alcohol_use TEXT,
  emotional_state TEXT,
  stress_level INTEGER CHECK (stress_level BETWEEN 0 AND 10),
  commitment_level INTEGER CHECK (commitment_level BETWEEN 1 AND 10),
  goals TEXT[],

  -- PAR-Q
  parq_responses JSONB,
  parq_passed BOOLEAN,

  -- LGPD
  lgpd_consent BOOLEAN DEFAULT FALSE,
  lgpd_consent_at TIMESTAMPTZ
);

ALTER TABLE public.mqv_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own MQV" ON public.mqv_assessments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own MQV" ON public.mqv_assessments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own MQV" ON public.mqv_assessments
  FOR UPDATE USING (auth.uid() = user_id);

-- =============================================
-- 4. EXERCISES (library)
-- =============================================
CREATE TABLE IF NOT EXISTS public.exercises (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  instructions TEXT[] DEFAULT '{}',
  tips TEXT[] DEFAULT '{}',
  primary_muscle TEXT NOT NULL,
  secondary_muscles TEXT[] DEFAULT '{}',
  equipment TEXT,
  level TEXT DEFAULT 'iniciante' CHECK (level IN ('iniciante', 'intermediario', 'avancado')),
  video_url TEXT,
  thumbnail_url TEXT,
  is_popular BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can read exercises" ON public.exercises
  FOR SELECT TO authenticated USING (true);

-- =============================================
-- 5. WORKOUT PLANS
-- =============================================
CREATE TABLE IF NOT EXISTS public.workout_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  unit_id UUID REFERENCES public.units(id),
  instructor_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'ai_generated' CHECK (status IN ('ai_generated', 'instructor_review', 'approved', 'active', 'completed')),
  generated_by TEXT DEFAULT 'ai' CHECK (generated_by IN ('ai', 'instructor', 'manual')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ
);

ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own plans" ON public.workout_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own plans" ON public.workout_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================
-- 6. WORKOUT DAYS
-- =============================================
CREATE TABLE IF NOT EXISTS public.workout_days (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  plan_id UUID REFERENCES public.workout_plans(id) ON DELETE CASCADE NOT NULL,
  day_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  target_muscles TEXT[] DEFAULT '{}',
  estimated_duration_min INTEGER DEFAULT 45,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.workout_days ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own workout days" ON public.workout_days
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workout_plans
      WHERE workout_plans.id = workout_days.plan_id
      AND workout_plans.user_id = auth.uid()
    )
  );

-- =============================================
-- 7. WORKOUT EXERCISES (in a day)
-- =============================================
CREATE TABLE IF NOT EXISTS public.workout_exercises (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  day_id UUID REFERENCES public.workout_days(id) ON DELETE CASCADE NOT NULL,
  exercise_id UUID REFERENCES public.exercises(id) NOT NULL,
  "order" INTEGER NOT NULL,
  sets JSONB DEFAULT '[]', -- [{set_number, target_reps, target_weight_kg, is_warmup}]
  rest_seconds INTEGER DEFAULT 90,
  notes TEXT,
  set_type TEXT DEFAULT 'normal' CHECK (set_type IN ('normal', 'aquecimento', 'drop_set', 'super_serie')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.workout_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own workout exercises" ON public.workout_exercises
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workout_days wd
      JOIN public.workout_plans wp ON wp.id = wd.plan_id
      WHERE wd.id = workout_exercises.day_id
      AND wp.user_id = auth.uid()
    )
  );

-- =============================================
-- 8. WORKOUT SESSIONS (execution log)
-- =============================================
CREATE TABLE IF NOT EXISTS public.workout_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_id UUID REFERENCES public.workout_plans(id),
  day_id UUID REFERENCES public.workout_days(id),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  exercises_completed JSONB DEFAULT '[]',
  rpe INTEGER CHECK (rpe BETWEEN 1 AND 10),
  notes TEXT
);

ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own sessions" ON public.workout_sessions
  FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- 9. BODY MEASUREMENTS
-- =============================================
CREATE TABLE IF NOT EXISTS public.body_measurements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  measured_at TIMESTAMPTZ DEFAULT NOW(),
  weight_kg NUMERIC(5,2),
  body_fat_pct NUMERIC(4,1),
  chest_cm NUMERIC(5,1),
  waist_cm NUMERIC(5,1),
  hip_cm NUMERIC(5,1),
  bicep_left_cm NUMERIC(5,1),
  bicep_right_cm NUMERIC(5,1),
  thigh_left_cm NUMERIC(5,1),
  thigh_right_cm NUMERIC(5,1),
  photos JSONB -- {front_url, side_url, back_url}
);

ALTER TABLE public.body_measurements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own measurements" ON public.body_measurements
  FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- 10. SUBSCRIPTIONS
-- =============================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan TEXT NOT NULL CHECK (plan IN ('mensal', 'anual')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'expired', 'trial')),
  price_brl NUMERIC(8,2) NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  canceled_at TIMESTAMPTZ,
  payment_gateway TEXT DEFAULT 'asaas',
  gateway_subscription_id TEXT
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- =============================================
-- 11. NOTIFICATIONS
-- =============================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT DEFAULT 'system',
  data JSONB,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own notifications" ON public.notifications
  FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- 12. STREAKS
-- =============================================
CREATE TABLE IF NOT EXISTS public.streaks (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_workout_date DATE,
  total_workouts INTEGER DEFAULT 0,
  total_minutes INTEGER DEFAULT 0
);

ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own streak" ON public.streaks
  FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- INDEXES for performance
-- =============================================
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_unit_id ON public.profiles(unit_id);
CREATE INDEX IF NOT EXISTS idx_mqv_user_id ON public.mqv_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_mqv_status ON public.mqv_assessments(status);
CREATE INDEX IF NOT EXISTS idx_exercises_primary_muscle ON public.exercises(primary_muscle);
CREATE INDEX IF NOT EXISTS idx_exercises_level ON public.exercises(level);
CREATE INDEX IF NOT EXISTS idx_workout_plans_user_id ON public.workout_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_plans_status ON public.workout_plans(status);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_id ON public.workout_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);
