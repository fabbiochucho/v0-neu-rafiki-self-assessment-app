-- ============================================================================
-- Neu Rafiki Question Bank - Part 1
-- Domains: Autism Spectrum, ADHD, Dyslexia/Learning Differences
-- Idempotent inserts (safe to re-run) matching scripts/002_seed_assessment_domains.sql convention.
--
-- NOTE ON COVERAGE: The 'Dyslexia/Learning Differences' row in
-- assessment_domains.age_groups (scripts/002_seed_assessment_domains.sql) is
-- ARRAY['Children/Adolescents (6-18)', 'Adults (18+)'] -- it does NOT include
-- 'Toddlers (2-5)'. components/assessment/assessment-start-form.tsx filters
-- selectable domains via domain.age_groups.includes(ageGroup), so a Toddler-age
-- Dyslexia question would never be reachable in the app. Toddlers is therefore
-- intentionally SKIPPED for Dyslexia/Learning Differences. Autism Spectrum and
-- ADHD both declare all 3 age groups, so both get full coverage.
--
-- SUMMARY TABLE (row counts)
-- ----------------------------------------------------------------------------
-- Domain                          | Age group                    | Respondent        | Count
-- ----------------------------------------------------------------------------
-- Autism Spectrum                 | Toddlers (2-5)                | parent_caregiver  | 17
-- Autism Spectrum                 | Toddlers (2-5)                | teacher           | 17
-- Autism Spectrum                 | Toddlers (2-5)                | therapist         | 17
-- Autism Spectrum                 | Children/Adolescents (6-18)   | parent_caregiver  | 17
-- Autism Spectrum                 | Children/Adolescents (6-18)   | teacher           | 17
-- Autism Spectrum                 | Children/Adolescents (6-18)   | therapist         | 17
-- Autism Spectrum                 | Adults (18+)                  | parent_caregiver  | 17
-- Autism Spectrum                 | Adults (18+)                  | teacher           | 17
-- Autism Spectrum                 | Adults (18+)                  | therapist         | 17
-- Autism Spectrum                 | Adults (18+)                  | self              | 17
--   Autism Spectrum subtotal: 170
-- ADHD                             | Toddlers (2-5)                | parent_caregiver  | 17
-- ADHD                             | Toddlers (2-5)                | teacher           | 17
-- ADHD                             | Toddlers (2-5)                | therapist         | 17
-- ADHD                             | Children/Adolescents (6-18)   | parent_caregiver  | 17
-- ADHD                             | Children/Adolescents (6-18)   | teacher           | 17
-- ADHD                             | Children/Adolescents (6-18)   | therapist         | 17
-- ADHD                             | Adults (18+)                  | parent_caregiver  | 17
-- ADHD                             | Adults (18+)                  | teacher           | 17
-- ADHD                             | Adults (18+)                  | therapist         | 17
-- ADHD                             | Adults (18+)                  | self              | 17
--   ADHD subtotal: 170
-- Dyslexia/Learning Differences    | Children/Adolescents (6-18)   | parent_caregiver  | 17
-- Dyslexia/Learning Differences    | Children/Adolescents (6-18)   | teacher           | 17
-- Dyslexia/Learning Differences    | Children/Adolescents (6-18)   | therapist         | 17
-- Dyslexia/Learning Differences    | Adults (18+)                  | parent_caregiver  | 17
-- Dyslexia/Learning Differences    | Adults (18+)                  | teacher           | 17
-- Dyslexia/Learning Differences    | Adults (18+)                  | therapist         | 17
-- Dyslexia/Learning Differences    | Adults (18+)                  | self              | 17
--   Dyslexia subtotal: 119
-- ----------------------------------------------------------------------------
-- GRAND TOTAL: 459 rows
-- ============================================================================

-- ============================================================================
-- DOMAIN: Autism Spectrum
-- ============================================================================

