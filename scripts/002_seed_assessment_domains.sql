-- Seed assessment domains and basic questions
-- Insert assessment domains
INSERT INTO public.assessment_domains (name, description, age_groups) VALUES
('Autism Spectrum', 'Autism Spectrum Disorder screening across age groups', ARRAY['Toddlers (2-5)', 'Children/Adolescents (6-18)', 'Adults (18+)']),
('ADHD', 'Attention Deficit Hyperactivity Disorder screening', ARRAY['Toddlers (2-5)', 'Children/Adolescents (6-18)', 'Adults (18+)']),
('Dyslexia/Learning Differences', 'Learning differences and dyslexia screening', ARRAY['Children/Adolescents (6-18)', 'Adults (18+)']),
('Dyspraxia/Motor Coordination', 'Motor coordination and dyspraxia screening', ARRAY['Toddlers (2-5)', 'Children/Adolescents (6-18)', 'Adults (18+)']),
('Sensory Processing', 'Sensory processing differences screening', ARRAY['Toddlers (2-5)', 'Children/Adolescents (6-18)', 'Adults (18+)']),
('Executive Function', 'Executive function and cognitive screening', ARRAY['Toddlers (2-5)', 'Children/Adolescents (6-18)', 'Adults (18+)'])
ON CONFLICT (name) DO NOTHING;

-- Insert sample questions for Autism Spectrum - Toddlers
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight) 
SELECT 
  (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'),
  'MCHAT1',
  'Does your child respond to their name by 12 months?',
  'multiple_choice',
  '["Yes", "No", "Not Sure"]'::jsonb,
  'Toddlers (2-5)',
  'parent_caregiver',
  1
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MCHAT1');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight) 
SELECT 
  (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'),
  'MCHAT2',
  'Does your child point to show interest in things?',
  'multiple_choice',
  '["Yes", "No", "Not Sure"]'::jsonb,
  'Toddlers (2-5)',
  'parent_caregiver',
  1
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MCHAT2');

-- Insert sample questions for ADHD - Children/Adolescents
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight) 
SELECT 
  (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'),
  'CONNERS1',
  'Does the child have difficulty staying focused during lessons?',
  'likert',
  '["Never", "Occasionally", "Often", "Very Often"]'::jsonb,
  'Children/Adolescents (6-18)',
  'parent_caregiver',
  1
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'CONNERS1');

-- Insert sample questions for Adults - Autism
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight) 
SELECT 
  (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'),
  'AQ1',
  'I prefer to do things the same way over and over again.',
  'likert',
  '["Strongly Disagree", "Disagree", "Agree", "Strongly Agree"]'::jsonb,
  'Adults (18+)',
  'self',
  1
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'AQ1');

-- Insert sample questions for Sensory Processing
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight) 
SELECT 
  (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'),
  'SP_T1',
  'Is your child unusually sensitive to touch?',
  'likert',
  '["Never", "Sometimes", "Often", "Always"]'::jsonb,
  'Toddlers (2-5)',
  'parent_caregiver',
  1
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SP_T1');
