-- NeuRafiki Database Schema
-- Comprehensive neurodivergent self-assessment app database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  preferred_name TEXT,
  account_type TEXT NOT NULL DEFAULT 'individual' CHECK (account_type IN ('individual', 'organization')),
  organization_name TEXT,
  country TEXT,
  language TEXT DEFAULT 'English',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user profiles (for multi-profile support)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  preferred_name TEXT,
  sex_gender TEXT,
  date_of_birth DATE,
  age INTEGER,
  country TEXT,
  ethnicity TEXT,
  language TEXT DEFAULT 'English',
  religion TEXT,
  education_stage TEXT,
  school_or_workplace TEXT,
  primary_caregiver_contact TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assessment domains table
CREATE TABLE IF NOT EXISTS public.assessment_domains (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  age_groups TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create questions table
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  domain_id UUID NOT NULL REFERENCES public.assessment_domains(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL, -- e.g., "MCHAT1", "SRS1"
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('yes_no', 'likert', 'multiple_choice')),
  options JSONB, -- For likert scales and multiple choice
  age_group TEXT NOT NULL,
  respondent_type TEXT NOT NULL, -- 'self', 'parent_caregiver', 'teacher', 'therapist'
  score_weight INTEGER DEFAULT 1,
  is_follow_up BOOLEAN DEFAULT FALSE,
  baseline_comparison BOOLEAN DEFAULT FALSE,
  dashboard_metric TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assessments table
CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  assessment_type TEXT NOT NULL CHECK (assessment_type IN ('baseline', 'follow_up')),
  domains TEXT[] NOT NULL, -- Selected domains for this assessment
  respondent_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  follow_up_frequency TEXT CHECK (follow_up_frequency IN ('weekly', 'monthly', 'quarterly', 'biannually')),
  baseline_assessment_id UUID REFERENCES public.assessments(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assessment responses table
CREATE TABLE IF NOT EXISTS public.assessment_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  response_value TEXT NOT NULL,
  score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assessment results table
CREATE TABLE IF NOT EXISTS public.assessment_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  domain_name TEXT NOT NULL,
  total_score INTEGER NOT NULL,
  max_possible_score INTEGER NOT NULL,
  percentage_score DECIMAL(5,2) NOT NULL,
  risk_level TEXT CHECK (risk_level IN ('low', 'moderate', 'high')),
  recommendations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  appointment_type TEXT NOT NULL,
  provider_name TEXT,
  appointment_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('follow_up_reminder', 'assessment_pending', 'appointment_reminder')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  scheduled_for TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_domains ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "profiles_select_policy" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "profiles_insert_policy" ON public.profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Create RLS policies for user_profiles
CREATE POLICY "user_profiles_select_policy" ON public.user_profiles
  FOR SELECT USING (true);

CREATE POLICY "user_profiles_insert_policy" ON public.user_profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "user_profiles_select_own" ON public.user_profiles FOR SELECT USING (
  user_id IN (SELECT id FROM public.profiles WHERE auth.uid() = id)
);
CREATE POLICY "user_profiles_insert_own" ON public.user_profiles FOR INSERT WITH CHECK (
  user_id IN (SELECT id FROM public.profiles WHERE auth.uid() = id)
);
CREATE POLICY "user_profiles_update_own" ON public.user_profiles FOR UPDATE USING (
  user_id IN (SELECT id FROM public.profiles WHERE auth.uid() = id)
);
CREATE POLICY "user_profiles_delete_own" ON public.user_profiles FOR DELETE USING (
  user_id IN (SELECT id FROM public.profiles WHERE auth.uid() = id)
);

-- Create RLS policies for assessments
CREATE POLICY "assessments_select_own" ON public.assessments FOR SELECT USING (
  profile_id IN (
    SELECT id FROM public.user_profiles 
    WHERE user_id IN (SELECT id FROM public.profiles WHERE auth.uid() = id)
  )
);
CREATE POLICY "assessments_insert_own" ON public.assessments FOR INSERT WITH CHECK (
  profile_id IN (
    SELECT id FROM public.user_profiles 
    WHERE user_id IN (SELECT id FROM public.profiles WHERE auth.uid() = id)
  )
);
CREATE POLICY "assessments_update_own" ON public.assessments FOR UPDATE USING (
  profile_id IN (
    SELECT id FROM public.user_profiles 
    WHERE user_id IN (SELECT id FROM public.profiles WHERE auth.uid() = id)
  )
);

-- Create RLS policies for assessment_responses
CREATE POLICY "assessment_responses_select_own" ON public.assessment_responses FOR SELECT USING (
  assessment_id IN (
    SELECT id FROM public.assessments 
    WHERE profile_id IN (
      SELECT id FROM public.user_profiles 
      WHERE user_id IN (SELECT id FROM public.profiles WHERE auth.uid() = id)
    )
  )
);
CREATE POLICY "assessment_responses_insert_own" ON public.assessment_responses FOR INSERT WITH CHECK (
  assessment_id IN (
    SELECT id FROM public.assessments 
    WHERE profile_id IN (
      SELECT id FROM public.user_profiles 
      WHERE user_id IN (SELECT id FROM public.profiles WHERE auth.uid() = id)
    )
  )
);

-- Create RLS policies for assessment_results
CREATE POLICY "assessment_results_select_own" ON public.assessment_results FOR SELECT USING (
  assessment_id IN (
    SELECT id FROM public.assessments 
    WHERE profile_id IN (
      SELECT id FROM public.user_profiles 
      WHERE user_id IN (SELECT id FROM public.profiles WHERE auth.uid() = id)
    )
  )
);
CREATE POLICY "assessment_results_insert_own" ON public.assessment_results FOR INSERT WITH CHECK (
  assessment_id IN (
    SELECT id FROM public.assessments 
    WHERE profile_id IN (
      SELECT id FROM public.user_profiles 
      WHERE user_id IN (SELECT id FROM public.profiles WHERE auth.uid() = id)
    )
  )
);

-- Create RLS policies for appointments
CREATE POLICY "appointments_select_own" ON public.appointments FOR SELECT USING (
  profile_id IN (
    SELECT id FROM public.user_profiles 
    WHERE user_id IN (SELECT id FROM public.profiles WHERE auth.uid() = id)
  )
);
CREATE POLICY "appointments_insert_own" ON public.appointments FOR INSERT WITH CHECK (
  profile_id IN (
    SELECT id FROM public.user_profiles 
    WHERE user_id IN (SELECT id FROM public.profiles WHERE auth.uid() = id)
  )
);
CREATE POLICY "appointments_update_own" ON public.appointments FOR UPDATE USING (
  profile_id IN (
    SELECT id FROM public.user_profiles 
    WHERE user_id IN (SELECT id FROM public.profiles WHERE auth.uid() = id)
  )
);

-- Create RLS policies for notifications
CREATE POLICY "notifications_select_own" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notifications_insert_own" ON public.notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "notifications_update_own" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Allow public read access to assessment_domains and questions (reference data)
ALTER TABLE public.assessment_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "assessment_domains_public_read" ON public.assessment_domains FOR SELECT TO authenticated USING (true);
CREATE POLICY "questions_public_read" ON public.questions FOR SELECT TO authenticated USING (true);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', '')
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_profile_id ON public.assessments(profile_id);
CREATE INDEX IF NOT EXISTS idx_assessment_responses_assessment_id ON public.assessment_responses(assessment_id);
CREATE INDEX IF NOT EXISTS idx_assessment_results_assessment_id ON public.assessment_results(assessment_id);
CREATE INDEX IF NOT EXISTS idx_appointments_profile_id ON public.appointments(profile_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_questions_domain_id ON public.questions(domain_id);