-- ---- Autism Spectrum / Toddlers (2-5) / parent_caregiver ----

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_TOD_PC_01', 'Does your child respond when you call their name during family gatherings or at home?', 'multiple_choice', '["Yes", "Sometimes", "No"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_TOD_PC_01');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_TOD_PC_02', 'Does your child point at things, like a bird, a bus, or a toy, just to show you, not to ask for it?', 'multiple_choice', '["Yes", "Sometimes", "No"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_TOD_PC_02');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_TOD_PC_03', 'Does your child point to ask for something they want, such as food or a toy?', 'multiple_choice', '["Yes", "Sometimes", "No"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_TOD_PC_03');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_TOD_PC_04', 'Does your child bring objects to show you, just to share their enjoyment, rather than for help?', 'multiple_choice', '["Yes", "Sometimes", "No"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_TOD_PC_04');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_TOD_PC_05', 'Does your child make eye contact with you during play or conversation?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_TOD_PC_05');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_TOD_PC_06', 'Does your child imitate your actions, like clapping or waving, when you do them?', 'multiple_choice', '["Yes", "Sometimes", "No"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_TOD_PC_06');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_TOD_PC_07', 'When called from across the compound or homestead, does your child turn or respond?', 'multiple_choice', '["Yes", "Sometimes", "No"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_TOD_PC_07');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_TOD_PC_08', 'Does your child engage in pretend play, such as feeding a doll or pretending to cook like grandmother?', 'multiple_choice', '["Yes", "Sometimes", "No"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_TOD_PC_08');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_TOD_PC_09', 'Does your child show interest in playing near or with other children?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_TOD_PC_09');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_TOD_PC_10', 'Does your child enjoy being held or cuddled by close relatives during family visits?', 'multiple_choice', '["Yes", "Sometimes", "No"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_TOD_PC_10');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_TOD_PC_11', 'When you point at something across the room, does your child look at what you are pointing to?', 'multiple_choice', '["Yes", "Sometimes", "No"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_TOD_PC_11');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_TOD_PC_12', 'Does your child flap their hands, spin, or rock their body repeatedly?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_TOD_PC_12');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_TOD_PC_13', 'Does your child line up toys or objects repeatedly instead of using them for pretend play?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_TOD_PC_13');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_TOD_PC_14', 'Does your child become very upset by small changes in routine, such as a different route home?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_TOD_PC_14');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_TOD_PC_15', 'Does your child react strongly, such as covering ears, crying, or seeming not to notice at all, to loud sounds like drumming or a busy market?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_TOD_PC_15');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_TOD_PC_16', 'Has your child lost words, babbling, or social skills they used to have?', 'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_TOD_PC_16');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_TOD_PC_17', 'Does your child use gestures like waving bye-bye or shaking their head no to communicate?', 'multiple_choice', '["Yes", "Sometimes", "No"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_TOD_PC_17');

-- ---- Autism Spectrum / Toddlers (2-5) / teacher ----

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_TOD_TCH_01', 'Does the child respond when called by name during preschool or daycare activities?', 'multiple_choice', '["Yes", "Sometimes", "No"]'::jsonb, 'Toddlers (2-5)', 'teacher', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_TOD_TCH_01');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_TOD_TCH_02', 'Does the child point to objects or events in the classroom just to share interest with an adult?', 'multiple_choice', '["Yes", "Sometimes", "No"]'::jsonb, 'Toddlers (2-5)', 'teacher', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_TOD_TCH_02');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_TOD_TCH_03', 'Does the child point or gesture to request items or help during class activities?', 'multiple_choice', '["Yes", "Sometimes", "No"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_TOD_TCH_03');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_TOD_TCH_04', 'Does the child bring or show objects to the teacher to share excitement, not just to ask for help?', 'multiple_choice', '["Yes", "Sometimes", "No"]'::jsonb, 'Toddlers (2-5)', 'teacher', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_TOD_TCH_04');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_TOD_TCH_05', 'Does the child make eye contact with adults or peers during classroom interactions?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Toddlers (2-5)', 'teacher', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_TOD_TCH_05');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_TOD_TCH_06', 'Does the child imitate simple actions, like clapping or waving, demonstrated by the teacher?', 'multiple_choice', '["Yes", "Sometimes", "No"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_TOD_TCH_06');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_TOD_TCH_07', 'Does the child respond when called from across the classroom or play yard?', 'multiple_choice', '["Yes", "Sometimes", "No"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_TOD_TCH_07');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_TOD_TCH_08', 'Does the child engage in pretend play, such as feeding a doll, cooking, or role play, during free play time?', 'multiple_choice', '["Yes", "Sometimes", "No"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_TOD_TCH_08');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_TOD_TCH_09', 'Does the child show interest in playing alongside or with peers during group activities?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_TOD_TCH_09');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_TOD_TCH_10', 'Does the child accept comforting physical contact, such as a hug or pat, from familiar adults at school?', 'multiple_choice', '["Yes", "Sometimes", "No"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_TOD_TCH_10');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_TOD_TCH_11', 'Does the child follow the teacher''s point to look at an object or picture?', 'multiple_choice', '["Yes", "Sometimes", "No"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_TOD_TCH_11');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_TOD_TCH_12', 'Does the child display repetitive movements, like hand-flapping, spinning, or rocking, in class?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_TOD_TCH_12');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_TOD_TCH_13', 'Does the child line up toys, blocks, or objects repeatedly rather than playing with them typically?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_TOD_TCH_13');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_TOD_TCH_14', 'Does the child become distressed by small changes in classroom routine or schedule?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_TOD_TCH_14');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_TOD_TCH_15', 'Does the child react strongly to loud classroom or playground noises, such as singing, drumming, or bells?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_TOD_TCH_15');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_TOD_TCH_16', 'Has the child lost previously used words or social skills noticed at school?', 'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_TOD_TCH_16');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_TOD_TCH_17', 'Does the child use common gestures, such as waving, nodding, or shaking the head, to communicate at school?', 'multiple_choice', '["Yes", "Sometimes", "No"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_TOD_TCH_17');

-- ---- Autism Spectrum / Toddlers (2-5) / therapist ----

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_TOD_THP_01', 'Does the child respond consistently to their name being called during sessions or structured observation?', 'multiple_choice', '["Yes", "Sometimes", "No"]'::jsonb, 'Toddlers (2-5)', 'therapist', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_TOD_THP_01');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_TOD_THP_02', 'Does the child use pointing gestures to share interest in objects during observation, rather than only to request?', 'multiple_choice', '["Yes", "Sometimes", "No"]'::jsonb, 'Toddlers (2-5)', 'therapist', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_TOD_THP_02');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_TOD_THP_03', 'Does the child use pointing or reaching gestures to request objects during sessions?', 'multiple_choice', '["Yes", "Sometimes", "No"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_TOD_THP_03');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_TOD_THP_04', 'Does the child spontaneously bring or show objects to an adult to share enjoyment during sessions?', 'multiple_choice', '["Yes", "Sometimes", "No"]'::jsonb, 'Toddlers (2-5)', 'therapist', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_TOD_THP_04');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_TOD_THP_05', 'Does the child make appropriate eye contact during structured interaction or play observation?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Toddlers (2-5)', 'therapist', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_TOD_THP_05');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_TOD_THP_06', 'Does the child imitate modeled actions, such as clapping or waving, during sessions?', 'multiple_choice', '["Yes", "Sometimes", "No"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_TOD_THP_06');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_TOD_THP_07', 'Does the child orient or respond when called from a distance during observation?', 'multiple_choice', '["Yes", "Sometimes", "No"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_TOD_THP_07');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_TOD_THP_08', 'Does the child demonstrate pretend or symbolic play during structured play assessment?', 'multiple_choice', '["Yes", "Sometimes", "No"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_TOD_THP_08');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_TOD_THP_09', 'Does the child demonstrate interest in peer proximity or parallel play during observation?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_TOD_THP_09');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_TOD_THP_10', 'Does the child respond positively to appropriate physical affection from familiar caregivers?', 'multiple_choice', '["Yes", "Sometimes", "No"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_TOD_THP_10');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_TOD_THP_11', 'Does the child follow another person''s point to shift attention to an object during sessions?', 'multiple_choice', '["Yes", "Sometimes", "No"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_TOD_THP_11');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_TOD_THP_12', 'Does the child display repetitive motor mannerisms, such as hand-flapping or rocking, during observation?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_TOD_THP_12');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_TOD_THP_13', 'Does the child show a pattern of lining up or ordering objects rather than functional or pretend play?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_TOD_THP_13');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_TOD_THP_14', 'Does the child show marked distress in response to minor changes in routine during sessions?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_TOD_THP_14');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_TOD_THP_15', 'Does the child show atypical reactions, over-reactive or under-reactive, to loud sounds during observation?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_TOD_THP_15');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_TOD_THP_16', 'Is there a reported or observed loss of previously acquired language or social skills?', 'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_TOD_THP_16');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_TOD_THP_17', 'Does the child use conventional gestures to communicate intent during sessions?', 'multiple_choice', '["Yes", "Sometimes", "No"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_TOD_THP_17');

-- ---- Autism Spectrum / Children/Adolescents (6-18) / parent_caregiver ----

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_CHI_PC_01', 'Does your child have difficulty making or keeping friends compared to other children their age?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_CHI_PC_01');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_CHI_PC_02', 'Does your child prefer to play alone rather than join group play during free time?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_CHI_PC_02');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_CHI_PC_03', 'Does your child struggle to understand jokes, sarcasm, or common sayings used by family members?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_CHI_PC_03');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_CHI_PC_04', 'Does your child have an intense interest in one topic, such as bus routes or animal facts, that they talk about repeatedly?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_CHI_PC_04');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_CHI_PC_05', 'Does your child insist on the same seat at the family table or the same route to school every day?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_CHI_PC_05');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_CHI_PC_06', 'Does your child become distressed when a family routine changes unexpectedly, such as market day changing?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_CHI_PC_06');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_CHI_PC_07', 'Is your child overwhelmed by noise, crowding, or textures at crowded places like church, mosque, or the market?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_CHI_PC_07');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_CHI_PC_08', 'Does your child have difficulty telling how someone feels from their facial expression or body language?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_CHI_PC_08');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_CHI_PC_09', 'Does your child speak in an unusually flat tone or use overly formal language for their age?', 'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_CHI_PC_09');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_CHI_PC_10', 'Does your child flap their hands, rock, or make repetitive movements when excited or stressed?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_CHI_PC_10');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_CHI_PC_11', 'Does your child understand unwritten social rules, like greeting elders properly or taking turns in group games?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_CHI_PC_11');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_CHI_PC_12', 'Does your child struggle to cope in unstructured social situations, like family weddings or large gatherings?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_CHI_PC_12');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_CHI_PC_13', 'Does your child take common sayings or figures of speech used by elders very literally?', 'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_CHI_PC_13');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_CHI_PC_14', 'Does your child prefer to talk about their own interests rather than have a two-way conversation?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_CHI_PC_14');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_CHI_PC_15', 'Does your child copy or mimic other children''s behavior closely, seemingly to try to fit in?', 'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_CHI_PC_15');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_CHI_PC_16', 'Does your child make comfortable, appropriate eye contact during conversations?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_CHI_PC_16');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_CHI_PC_17', 'Does your child become overwhelmed or want to withdraw during large family or community gatherings?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_CHI_PC_17');

-- ---- Autism Spectrum / Children/Adolescents (6-18) / teacher ----

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_CHI_TCH_01', 'Does the student have difficulty forming or maintaining friendships with classmates?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_CHI_TCH_01');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_CHI_TCH_02', 'Does the student prefer to remain alone rather than join group play at break or recess?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_CHI_TCH_02');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_CHI_TCH_03', 'Does the student struggle to understand jokes, sarcasm, or idioms used in class?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_CHI_TCH_03');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_CHI_TCH_04', 'Does the student have an unusually intense, narrow interest that dominates conversations or written work?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_CHI_TCH_04');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_CHI_TCH_05', 'Does the student insist on the same seat, order, or routine in the classroom each day?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_CHI_TCH_05');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_CHI_TCH_06', 'Does the student become distressed when a school routine changes, such as assembly being moved or cancelled?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_CHI_TCH_06');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_CHI_TCH_07', 'Is the student overwhelmed by noise or crowding during school assembly or busy classroom activities?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_CHI_TCH_07');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_CHI_TCH_08', 'Does the student have difficulty reading classmates'' facial expressions or body language?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_CHI_TCH_08');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_CHI_TCH_09', 'Does the student speak in an unusually flat, monotone, or overly formal way compared to peers?', 'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_CHI_TCH_09');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_CHI_TCH_10', 'Does the student display repetitive movements, such as hand-flapping or rocking, when excited or stressed in class?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_CHI_TCH_10');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_CHI_TCH_11', 'Does the student follow unwritten classroom social rules, such as turn-taking and greeting teachers respectfully?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_CHI_TCH_11');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_CHI_TCH_12', 'Does the student struggle during unstructured school events, like sports day or open social time?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_CHI_TCH_12');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_CHI_TCH_13', 'Does the student interpret classroom instructions or common expressions overly literally?', 'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_CHI_TCH_13');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_CHI_TCH_14', 'Does the student dominate conversations with their own interests rather than engaging in back-and-forth discussion?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_CHI_TCH_14');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_CHI_TCH_15', 'Does the student appear to closely copy or script peer behavior in an effort to fit in socially?', 'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_CHI_TCH_15');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_CHI_TCH_16', 'Does the student make appropriate eye contact with teachers and peers during conversation?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_CHI_TCH_16');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_CHI_TCH_17', 'Does the student become overwhelmed during large school gatherings, such as assemblies or sports days?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_CHI_TCH_17');

-- ---- Autism Spectrum / Children/Adolescents (6-18) / therapist ----

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_CHI_THP_01', 'Does the client report or demonstrate difficulty forming or sustaining peer friendships?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_CHI_THP_01');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_CHI_THP_02', 'Does the client show a marked preference for solitary activity over group play or social time?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_CHI_THP_02');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_CHI_THP_03', 'Does the client show difficulty interpreting jokes, sarcasm, or figurative language during assessment?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_CHI_THP_03');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_CHI_THP_04', 'Does the client display a highly focused, narrow interest area of unusual intensity?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_CHI_THP_04');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_CHI_THP_05', 'Does the client show rigid insistence on routines such as seating, order, or sequence?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_CHI_THP_05');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_CHI_THP_06', 'Does the client show significant distress when an expected routine or schedule is disrupted?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_CHI_THP_06');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_CHI_THP_07', 'Does the client report or show sensory overwhelm in crowded or noisy communal settings?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_CHI_THP_07');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_CHI_THP_08', 'Does the client show difficulty interpreting nonverbal social cues such as facial expression or body language?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_CHI_THP_08');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_CHI_THP_09', 'Does the client display atypical speech prosody, such as flat tone or unusually formal phrasing?', 'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_CHI_THP_09');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_CHI_THP_10', 'Does the client display repetitive motor behaviors when excited, anxious, or overstimulated?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_CHI_THP_10');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_CHI_THP_11', 'Does the client demonstrate understanding of implicit social rules and norms during observation?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_CHI_THP_11');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_CHI_THP_12', 'Does the client show difficulty adapting to unstructured or unpredictable social situations?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_CHI_THP_12');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_CHI_THP_13', 'Does the client show a pattern of literal interpretation of figurative or idiomatic language?', 'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_CHI_THP_13');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_CHI_THP_14', 'Does the client show a pattern of one-sided conversation focused on personal interests?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_CHI_THP_14');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_CHI_THP_15', 'Does the client report consciously copying or scripting social behavior to mask difficulties?', 'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_CHI_THP_15');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_CHI_THP_16', 'Does the client maintain appropriate eye contact during clinical conversation or interview?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_CHI_THP_16');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_CHI_THP_17', 'Does the client report or show being overwhelmed in large group or community settings?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_CHI_THP_17');

-- ---- Autism Spectrum / Adults (18+) / parent_caregiver ----

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_PC_01', 'Does the person you care for avoid or struggle to maintain eye contact during conversations?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_PC_01');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_PC_02', 'Does the person you care for seem to mentally rehearse or plan out conversations before social events?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_PC_02');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_PC_03', 'Does the person you care for seem exhausted and need significant alone time after socializing?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_PC_03');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_PC_04', 'Does the person you care for become distressed by unexpected changes, like a change in work shift or travel plans?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_PC_04');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_PC_05', 'Does the person you care for have an intensely focused interest or hobby that takes up a large amount of their time?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_PC_05');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_PC_06', 'Does the person you care for take things literally and miss sarcasm, teasing, or jokes in conversation?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_PC_06');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_PC_07', 'Does the person you care for struggle to pick up on unspoken social rules at work, community, or religious gatherings?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_PC_07');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_PC_08', 'Does the person you care for become overwhelmed by crowded, noisy places like a busy matatu stage, market, or church service?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_PC_08');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_PC_09', 'Does the person you care for prepare scripted things to say before family functions or ceremonies?', 'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_PC_09');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_PC_10', 'Is the person you care for comfortable and natural with small talk and casual conversation?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_PC_10');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_PC_11', 'Does the person you care for struggle to notice when a conversation partner wants to end the conversation?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_PC_11');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_PC_12', 'Does the person you care for strongly prefer solitary activities over group or social ones?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_PC_12');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_PC_13', 'Have others commented that the person you care for speaks in a very formal, monotone, or overly blunt way?', 'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_PC_13');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_PC_14', 'Does the person you care for struggle to adjust their behavior across different settings, such as work, family, and friends?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_PC_14');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_PC_15', 'Does the person you care for rely on a fixed routine for daily tasks, like taking the same route to work every day?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_PC_15');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_PC_16', 'Does the person you care for feel comfortable in unpredictable or spontaneous social situations?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_PC_16');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_PC_17', 'Does the person you care for seem to hide or mask their natural behavior to fit in at work or family and religious gatherings, at a personal cost?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_PC_17');

-- ---- Autism Spectrum / Adults (18+) / teacher ----

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_TCH_01', 'Does the adult learner avoid or struggle to maintain eye contact during class or training discussions?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'teacher', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_TCH_01');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_TCH_02', 'Does the adult learner appear to rehearse or script responses before participating in group discussion?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'teacher', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_TCH_02');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_TCH_03', 'Does the adult learner appear drained and withdrawn after group activities or discussions?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_TCH_03');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_TCH_04', 'Does the adult learner become distressed by unexpected changes to the class schedule or routine?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_TCH_04');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_TCH_05', 'Does the adult learner discuss one topic of intense personal interest far more than others in class?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_TCH_05');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_TCH_06', 'Does the adult learner take instructions or classroom humor overly literally?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_TCH_06');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_TCH_07', 'Does the adult learner struggle to follow unspoken social norms in group training or classroom settings?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_TCH_07');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_TCH_08', 'Does the adult learner appear overwhelmed by noise or crowding in busy classroom or training environments?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_TCH_08');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_TCH_09', 'Does the adult learner appear to rely on prepared scripts before group presentations or discussions?', 'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_TCH_09');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_TCH_10', 'Is the adult learner comfortable engaging in casual small talk with classmates or colleagues?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_TCH_10');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_TCH_11', 'Does the adult learner struggle to notice social cues that a conversation or discussion should end?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_TCH_11');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_TCH_12', 'Does the adult learner consistently choose solitary tasks over group or collaborative activities?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_TCH_12');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_TCH_13', 'Have classmates or colleagues commented that the adult learner speaks in an unusually formal, flat, or blunt way?', 'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_TCH_13');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_TCH_14', 'Does the adult learner behave the same way regardless of setting, struggling to adjust to different social contexts?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_TCH_14');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_TCH_15', 'Does the adult learner rely heavily on the same fixed routine or sequence for completing tasks?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_TCH_15');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_TCH_16', 'Does the adult learner adapt comfortably to spontaneous or unplanned classroom activities?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_TCH_16');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_TCH_17', 'Does the adult learner appear to suppress natural behaviors or mannerisms to fit in during class or group settings?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'teacher', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_TCH_17');

-- ---- Autism Spectrum / Adults (18+) / therapist ----

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_THP_01', 'Does the client avoid or struggle to maintain eye contact during clinical conversation?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'therapist', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_THP_01');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_THP_02', 'Does the client report rehearsing or scripting conversations in advance of social situations?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'therapist', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_THP_02');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_THP_03', 'Does the client report significant fatigue or need for recovery time after social interaction?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_THP_03');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_THP_04', 'Does the client report significant distress in response to unexpected changes in routine or plans?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_THP_04');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_THP_05', 'Does the client describe an unusually intense, time-consuming focused interest?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_THP_05');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_THP_06', 'Does the client show a pattern of literal interpretation, missing sarcasm or implied meaning?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_THP_06');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_THP_07', 'Does the client report ongoing difficulty understanding unspoken social rules in various settings?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_THP_07');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_THP_08', 'Does the client report sensory overwhelm in crowded, loud, or brightly lit environments?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_THP_08');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_THP_09', 'Does the client describe preparing scripts or rehearsed lines before social or family events?', 'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_THP_09');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_THP_10', 'Does the client show comfort and ease with casual small talk during sessions?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_THP_10');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_THP_11', 'Does the client show difficulty recognizing cues that indicate a conversation should end?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_THP_11');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_THP_12', 'Does the client express a strong, consistent preference for solitary over social activities?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_THP_12');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_THP_13', 'Does the client report being told their speech is unusually formal, monotone, or overly direct?', 'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_THP_13');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_THP_14', 'Does the client show difficulty adapting social behavior appropriately across different contexts?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_THP_14');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_THP_15', 'Does the client describe strong reliance on fixed routines for daily functioning?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_THP_15');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_THP_16', 'Does the client report comfort with unpredictable or spontaneous social situations?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_THP_16');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_THP_17', 'Does the client describe masking or camouflaging natural behavior in social settings at significant personal cost?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'therapist', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_THP_17');

-- ---- Autism Spectrum / Adults (18+) / self ----

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_SLF_01', 'Do you find it difficult to maintain eye contact during conversations?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'self', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_SLF_01');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_SLF_02', 'Do you find yourself mentally rehearsing or planning conversations before social situations?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'self', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_SLF_02');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_SLF_03', 'Do you feel exhausted and need significant time alone after socializing, even with people you like?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_SLF_03');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_SLF_04', 'Do unexpected changes to your routine or plans cause you significant distress?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_SLF_04');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_SLF_05', 'Do you have an intense, focused interest that takes up a large amount of your time and thoughts?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_SLF_05');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_SLF_06', 'Do you often take things literally and miss sarcasm, teasing, or jokes that others intended?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_SLF_06');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_SLF_07', 'Do you struggle to pick up on unspoken social rules at work, in your community, or at religious gatherings?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_SLF_07');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_SLF_08', 'Do you become overwhelmed by crowded or noisy places, such as public transport stages, markets, or religious services?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_SLF_08');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_SLF_09', 'Do you prepare scripted things to say in advance of family functions, ceremonies, or gatherings?', 'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_SLF_09');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_SLF_10', 'Are you comfortable and natural with small talk and casual conversation?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_SLF_10');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_SLF_11', 'Do you struggle to notice when someone wants to end a conversation with you?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_SLF_11');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_SLF_12', 'Do you strongly prefer solitary activities over group or social ones?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_SLF_12');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_SLF_13', 'Have others told you that you speak in a very formal, monotone, or overly blunt or honest way?', 'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_SLF_13');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_SLF_14', 'Do you struggle to adjust your behavior across different settings, such as work, extended family, and friends?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_SLF_14');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_SLF_15', 'Do you rely heavily on a fixed daily routine, such as always taking the same route or order of tasks?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_SLF_15');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_SLF_16', 'Do you feel comfortable in unpredictable or spontaneous social situations?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_SLF_16');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Autism Spectrum'), 'ASD_ADU_SLF_17', 'Do you hide or mask your natural behaviors to fit in at work, family, or religious gatherings, even when it is exhausting?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'self', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ASD_ADU_SLF_17');

-- ============================================================================
-- DOMAIN: ADHD
-- ============================================================================

-- ---- ADHD / Toddlers (2-5) / parent_caregiver ----

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_TOD_PC_01', 'Does your child have difficulty waiting for their turn during games with other children?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_TOD_PC_01');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_TOD_PC_02', 'Is your child constantly climbing or running around even in places like church or the market where it is not appropriate?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_TOD_PC_02');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_TOD_PC_03', 'Does your child have a very short attention span during story time or quiet play?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_TOD_PC_03');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_TOD_PC_04', 'Does your child act without thinking, such as running toward the road or grabbing something dangerous?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_TOD_PC_04');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_TOD_PC_05', 'Does your child have frequent tantrums when asked to stop an enjoyable activity?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_TOD_PC_05');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_TOD_PC_06', 'Does your child have difficulty sitting still through a family or communal meal?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_TOD_PC_06');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_TOD_PC_07', 'Does your child interrupt or intrude on other children''s play or conversations?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_TOD_PC_07');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_TOD_PC_08', 'Does your child lose interest in toys or activities quickly, jumping from one to another?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_TOD_PC_08');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_TOD_PC_09', 'Does your child climb on furniture or objects excessively, seeming constantly driven to move?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_TOD_PC_09');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_TOD_PC_10', 'Is your child able to sit and focus on a preferred quiet activity, like a puzzle, for a reasonable amount of time?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_TOD_PC_10');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_TOD_PC_11', 'Does your child have difficulty following simple two-step instructions, like pick up the toy and bring it to me?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_TOD_PC_11');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_TOD_PC_12', 'Does your child grab toys from other children without waiting for a turn?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_TOD_PC_12');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_TOD_PC_13', 'Is your child extremely impatient when waiting in line, such as at the clinic or a market stall?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_TOD_PC_13');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_TOD_PC_14', 'Does your child calm down when you redirect them to a different activity?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_TOD_PC_14');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_TOD_PC_15', 'Does your child talk excessively compared to other children their age?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_TOD_PC_15');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_TOD_PC_16', 'Is your child restless or fidgety even during calm family activities, like storytelling around the fire or prayer time?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_TOD_PC_16');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_TOD_PC_17', 'Does your child react impulsively without regard for safety when in a new environment?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_TOD_PC_17');

-- ---- ADHD / Toddlers (2-5) / teacher ----

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_TOD_TCH_01', 'Does the child have difficulty waiting for their turn during group games or activities in class?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'teacher', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_TOD_TCH_01');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_TOD_TCH_02', 'Is the child constantly climbing or running around the classroom even when asked to stay seated?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'teacher', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_TOD_TCH_02');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_TOD_TCH_03', 'Does the child have a very short attention span during story time or quiet activities in class?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_TOD_TCH_03');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_TOD_TCH_04', 'Does the child act without thinking about safety, such as running off during outdoor activities?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'teacher', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_TOD_TCH_04');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_TOD_TCH_05', 'Does the child have frequent tantrums when asked to stop an activity and transition to another?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_TOD_TCH_05');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_TOD_TCH_06', 'Does the child have difficulty sitting still during snack time or meals at school?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_TOD_TCH_06');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_TOD_TCH_07', 'Does the child interrupt or intrude on classmates'' play or group activities?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_TOD_TCH_07');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_TOD_TCH_08', 'Does the child move quickly between activities in class, rarely settling on one for long?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_TOD_TCH_08');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_TOD_TCH_09', 'Does the child climb on furniture or classroom equipment excessively during the school day?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_TOD_TCH_09');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_TOD_TCH_10', 'Is the child able to sit and focus on a preferred quiet activity during independent work time?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_TOD_TCH_10');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_TOD_TCH_11', 'Does the child have difficulty following simple two-step instructions given in class?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_TOD_TCH_11');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_TOD_TCH_12', 'Does the child grab toys or materials from classmates without waiting?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_TOD_TCH_12');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_TOD_TCH_13', 'Is the child extremely impatient waiting in line for activities such as handwashing or snack?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_TOD_TCH_13');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_TOD_TCH_14', 'Does the child calm down when the teacher redirects them to a different activity?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_TOD_TCH_14');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_TOD_TCH_15', 'Does the child talk excessively during class time compared to peers?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_TOD_TCH_15');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_TOD_TCH_16', 'Is the child restless or fidgety during calm classroom activities, like circle time or story time?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_TOD_TCH_16');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_TOD_TCH_17', 'Does the child react impulsively without regard for safety during field trips or new environments?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_TOD_TCH_17');

-- ---- ADHD / Toddlers (2-5) / therapist ----

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_TOD_THP_01', 'Does the child show difficulty waiting for a turn during structured play observation?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'therapist', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_TOD_THP_01');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_TOD_THP_02', 'Does the child display excessive gross motor activity across settings, including where it is not appropriate?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'therapist', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_TOD_THP_02');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_TOD_THP_03', 'Does the child show a markedly short attention span during low-stimulation or quiet play tasks?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_TOD_THP_03');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_TOD_THP_04', 'Does the child show impulsive behavior with disregard for safety during observation?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'therapist', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_TOD_THP_04');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_TOD_THP_05', 'Does the child show frequent distress or tantrums during transitions away from preferred activities?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_TOD_THP_05');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_TOD_THP_06', 'Does the child show difficulty remaining seated during structured mealtime observation?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_TOD_THP_06');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_TOD_THP_07', 'Does the child show a pattern of intruding on peer play or interactions during observation?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_TOD_THP_07');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_TOD_THP_08', 'Does the child show rapid shifting between activities during play-based assessment?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_TOD_THP_08');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_TOD_THP_09', 'Does the child display an excessive drive for movement and climbing during observation?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_TOD_THP_09');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_TOD_THP_10', 'Does the child demonstrate sustained focus on a preferred low-stimulation task during observation?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_TOD_THP_10');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_TOD_THP_11', 'Does the child show difficulty following two-step verbal instructions during assessment?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_TOD_THP_11');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_TOD_THP_12', 'Does the child show a pattern of grabbing objects from peers without waiting during observation?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_TOD_THP_12');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_TOD_THP_13', 'Does the child display marked impatience during waiting periods in structured settings?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_TOD_THP_13');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_TOD_THP_14', 'Does the child respond to adult redirection with a reduction in problem behavior?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_TOD_THP_14');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_TOD_THP_15', 'Does the child show excessive verbal output relative to developmental expectations during observation?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_TOD_THP_15');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_TOD_THP_16', 'Does the child show restlessness during calm, low-stimulation activities during observation?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_TOD_THP_16');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_TOD_THP_17', 'Does the child show impulsive, safety-disregarding behavior when introduced to novel environments?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_TOD_THP_17');

-- ---- ADHD / Children/Adolescents (6-18) / parent_caregiver ----

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_CHI_PC_01', 'Does your child have difficulty sustaining attention on homework or study at home?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_CHI_PC_01');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_CHI_PC_02', 'Does your child make careless mistakes in homework from not checking their work?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_CHI_PC_02');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_CHI_PC_03', 'Does your child frequently lose belongings, such as books or uniform items?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_CHI_PC_03');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_CHI_PC_04', 'Does your child forget multi-step instructions given at home, such as chores in sequence?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_CHI_PC_04');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_CHI_PC_05', 'Does your child fidget or squirm when expected to sit still, such as during a religious service?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_CHI_PC_05');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_CHI_PC_06', 'Does your child blurt out answers before a question has been completed?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_CHI_PC_06');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_CHI_PC_07', 'Does your child frequently interrupt conversations or games at home?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_CHI_PC_07');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_CHI_PC_08', 'Does your child struggle to wait their turn during group games or activities?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_CHI_PC_08');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_CHI_PC_09', 'Does your child leave their seat at home in situations where remaining seated is expected, like during meals?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_CHI_PC_09');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_CHI_PC_10', 'Does your child complete homework or chores fully before moving on to something else?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_CHI_PC_10');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_CHI_PC_11', 'Is your child easily distracted by unrelated sounds or activity happening around the compound?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_CHI_PC_11');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_CHI_PC_12', 'Does your child avoid or resist tasks requiring sustained mental effort, like homework or revision?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_CHI_PC_12');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_CHI_PC_13', 'Does your child talk excessively compared to siblings or peers of the same age?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_CHI_PC_13');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_CHI_PC_14', 'Does your child organize their schoolwork and belongings effectively?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_CHI_PC_14');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_CHI_PC_15', 'Does your child run or climb excessively in situations where it is not appropriate?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_CHI_PC_15');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_CHI_PC_16', 'Does your child have difficulty following the rules during structured games or sports?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_CHI_PC_16');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_CHI_PC_17', 'Does your child lose track of time, arriving late for chores or family obligations?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_CHI_PC_17');

-- ---- ADHD / Children/Adolescents (6-18) / teacher ----

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_CHI_TCH_01', 'Does the student have difficulty sustaining attention during lessons or independent classwork?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_CHI_TCH_01');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_CHI_TCH_02', 'Does the student make careless mistakes in classwork or tests from not checking their work?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_CHI_TCH_02');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_CHI_TCH_03', 'Does the student frequently lose or misplace school materials, such as books or pens?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_CHI_TCH_03');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_CHI_TCH_04', 'Does the student forget multi-step instructions given in class?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_CHI_TCH_04');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_CHI_TCH_05', 'Does the student fidget or squirm when expected to sit still, such as during lessons or school assembly?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_CHI_TCH_05');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_CHI_TCH_06', 'Does the student blurt out answers in class before the question has been completed?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_CHI_TCH_06');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_CHI_TCH_07', 'Does the student frequently interrupt conversations, games, or lessons in class?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_CHI_TCH_07');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_CHI_TCH_08', 'Does the student struggle to wait their turn during group activities or games in class?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_CHI_TCH_08');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_CHI_TCH_09', 'Does the student leave their seat in class in situations where remaining seated is expected?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_CHI_TCH_09');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_CHI_TCH_10', 'Does the student complete classwork fully before moving on to another activity?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_CHI_TCH_10');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_CHI_TCH_11', 'Is the student easily distracted by unrelated sounds or activity in or outside the classroom?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_CHI_TCH_11');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_CHI_TCH_12', 'Does the student avoid or resist tasks requiring sustained mental effort, like extended assignments?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_CHI_TCH_12');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_CHI_TCH_13', 'Does the student talk excessively compared to classmates during lessons?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_CHI_TCH_13');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_CHI_TCH_14', 'Does the student organize their schoolwork and materials effectively in class?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_CHI_TCH_14');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_CHI_TCH_15', 'Does the student run or climb excessively in situations where it is not appropriate, such as in the hallway?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_CHI_TCH_15');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_CHI_TCH_16', 'Does the student have difficulty following the rules during PE, sports, or structured games?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_CHI_TCH_16');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_CHI_TCH_17', 'Does the student lose track of time, arriving late for class or school obligations?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_CHI_TCH_17');

-- ---- ADHD / Children/Adolescents (6-18) / therapist ----

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_CHI_THP_01', 'Does the client show difficulty sustaining attention on academic or structured tasks during assessment?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_CHI_THP_01');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_CHI_THP_02', 'Does the client show a pattern of careless errors on tasks due to inattention to detail?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_CHI_THP_02');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_CHI_THP_03', 'Does the client report frequently losing belongings necessary for tasks or activities?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_CHI_THP_03');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_CHI_THP_04', 'Does the client show difficulty retaining and following multi-step instructions?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_CHI_THP_04');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_CHI_THP_05', 'Does the client show excessive fidgeting or squirming when expected to remain seated?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_CHI_THP_05');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_CHI_THP_06', 'Does the client show a pattern of blurting responses before questions are complete?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_CHI_THP_06');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_CHI_THP_07', 'Does the client show a pattern of frequently interrupting others during conversation or activities?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_CHI_THP_07');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_CHI_THP_08', 'Does the client show difficulty waiting for a turn in structured group tasks?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_CHI_THP_08');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_CHI_THP_09', 'Does the client show difficulty remaining seated when expected during structured tasks?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_CHI_THP_09');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_CHI_THP_10', 'Does the client demonstrate task completion before shifting to a new activity?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_CHI_THP_10');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_CHI_THP_11', 'Does the client show a pattern of distractibility to extraneous stimuli during tasks?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_CHI_THP_11');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_CHI_THP_12', 'Does the client show avoidance of tasks requiring sustained mental effort?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_CHI_THP_12');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_CHI_THP_13', 'Does the client show excessive talkativeness relative to peers during observation?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_CHI_THP_13');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_CHI_THP_14', 'Does the client demonstrate effective organization of materials and tasks?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_CHI_THP_14');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_CHI_THP_15', 'Does the client show excessive gross motor activity in situations where it is not appropriate?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_CHI_THP_15');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_CHI_THP_16', 'Does the client show difficulty adhering to rules in structured game or sport contexts?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_CHI_THP_16');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_CHI_THP_17', 'Does the client show a pattern of losing track of time and being late for obligations?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_CHI_THP_17');

-- ---- ADHD / Adults (18+) / parent_caregiver ----

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_PC_01', 'Does the person you care for have difficulty managing time, often being late for work or family obligations?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_PC_01');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_PC_02', 'Does the person you care for chronically procrastinate on tasks with deadlines?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_PC_02');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_PC_03', 'Does the person you care for lose track of conversations, with their mind wandering while others speak?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_PC_03');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_PC_04', 'Does the person you care for start multiple projects or tasks but struggle to finish them?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_PC_04');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_PC_05', 'Does the person you care for seem restless or need to move or fidget frequently?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_PC_05');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_PC_06', 'Does the person you care for frequently misplace important items, like keys, phone, or documents?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_PC_06');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_PC_07', 'Does the person you care for struggle to follow through on commitments made to family or community?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_PC_07');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_PC_08', 'Does the person you care for make impulsive decisions, such as with spending or major life choices, without much planning?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_PC_08');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_PC_09', 'Is the person you care for able to maintain focus during long meetings, sermons, or community gatherings?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_PC_09');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_PC_10', 'Does the person you care for interrupt others frequently during conversations or meetings?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_PC_10');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_PC_11', 'Does the person you care for struggle to organize daily tasks or household responsibilities?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_PC_11');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_PC_12', 'Does the person you care for reliably meet deadlines and keep appointments?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_PC_12');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_PC_13', 'Does the person you care for feel overwhelmed managing responsibilities across work, extended family, and household?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_PC_13');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_PC_14', 'Does the person you care for have difficulty relaxing, always seeming wound up or restless internally?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_PC_14');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_PC_15', 'Does the person you care for forget important dates, such as birthdays, ceremonies, or bill payments?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_PC_15');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_PC_16', 'Does the person you care for lose focus midway through reading documents or long conversations?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_PC_16');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_PC_17', 'Is the person you care for able to sit through long communal or religious gatherings without excessive restlessness?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_PC_17');

-- ---- ADHD / Adults (18+) / teacher ----

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_TCH_01', 'Does the adult learner have difficulty managing time, often arriving late to class or missing deadlines?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'teacher', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_TCH_01');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_TCH_02', 'Does the adult learner chronically procrastinate on assignments or coursework with deadlines?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_TCH_02');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_TCH_03', 'Does the adult learner lose track of discussions, appearing to drift off while others are speaking?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_TCH_03');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_TCH_04', 'Does the adult learner start multiple assignments or projects but struggle to complete them?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'teacher', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_TCH_04');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_TCH_05', 'Does the adult learner appear restless, needing to move or fidget frequently during class?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_TCH_05');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_TCH_06', 'Does the adult learner frequently misplace materials needed for class, like notes or textbooks?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_TCH_06');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_TCH_07', 'Does the adult learner struggle to follow through on commitments made regarding coursework or group projects?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_TCH_07');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_TCH_08', 'Does the adult learner make impulsive choices about coursework or commitments without much planning?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_TCH_08');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_TCH_09', 'Is the adult learner able to maintain focus during long lectures or training sessions?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_TCH_09');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_TCH_10', 'Does the adult learner interrupt others frequently during class discussions or meetings?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_TCH_10');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_TCH_11', 'Does the adult learner struggle to organize study time or coursework responsibilities?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_TCH_11');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_TCH_12', 'Does the adult learner reliably meet coursework deadlines and attend scheduled sessions?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_TCH_12');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_TCH_13', 'Does the adult learner feel overwhelmed managing coursework alongside work and family responsibilities?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_TCH_13');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_TCH_14', 'Does the adult learner appear unable to relax, seeming internally restless even during calm activities?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_TCH_14');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_TCH_15', 'Does the adult learner forget important academic dates, such as exam schedules or submission deadlines?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_TCH_15');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_TCH_16', 'Does the adult learner lose focus midway through reading assignments or long lectures?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_TCH_16');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_TCH_17', 'Is the adult learner able to sit through long lectures or training sessions without excessive restlessness?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_TCH_17');

-- ---- ADHD / Adults (18+) / therapist ----

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_THP_01', 'Does the client report chronic difficulty with time management across work and personal obligations?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'therapist', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_THP_01');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_THP_02', 'Does the client describe a pattern of chronic procrastination on time-sensitive tasks?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_THP_02');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_THP_03', 'Does the client report frequently losing track of conversations due to attention drifting?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_THP_03');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_THP_04', 'Does the client describe starting many tasks or projects without follow-through to completion?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'therapist', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_THP_04');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_THP_05', 'Does the client report persistent internal or physical restlessness requiring movement?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_THP_05');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_THP_06', 'Does the client report frequently misplacing important items necessary for daily functioning?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_THP_06');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_THP_07', 'Does the client describe difficulty following through on commitments across various life domains?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_THP_07');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_THP_08', 'Does the client describe a pattern of impulsive decision-making without adequate forethought?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_THP_08');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_THP_09', 'Does the client demonstrate sustained focus during extended sessions or discussions?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_THP_09');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_THP_10', 'Does the client show a pattern of frequently interrupting others during conversation?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_THP_10');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_THP_11', 'Does the client report ongoing difficulty organizing daily tasks and responsibilities?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_THP_11');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_THP_12', 'Does the client demonstrate reliability in meeting deadlines and attending appointments?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_THP_12');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_THP_13', 'Does the client describe feeling overwhelmed managing multiple concurrent responsibilities?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_THP_13');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_THP_14', 'Does the client report an ongoing inability to relax or persistent internal restlessness?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_THP_14');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_THP_15', 'Does the client report frequently forgetting important dates or obligations?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_THP_15');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_THP_16', 'Does the client report losing focus midway through reading or extended verbal exchanges?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_THP_16');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_THP_17', 'Does the client demonstrate the ability to remain settled through extended sessions without excessive restlessness?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_THP_17');

-- ---- ADHD / Adults (18+) / self ----

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_SLF_01', 'Do you have difficulty managing time, often running late for work, appointments, or family obligations?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'self', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_SLF_01');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_SLF_02', 'Do you chronically procrastinate on tasks that have deadlines?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_SLF_02');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_SLF_03', 'Do you often lose track of conversations, with your mind wandering while others are speaking?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_SLF_03');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_SLF_04', 'Do you start multiple projects or tasks but struggle to finish them?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'self', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_SLF_04');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_SLF_05', 'Do you feel restless or find yourself needing to move or fidget frequently?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_SLF_05');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_SLF_06', 'Do you frequently misplace important items, such as your keys, phone, or documents?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_SLF_06');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_SLF_07', 'Do you struggle to follow through on commitments you have made to family, community, or work?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_SLF_07');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_SLF_08', 'Do you make impulsive decisions, such as with spending or major life choices, without much planning?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_SLF_08');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_SLF_09', 'Are you able to maintain focus during long meetings, sermons, or community gatherings?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_SLF_09');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_SLF_10', 'Do you frequently interrupt others during conversations or meetings?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_SLF_10');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_SLF_11', 'Do you struggle to organize your daily tasks or household responsibilities?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_SLF_11');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_SLF_12', 'Do you reliably meet deadlines and keep appointments?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_SLF_12');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_SLF_13', 'Do you feel overwhelmed managing multiple responsibilities at once, such as work, extended family, and household?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_SLF_13');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_SLF_14', 'Do you have difficulty relaxing, feeling wound up or internally restless most of the time?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_SLF_14');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_SLF_15', 'Do you often forget important dates, such as birthdays, ceremonies, or bill payments?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_SLF_15');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_SLF_16', 'Do you lose focus midway through reading a document or having a long conversation?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_SLF_16');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'ADHD'), 'ADH_ADU_SLF_17', 'Are you able to sit through long communal or religious gatherings without becoming excessively restless?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'ADH_ADU_SLF_17');

-- ============================================================================
-- DOMAIN: Dyslexia/Learning Differences
-- NOTE: Toddlers (2-5) intentionally skipped for this domain -- see header note.
-- ============================================================================

-- ---- Dyslexia/Learning Differences / Children/Adolescents (6-18) / parent_caregiver ----

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_CHI_PC_01', 'Does your child read noticeably slower than other children their age?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_CHI_PC_01');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_CHI_PC_02', 'Does your child frequently reverse letters or numbers when writing, such as b and d or 6 and 9?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_CHI_PC_02');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_CHI_PC_03', 'Does your child struggle to sound out unfamiliar words when reading?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_CHI_PC_03');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_CHI_PC_04', 'Does your child avoid reading aloud, such as during family devotions or religious readings?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_CHI_PC_04');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_CHI_PC_05', 'Does your child spell the same word differently within the same piece of writing?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_CHI_PC_05');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_CHI_PC_06', 'Does your child confuse similar-looking words when reading, such as "was" and "saw"?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_CHI_PC_06');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_CHI_PC_07', 'Does your child take much longer than expected to complete written homework?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_CHI_PC_07');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_CHI_PC_08', 'Does your child read with good accuracy and fluency for their grade level?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_CHI_PC_08');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_CHI_PC_09', 'Does your child have difficulty remembering sequences, such as days of the week or the alphabet?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_CHI_PC_09');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_CHI_PC_10', 'Does your child struggle to copy text accurately from a book or the board?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_CHI_PC_10');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_CHI_PC_11', 'Does your child frequently lose their place while reading a line of text?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_CHI_PC_11');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_CHI_PC_12', 'Does your child prefer to be told information out loud rather than reading it themselves?', 'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_CHI_PC_12');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_CHI_PC_13', 'Is the handwriting of your child significantly messier or slower to produce than other children their age?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_CHI_PC_13');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_CHI_PC_14', 'Does your child struggle to rhyme words or clap out syllables during songs or clapping games?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_CHI_PC_14');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_CHI_PC_15', 'Does your child understand and enjoy stories when they are told or read aloud, such as by grandparents?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_CHI_PC_15');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_CHI_PC_16', 'Does your child mix up left and right or get confused with directions easily?', 'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_CHI_PC_16');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_CHI_PC_17', 'Does your child avoid or seem anxious about reading in front of family members?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_CHI_PC_17');

-- ---- Dyslexia/Learning Differences / Children/Adolescents (6-18) / teacher ----

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_CHI_TCH_01', 'Does the student read noticeably slower than classmates at the same grade level?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_CHI_TCH_01');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_CHI_TCH_02', 'Does the student frequently reverse letters or numbers when writing in class?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_CHI_TCH_02');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_CHI_TCH_03', 'Does the student struggle to sound out unfamiliar words during reading exercises?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_CHI_TCH_03');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_CHI_TCH_04', 'Does the student avoid or become anxious about reading aloud in class or during school assembly?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_CHI_TCH_04');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_CHI_TCH_05', 'Does the student spell the same word inconsistently within the same piece of writing?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_CHI_TCH_05');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_CHI_TCH_06', 'Does the student confuse similar-looking words when reading aloud in class?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_CHI_TCH_06');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_CHI_TCH_07', 'Does the student take much longer than classmates to complete written class assignments?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_CHI_TCH_07');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_CHI_TCH_08', 'Does the student read with good accuracy and fluency compared to grade-level expectations?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_CHI_TCH_08');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_CHI_TCH_09', 'Does the student have difficulty remembering sequences, such as multiplication tables or the alphabet?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_CHI_TCH_09');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_CHI_TCH_10', 'Does the student struggle to copy text accurately from the board in class?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_CHI_TCH_10');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_CHI_TCH_11', 'Does the student frequently lose their place while reading a line of text aloud?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_CHI_TCH_11');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_CHI_TCH_12', 'Does the student prefer verbal instructions over reading written instructions in class?', 'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_CHI_TCH_12');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_CHI_TCH_13', 'Is the handwriting of the student significantly messier or slower than that of classmates at the same grade?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_CHI_TCH_13');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_CHI_TCH_14', 'Does the student struggle with rhyming or syllable clapping activities in class?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_CHI_TCH_14');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_CHI_TCH_15', 'Does the student understand and enjoy stories when they are read aloud in class?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_CHI_TCH_15');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_CHI_TCH_16', 'Does the student mix up left and right or get confused with directions during activities like PE?', 'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_CHI_TCH_16');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_CHI_TCH_17', 'Does the student avoid or seem anxious about reading in front of the class?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_CHI_TCH_17');

-- ---- Dyslexia/Learning Differences / Children/Adolescents (6-18) / therapist ----

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_CHI_THP_01', 'Does the client show reading speed noticeably below expectations for their age or grade?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_CHI_THP_01');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_CHI_THP_02', 'Does the client show a persistent pattern of letter or number reversals in writing?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_CHI_THP_02');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_CHI_THP_03', 'Does the client show difficulty decoding unfamiliar words during reading assessment?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_CHI_THP_03');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_CHI_THP_04', 'Does the client report or show avoidance of reading aloud in front of others?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_CHI_THP_04');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_CHI_THP_05', 'Does the client show inconsistent spelling of the same word within a single writing sample?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_CHI_THP_05');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_CHI_THP_06', 'Does the client show confusion between visually similar words during reading assessment?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_CHI_THP_06');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_CHI_THP_07', 'Does the client show significantly longer completion times for written tasks?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_CHI_THP_07');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_CHI_THP_08', 'Does the client demonstrate reading accuracy and fluency consistent with grade-level expectations?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_CHI_THP_08');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_CHI_THP_09', 'Does the client show difficulty recalling ordered sequences such as days, months, or numeric tables?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_CHI_THP_09');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_CHI_THP_10', 'Does the client show difficulty accurately copying text during observation?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_CHI_THP_10');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_CHI_THP_11', 'Does the client show a pattern of losing their place during continuous reading tasks?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_CHI_THP_11');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_CHI_THP_12', 'Does the client show a preference for verbal over written information during assessment?', 'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_CHI_THP_12');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_CHI_THP_13', 'Does the client show handwriting notably slower or less legible than age-expected norms?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_CHI_THP_13');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_CHI_THP_14', 'Does the client show difficulty with rhyme recognition or syllable segmentation tasks?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_CHI_THP_14');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_CHI_THP_15', 'Does the client show good comprehension and enjoyment of stories presented orally?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_CHI_THP_15');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_CHI_THP_16', 'Does the client show confusion with left-right orientation or directional concepts?', 'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_CHI_THP_16');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_CHI_THP_17', 'Does the client report or show anxiety around reading tasks performed in front of others?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_CHI_THP_17');

-- ---- Dyslexia/Learning Differences / Adults (18+) / parent_caregiver ----

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_PC_01', 'Does the person you care for read noticeably slower than most people, needing extra time to finish documents?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_PC_01');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_PC_02', 'Does the person you care for rely heavily on spellcheck or autocorrect to catch spelling errors?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_PC_02');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_PC_03', 'Does the person you care for avoid reading aloud in meetings, church, mosque, or community gatherings?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_PC_03');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_PC_04', 'Does the person you care for struggle to fill out official forms accurately, such as bank or clinic forms?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_PC_04');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_PC_05', 'Does the person you care for prefer phone calls or face-to-face talk over reading written messages?', 'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_PC_05');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_PC_06', 'Does the person you care for confuse similar words or lose their place while reading long documents?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_PC_06');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_PC_07', 'Does the person you care for need to re-read text multiple times to fully understand it?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_PC_07');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_PC_08', 'Does the person you care for read and understand written material efficiently, even under time pressure?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_PC_08');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_PC_09', 'Does the person you care for avoid jobs or tasks that require heavy reading or writing?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_PC_09');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_PC_10', 'Does the person you care for have difficulty remembering sequences of instructions, spoken or written?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_PC_10');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_PC_11', 'Was the person you care for frequently told as a child that they were lazy or not trying hard enough academically?', 'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_PC_11');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_PC_12', 'Is the handwriting of the person you care for difficult for others to read?', 'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_PC_12');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_PC_13', 'Does the person you care for mix up numbers when handling money, such as market or mobile money transactions?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_PC_13');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_PC_14', 'Is the person you care for confident and efficient when writing reports, letters, or messages?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_PC_14');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_PC_15', 'Does the person you care for record audio notes or ask others to remember things rather than writing them down?', 'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_PC_15');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_PC_16', 'Does the person you care for struggle to organize their written thoughts into a clear structure?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_PC_16');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_PC_17', 'Does the person you care for find it easier to learn new information through listening or watching than through reading text?', 'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_PC_17');

-- ---- Dyslexia/Learning Differences / Adults (18+) / teacher ----

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_TCH_01', 'Does the adult learner read noticeably slower than peers, needing extra time to finish reading tasks?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'teacher', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_TCH_01');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_TCH_02', 'Does the adult learner rely heavily on spellcheck or autocorrect for written assignments?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_TCH_02');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_TCH_03', 'Does the adult learner avoid reading aloud during class or training sessions?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_TCH_03');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_TCH_04', 'Does the adult learner struggle to fill out written assignments or forms accurately?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_TCH_04');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_TCH_05', 'Does the adult learner prefer verbal explanation over reading written course materials?', 'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_TCH_05');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_TCH_06', 'Does the adult learner confuse similar words or lose their place while reading long texts?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_TCH_06');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_TCH_07', 'Does the adult learner need to re-read course material multiple times to understand it?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_TCH_07');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_TCH_08', 'Does the adult learner read and comprehend written material efficiently, even under time pressure?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_TCH_08');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_TCH_09', 'Does the adult learner avoid coursework or tasks that require heavy reading or writing?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_TCH_09');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_TCH_10', 'Does the adult learner have difficulty remembering multi-step instructions given in class or training?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_TCH_10');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_TCH_11', 'Has the adult learner mentioned being frequently told as a child that they were lazy or not trying hard enough?', 'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_TCH_11');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_TCH_12', 'Is the handwriting of the adult learner difficult for others to read?', 'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_TCH_12');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_TCH_13', 'Does the adult learner mix up numbers when working with figures in class or training exercises?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_TCH_13');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_TCH_14', 'Is the adult learner confident and efficient when writing reports, essays, or assignments?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_TCH_14');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_TCH_15', 'Does the adult learner record audio or rely on others'' notes rather than writing their own?', 'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_TCH_15');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_TCH_16', 'Does the adult learner struggle to organize written assignments into a clear structure?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_TCH_16');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_TCH_17', 'Does the adult learner find it easier to learn new information through listening or demonstration than through reading?', 'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_TCH_17');

-- ---- Dyslexia/Learning Differences / Adults (18+) / therapist ----

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_THP_01', 'Does the client show reading speed notably below typical adult expectations?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'therapist', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_THP_01');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_THP_02', 'Does the client describe strong reliance on spellcheck or autocorrect tools for writing?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_THP_02');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_THP_03', 'Does the client report or show avoidance of reading aloud in group settings?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_THP_03');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_THP_04', 'Does the client describe difficulty accurately completing official written forms?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_THP_04');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_THP_05', 'Does the client describe a preference for verbal over written communication?', 'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_THP_05');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_THP_06', 'Does the client show a pattern of losing place or confusing similar words during extended reading?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_THP_06');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_THP_07', 'Does the client report needing to re-read material repeatedly to achieve comprehension?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_THP_07');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_THP_08', 'Does the client demonstrate efficient reading comprehension under timed conditions?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_THP_08');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_THP_09', 'Does the client describe a pattern of avoiding tasks that require heavy reading or writing?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_THP_09');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_THP_10', 'Does the client show difficulty retaining sequences of instructions?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_THP_10');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_THP_11', 'Does the client report having been frequently labeled as lazy or not trying hard enough academically as a child?', 'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_THP_11');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_THP_12', 'Does the client''s handwriting show notable illegibility to others?', 'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_THP_12');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_THP_13', 'Does the client describe difficulty accurately handling numeric information in transactions?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_THP_13');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_THP_14', 'Does the client demonstrate confidence and efficiency in written communication tasks?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_THP_14');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_THP_15', 'Does the client describe relying on audio recording or verbal reminders instead of written notes?', 'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_THP_15');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_THP_16', 'Does the client show difficulty organizing written expression into a coherent structure?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_THP_16');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_THP_17', 'Does the client describe a strong preference for auditory or demonstrative learning over reading text?', 'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_THP_17');

-- ---- Dyslexia/Learning Differences / Adults (18+) / self ----

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_SLF_01', 'Do you read noticeably slower than most people, needing extra time to finish documents?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'self', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_SLF_01');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_SLF_02', 'Do you rely heavily on spellcheck or autocorrect to catch your spelling errors?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_SLF_02');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_SLF_03', 'Do you avoid reading aloud in meetings, religious services, or community gatherings?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_SLF_03');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_SLF_04', 'Do you struggle to fill out official forms accurately, such as bank, government, or clinic forms?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_SLF_04');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_SLF_05', 'Do you prefer phone calls or face-to-face conversation over reading written messages?', 'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_SLF_05');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_SLF_06', 'Do you confuse similar-looking words or lose your place while reading long documents?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_SLF_06');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_SLF_07', 'Do you need to re-read text multiple times before you fully understand it?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_SLF_07');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_SLF_08', 'Can you read and understand written material efficiently, even when under time pressure?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_SLF_08');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_SLF_09', 'Do you avoid jobs or tasks that require a lot of reading or writing?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_SLF_09');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_SLF_10', 'Do you have difficulty remembering sequences of instructions, whether spoken or written?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_SLF_10');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_SLF_11', 'Were you frequently told as a child that you were lazy or not trying hard enough academically?', 'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_SLF_11');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_SLF_12', 'Is your handwriting difficult for other people to read?', 'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_SLF_12');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_SLF_13', 'Do you mix up numbers when handling money, such as market purchases or mobile money transactions?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_SLF_13');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_SLF_14', 'Are you confident and efficient when writing reports, letters, or messages?', 'likert', '["Always", "Often", "Sometimes", "Rarely", "Never"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_SLF_14');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_SLF_15', 'Do you record audio notes or ask others to remember things for you rather than writing them down?', 'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_SLF_15');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_SLF_16', 'Do you struggle to organize your written thoughts into a clear structure?', 'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_SLF_16');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyslexia/Learning Differences'), 'DYS_ADU_SLF_17', 'Do you find it easier to learn new information by listening or watching a demonstration rather than by reading text?', 'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'DYS_ADU_SLF_17');
