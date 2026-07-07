-- ============================================================================
-- Neu Rafiki - Question Bank Part 2
-- Domains: Dyspraxia/Motor Coordination, Sensory Processing, Executive Function
-- Idempotent inserts (safe to re-run): each row is skipped if its question_id
-- already exists.
-- ============================================================================
--
-- SUMMARY OF ROWS WRITTEN (question count per domain x age_group x respondent_type)
--
-- Dyspraxia/Motor Coordination
--   Toddlers (2-5)              : parent_caregiver 17, teacher 17, therapist 17            (51)
--   Children/Adolescents (6-18) : parent_caregiver 17, teacher 17, therapist 17            (51)
--   Adults (18+)                : parent_caregiver 17, teacher 17, therapist 17, self 17   (68)
--   Domain total                                                                          : 170
--
-- Sensory Processing
--   Toddlers (2-5)              : parent_caregiver 17, teacher 17, therapist 17            (51)
--   Children/Adolescents (6-18) : parent_caregiver 17, teacher 17, therapist 17            (51)
--   Adults (18+)                : parent_caregiver 17, teacher 17, therapist 17, self 17   (68)
--   Domain total                                                                          : 170
--
-- Executive Function
--   Toddlers (2-5)              : parent_caregiver 17, teacher 17, therapist 17            (51)
--   Children/Adolescents (6-18) : parent_caregiver 17, teacher 17, therapist 17            (51)
--   Adults (18+)                : parent_caregiver 17, teacher 17, therapist 17, self 17   (68)
--   Domain total                                                                          : 170
--
-- GRAND TOTAL ROWS: 510
--
-- Note on respondent coverage: per spec, 'self' rows are only generated for
-- the 'Adults (18+)' age group (self-report isn't developmentally realistic
-- for toddlers/children). 'parent_caregiver', 'teacher', and 'therapist' rows
-- are generated for all three age groups (for Adults, 'teacher' is reframed
-- as an instructor/supervisor observing the adult, and 'parent_caregiver' as
-- a family member/caregiver observing the adult, since the app's respondent
-- picker allows these roles at any age).
--
-- Scoring convention followed throughout: options are ordered from LEAST
-- concerning (index 0) to MOST concerning (highest index), because the app
-- scores a response as options.indexOf(value) * score_weight. Nearly all
-- questions here are phrased as "difficulty / how often does X struggle with
-- Y" so option arrays consistently run No/Never (low concern) -> Yes/Always
-- (high concern).
-- ============================================================================


-- ############################################################################
-- DOMAIN: Dyspraxia/Motor Coordination
-- ############################################################################

-- ============================================================
-- Dyspraxia/Motor Coordination — Toddlers (2-5)
-- ============================================================

-- MOT_TOD_01: Running steadily compared to peers
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_TOD_PC_01',
  'Does your child have difficulty running steadily compared to other children their age when playing outdoors or at family gatherings?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_TOD_PC_01');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_TOD_TCH_01',
  'Does the child have difficulty running steadily compared to peers during outdoor or playground activities?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_TOD_TCH_01');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_TOD_THP_01',
  'During gross motor observation, does the child show difficulty running with a steady, coordinated gait compared to age expectations?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_TOD_THP_01');

-- MOT_TOD_02: Jumping with both feet off ground
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_TOD_PC_02',
  'Does your child struggle to jump with both feet leaving the ground at the same time?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_TOD_PC_02');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_TOD_TCH_02',
  'Does the child struggle to jump with both feet leaving the ground together during playtime?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_TOD_TCH_02');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_TOD_THP_02',
  'Does the child show difficulty achieving a two-footed jump with both feet leaving the ground simultaneously?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_TOD_THP_02');

-- MOT_TOD_03: Needing rail/hand-holding on stairs beyond typical age
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_TOD_PC_03',
  'How often does your child need to hold the rail or an adult''s hand to climb stairs, more than you would expect for their age, such as when visiting relatives?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_TOD_PC_03');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_TOD_TCH_03',
  'How often does the child need extra support, such as a rail or an adult''s hand, to manage stairs compared to same-age peers?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_TOD_TCH_03');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_TOD_THP_03',
  'How often does the child require additional support, such as a railing or hand-holding, for stair navigation beyond what is typical for their age?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_TOD_THP_03');

-- MOT_TOD_04: Frequent falling/tripping (weight 2 - high signal)
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_TOD_PC_04',
  'How often does your child fall or trip more than other children their age when playing, running errands, or at the market?',
  'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_TOD_PC_04');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_TOD_TCH_04',
  'How often does the child fall or trip more than peers during outdoor or playground play?',
  'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'teacher', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_TOD_TCH_04');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_TOD_THP_04',
  'How often does the child present with falls or trips exceeding what would be expected for chronological age during gross motor activity?',
  'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'therapist', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_TOD_THP_04');

-- MOT_TOD_05: Bumping into furniture/people
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_TOD_PC_05',
  'How often does your child bump into furniture, walls, or people at home compared to other children?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_TOD_PC_05');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_TOD_TCH_05',
  'How often does the child bump into furniture or classmates in the classroom or play area?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_TOD_TCH_05');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_TOD_THP_05',
  'How often is the child observed colliding with objects or people in the environment, suggesting reduced spatial awareness?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_TOD_THP_05');

-- MOT_TOD_06: Spilling from spoon/cup
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_TOD_PC_06',
  'Does your child spill food or drink often when using a spoon or cup during meals?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_TOD_PC_06');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_TOD_TCH_06',
  'Does the child spill food or drink often when eating independently at snack or meal time?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_TOD_TCH_06');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_TOD_THP_06',
  'Does the child demonstrate frequent spilling when using utensils or a cup, beyond what is typical for age?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_TOD_THP_06');

-- MOT_TOD_07: Avoids/resists active physical play
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_TOD_PC_07',
  'Does your child avoid or resist active physical play, such as running or climbing games, that other children enjoy?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_TOD_PC_07');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_TOD_TCH_07',
  'Does the child avoid or resist active physical play during outdoor time compared to classmates?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_TOD_TCH_07');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_TOD_THP_07',
  'Does the child show avoidance of gross motor play activities relative to same-age peers?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_TOD_THP_07');

-- MOT_TOD_08: Difficulty kicking a ball
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_TOD_PC_08',
  'Does your child have difficulty kicking a ball, even a large, slow-moving one?',
  'multiple_choice', '["No", "Some difficulty", "Yes, significant difficulty"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_TOD_PC_08');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_TOD_TCH_08',
  'Does the child have difficulty kicking a ball during outdoor play or simple PE-readiness activities?',
  'multiple_choice', '["No", "Some difficulty", "Yes, significant difficulty"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_TOD_TCH_08');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_TOD_THP_08',
  'Does the child demonstrate difficulty executing a coordinated kicking motion with a stationary ball?',
  'multiple_choice', '["No", "Some difficulty", "Yes, significant difficulty"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_TOD_THP_08');

-- MOT_TOD_09: Difficulty catching/throwing a large ball
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_TOD_PC_09',
  'Does your child struggle to catch or throw a large ball with you or siblings?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_TOD_PC_09');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_TOD_TCH_09',
  'Does the child struggle to catch or throw a large ball during group play?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_TOD_TCH_09');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_TOD_THP_09',
  'Does the child show difficulty with catching or throwing tasks using a large ball during structured play assessment?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_TOD_THP_09');

-- MOT_TOD_10: Difficulty pedaling/riding tricycle
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_TOD_PC_10',
  'Does your child have difficulty learning to pedal a tricycle or ride-on toy?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_TOD_PC_10');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_TOD_TCH_10',
  'Does the child have difficulty pedaling a tricycle or ride-on toy during outdoor play?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_TOD_TCH_10');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_TOD_THP_10',
  'Does the child demonstrate difficulty coordinating the pedaling motion required for a tricycle?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_TOD_THP_10');

-- MOT_TOD_11: Difficulty stacking blocks/building steady tower
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_TOD_PC_11',
  'Does your child have difficulty stacking blocks or building a steady tower compared to other children their age?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_TOD_PC_11');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_TOD_TCH_11',
  'Does the child have difficulty stacking blocks or completing simple construction play compared to peers?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_TOD_TCH_11');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_TOD_THP_11',
  'Does the child show difficulty with block-stacking tasks requiring fine motor precision and stability for their age?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_TOD_THP_11');

-- MOT_TOD_12: Difficulty putting on simple clothing
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_TOD_PC_12',
  'How often does your child struggle to put on simple clothing items, such as shoes, a hat, or a jacket, without your help?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_TOD_PC_12');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_TOD_TCH_12',
  'How often does the child struggle to manage simple clothing items independently, such as after outdoor play?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_TOD_TCH_12');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_TOD_THP_12',
  'How often does the child require assistance with simple dressing tasks beyond what is expected for their age?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_TOD_THP_12');

-- MOT_TOD_13: Immature/awkward pencil-crayon grip
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_TOD_PC_13',
  'Does your child hold a crayon or pencil in an unusual or awkward way for their age?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_TOD_PC_13');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_TOD_TCH_13',
  'Does the child hold a crayon or pencil in an unusual or awkward way during drawing activities?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_TOD_TCH_13');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_TOD_THP_13',
  'Does the child present with an immature or atypical pencil or crayon grasp relative to developmental norms?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_TOD_THP_13');

-- MOT_TOD_14: Difficulty balancing on one foot briefly
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_TOD_PC_14',
  'Does your child have difficulty standing on one foot for even a few seconds, such as when playing balance games?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_TOD_PC_14');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_TOD_TCH_14',
  'Does the child have difficulty balancing on one foot during simple movement games?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_TOD_TCH_14');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_TOD_THP_14',
  'Does the child show difficulty maintaining single-leg stance briefly, relative to age expectations?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_TOD_THP_14');

-- MOT_TOD_15: Difficulty navigating uneven ground/steps
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_TOD_PC_15',
  'How often does your child struggle to walk on uneven ground, such as a compound, market paths, or unpaved roads, without stumbling?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_TOD_PC_15');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_TOD_TCH_15',
  'How often does the child struggle with uneven surfaces or steps around the school compound?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_TOD_TCH_15');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_TOD_THP_15',
  'How often does the child demonstrate instability when navigating uneven terrain or steps compared to age norms?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_TOD_THP_15');

-- MOT_TOD_16: Difficulty pouring liquid without spilling
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_TOD_PC_16',
  'Does your child spill liquid often when trying to pour from a jug or cup during meals?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_TOD_PC_16');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_TOD_TCH_16',
  'Does the child spill liquid often when pouring water or juice during snack time?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_TOD_TCH_16');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_TOD_THP_16',
  'Does the child show difficulty with controlled pouring tasks requiring hand stability?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_TOD_THP_16');

-- MOT_TOD_17: Avoids/tires quickly during communal active games
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_TOD_PC_17',
  'How often does your child tire quickly or avoid joining active communal games, such as traditional dance or playground games at family gatherings, that other children enjoy?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_TOD_PC_17');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_TOD_TCH_17',
  'How often does the child tire quickly or avoid joining group movement games and dance activities at school?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_TOD_TCH_17');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_TOD_THP_17',
  'How often does the child show reduced stamina or avoidance during structured group motor activities compared to peers?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_TOD_THP_17');

-- ============================================================
-- Dyspraxia/Motor Coordination — Children/Adolescents (6-18)
-- ============================================================

-- MOT_CHI_01: Handwriting legibility (weight 2 - high signal)
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_CHI_PC_01',
  'How often is your child''s handwriting difficult for others to read compared to classmates?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_CHI_PC_01');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_CHI_TCH_01',
  'How often is the student''s handwriting difficult to read compared to classmates of the same age?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_CHI_TCH_01');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_CHI_THP_01',
  'How often does the child produce handwriting that is illegible or significantly below age expectations?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_CHI_THP_01');

-- MOT_CHI_02: Handwriting speed / keeping up copying from board
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_CHI_PC_02',
  'Does your child fall behind when copying homework or notes compared to how quickly classmates finish?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_CHI_PC_02');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_CHI_TCH_02',
  'Does the student fall behind when copying from the board compared to classmates?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_CHI_TCH_02');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_CHI_THP_02',
  'Does the child demonstrate slower handwriting output relative to peers during timed copying tasks?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_CHI_THP_02');

-- MOT_CHI_03: Catching a ball during PE/sports
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_CHI_PC_03',
  'Does your child struggle to catch a ball during sports or games with friends?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_CHI_PC_03');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_CHI_TCH_03',
  'Does the student struggle to catch a ball during PE or playground games?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_CHI_TCH_03');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_CHI_THP_03',
  'Does the child show difficulty catching a ball during structured motor assessment or sports activity?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_CHI_THP_03');

-- MOT_CHI_04: Kicking or aiming a ball accurately
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_CHI_PC_04',
  'Does your child have difficulty kicking or aiming a ball accurately during football or other games?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_CHI_PC_04');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_CHI_TCH_04',
  'Does the student have difficulty kicking or aiming a ball accurately during PE or break-time games?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_CHI_TCH_04');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_CHI_THP_04',
  'Does the child demonstrate reduced accuracy when kicking or aiming a ball during motor tasks?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_CHI_THP_04');

-- MOT_CHI_05: Balance - riding a bicycle
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_CHI_PC_05',
  'Has your child had unusual difficulty learning to balance and ride a bicycle compared to peers?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_CHI_PC_05');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_CHI_TCH_05',
  'Has the student shown unusual difficulty with balance-based activities like bicycle riding compared to classmates?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_CHI_TCH_05');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_CHI_THP_05',
  'Does the child demonstrate atypical difficulty acquiring balance-dependent skills such as bicycle riding?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_CHI_THP_05');

-- MOT_CHI_06: Buttoning shirt/school uniform
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_CHI_PC_06',
  'Does your child struggle to button their shirt or school uniform independently?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_CHI_PC_06');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_CHI_TCH_06',
  'Does the student struggle to manage uniform buttons independently, such as after PE?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_CHI_TCH_06');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_CHI_THP_06',
  'Does the child show difficulty with buttoning tasks requiring fine motor sequencing?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_CHI_THP_06');

-- MOT_CHI_07: Tying shoelaces
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_CHI_PC_07',
  'Does your child have difficulty tying their own shoelaces, even after repeated practice?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_CHI_PC_07');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_CHI_TCH_07',
  'Does the student have difficulty tying shoelaces independently at school?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_CHI_TCH_07');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_CHI_THP_07',
  'Does the child demonstrate persistent difficulty mastering the shoelace-tying sequence?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_CHI_THP_07');

-- MOT_CHI_08: Bumping into furniture, doorways, peers in hallway
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_CHI_PC_08',
  'How often does your child bump into furniture, doorways, or people at home?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_CHI_PC_08');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_CHI_TCH_08',
  'How often does the student bump into furniture, doorways, or classmates in busy hallways or during assembly line-up?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_CHI_TCH_08');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_CHI_THP_08',
  'How often is the child observed colliding with objects or peers in structured or unstructured settings?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_CHI_THP_08');

-- MOT_CHI_09: Using scissors / cutting along a line
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_CHI_PC_09',
  'Does your child have difficulty using scissors to cut along a line during craft activities?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_CHI_PC_09');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_CHI_TCH_09',
  'Does the student have difficulty using scissors to cut along a line during art class?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_CHI_TCH_09');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_CHI_THP_09',
  'Does the child demonstrate difficulty with scissor control and precision relative to age norms?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_CHI_THP_09');

-- MOT_CHI_10: Organizing/using cutlery neatly at communal meals
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_CHI_PC_10',
  'How often does your child struggle to use cutlery neatly during family or communal meals?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_CHI_PC_10');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_CHI_TCH_10',
  'How often does the student struggle with neat, coordinated eating during school meal times?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_CHI_TCH_10');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_CHI_THP_10',
  'How often does the child show reduced fine motor control when using cutlery during mealtime observation?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_CHI_THP_10');

-- MOT_CHI_11: Avoidance of sports/PE due to coordination difficulty
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_CHI_PC_11',
  'Does your child avoid sports or physical activities because they feel less coordinated than others?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_CHI_PC_11');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_CHI_TCH_11',
  'Does the student avoid or make excuses to skip PE or sports activities compared to classmates?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_CHI_TCH_11');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_CHI_THP_11',
  'Does the child show avoidance behavior toward physical education or sport due to perceived coordination difficulty?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_CHI_THP_11');

-- MOT_CHI_12: Copying shapes/drawing accurately for age
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_CHI_PC_12',
  'Does your child have difficulty copying shapes or drawings accurately for their age?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_CHI_PC_12');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_CHI_TCH_12',
  'Does the student have difficulty copying shapes or diagrams accurately during class activities?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_CHI_TCH_12');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_CHI_THP_12',
  'Does the child demonstrate visual-motor integration difficulty when copying shapes relative to age expectations?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_CHI_THP_12');

-- MOT_CHI_13: Sequenced physical tasks (traditional dance steps, drills)
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_CHI_PC_13',
  'How often does your child struggle to follow sequenced movement steps, such as traditional dance or exercise routines at family celebrations?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_CHI_PC_13');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_CHI_TCH_13',
  'How often does the student struggle to follow sequenced movement drills or dance steps during PE or cultural events?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_CHI_TCH_13');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_CHI_THP_13',
  'How often does the child show difficulty executing multi-step motor sequences during movement-based tasks?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_CHI_THP_13');

-- MOT_CHI_14: Spatial awareness navigating crowded spaces (assembly, market, matatu)
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_CHI_PC_14',
  'Does your child bump into people or struggle to navigate crowded places like the market or a matatu or taxi?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_CHI_PC_14');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_CHI_TCH_14',
  'Does the student bump into others or struggle to navigate crowded spaces like school assembly or corridors?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_CHI_TCH_14');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_CHI_THP_14',
  'Does the child demonstrate difficulty navigating crowded environments without collision, suggesting reduced spatial judgment?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_CHI_THP_14');

-- MOT_CHI_15: Dropping/fumbling objects more than peers
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_CHI_PC_15',
  'How often does your child drop or fumble objects, such as plates, cups, or books, more than siblings or peers?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_CHI_PC_15');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_CHI_TCH_15',
  'How often does the student drop or fumble classroom materials, such as books or equipment, more than classmates?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_CHI_TCH_15');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_CHI_THP_15',
  'How often is the child observed dropping or fumbling held objects during fine motor tasks?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_CHI_THP_15');

-- MOT_CHI_16: Learning new motor skill takes longer (skipping rope, swimming)
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_CHI_PC_16',
  'Does it take your child noticeably longer than peers to learn new physical skills, such as skipping rope or swimming?',
  'multiple_choice', '["No", "Somewhat longer", "Yes, much longer"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_CHI_PC_16');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_CHI_TCH_16',
  'Does it take the student noticeably longer than classmates to learn new physical skills taught in PE, such as skipping rope or swimming strokes?',
  'multiple_choice', '["No", "Somewhat longer", "Yes, much longer"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_CHI_TCH_16');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_CHI_THP_16',
  'Does the child require significantly more practice time than peers to acquire new motor skills?',
  'multiple_choice', '["No", "Somewhat longer", "Yes, much longer"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_CHI_THP_16');

-- MOT_CHI_17: Pencil grip / hand fatigue during long writing tasks
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_CHI_PC_17',
  'How often does your child complain of hand tiredness or pain during homework or long writing tasks?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_CHI_PC_17');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_CHI_TCH_17',
  'How often does the student complain of hand fatigue or shake out their hand during longer writing tasks in class?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_CHI_TCH_17');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_CHI_THP_17',
  'How often does the child report or display hand fatigue consistent with an inefficient pencil grip during sustained writing?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_CHI_THP_17');

-- ============================================================
-- Dyspraxia/Motor Coordination — Adults (18+)
-- ============================================================

-- MOT_ADU_01: Clumsiness in daily tasks (weight 2 - high signal)
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_PC_01',
  'How often does this person spill drinks, drop objects, or have similar clumsy accidents during everyday tasks at home?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_PC_01');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_TCH_01',
  'As this person''s instructor or supervisor, how often have you noticed them being unusually clumsy, such as dropping items or knocking things over, during activities or training?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Adults (18+)', 'teacher', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_TCH_01');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_THP_01',
  'How often does the client report or demonstrate clumsiness, such as spilling or dropping objects, during daily tasks?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Adults (18+)', 'therapist', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_THP_01');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_SLF_01',
  'How often do you spill drinks, drop objects, or have similar clumsy accidents during everyday tasks?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Adults (18+)', 'self', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_SLF_01');

-- MOT_ADU_02: Difficulty learning new physical/motor skill (driving, sport)
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_PC_02',
  'Has this person had unusual difficulty learning new physical skills as an adult, such as driving or a new sport?',
  'multiple_choice', '["No", "Somewhat", "Yes, significantly"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_PC_02');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_TCH_02',
  'Have you noticed this person taking noticeably longer than others to learn new physical or motor-based skills you are teaching or supervising?',
  'multiple_choice', '["No", "Somewhat", "Yes, significantly"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_TCH_02');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_THP_02',
  'Does the client report significant difficulty acquiring new motor skills in adulthood, such as driving, sports, or dance?',
  'multiple_choice', '["No", "Somewhat", "Yes, significantly"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_THP_02');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_SLF_02',
  'Have you had unusual difficulty learning new physical skills as an adult, such as driving or a new sport?',
  'multiple_choice', '["No", "Somewhat", "Yes, significantly"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_SLF_02');

-- MOT_ADU_03: Poor handwriting persisting into adulthood
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_PC_03',
  'Does this person''s handwriting remain difficult to read, even as an adult?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_PC_03');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_TCH_03',
  'Have you noticed this person''s handwriting is difficult to read compared to peers in written work or forms?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_TCH_03');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_THP_03',
  'Does the client report or demonstrate persistently illegible handwriting into adulthood?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_THP_03');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_SLF_03',
  'Is your handwriting still difficult for others to read, even as an adult?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_SLF_03');

-- MOT_ADU_04: Workspace/desk organization affected by spatial coordination
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_PC_04',
  'How often does this person struggle to keep their personal space or belongings organized due to difficulty judging space and placement?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_PC_04');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_TCH_04',
  'How often does this person''s workstation or materials appear disorganized in a way linked to spatial coordination difficulty?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_TCH_04');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_THP_04',
  'How often does the client describe difficulty organizing physical space due to challenges with spatial coordination?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_THP_04');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_SLF_04',
  'How often do you struggle to keep your workspace or belongings organized because of difficulty judging space and placement?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_SLF_04');

-- MOT_ADU_05: Difficulty parking/judging distances while driving
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_PC_05',
  'Does this person have difficulty judging distances while driving or parking?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_PC_05');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_TCH_05',
  'Have you observed this person having difficulty judging distances during practical or driving-related training?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_TCH_05');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_THP_05',
  'Does the client report difficulty with spatial judgment tasks such as parking or judging distances while driving?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_THP_05');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_SLF_05',
  'Do you have difficulty judging distances while driving or parking?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_SLF_05');

-- MOT_ADU_06: Bumping into door frames/furniture at home or work
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_PC_06',
  'How often does this person bump into door frames, furniture, or other objects at home?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_PC_06');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_TCH_06',
  'How often have you noticed this person bumping into furniture or equipment in the workplace or training environment?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_TCH_06');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_THP_06',
  'How often does the client report bumping into objects in the home or work environment?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_THP_06');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_SLF_06',
  'How often do you bump into door frames, furniture, or other objects at home or work?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_SLF_06');

-- MOT_ADU_07: Difficulty with bilateral coordination tasks (chopping vegetables, sewing)
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_PC_07',
  'Does this person struggle with two-handed tasks like chopping vegetables, sewing, or preparing a meal?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_PC_07');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_TCH_07',
  'Have you noticed this person struggling with tasks that require coordinating both hands together?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_TCH_07');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_THP_07',
  'Does the client report difficulty with bilateral coordination tasks such as food preparation or sewing?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_THP_07');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_SLF_07',
  'Do you struggle with two-handed tasks like chopping vegetables, sewing, or preparing a meal?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_SLF_07');

-- MOT_ADU_08: Avoids sports/exercise due to coordination difficulty
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_PC_08',
  'Does this person avoid sports or exercise because they feel physically uncoordinated?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_PC_08');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_TCH_08',
  'Have you noticed this person avoiding physical activities or exercise sessions, possibly due to coordination difficulty?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_TCH_08');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_THP_08',
  'Does the client report avoidance of sports or exercise linked to perceived motor coordination difficulty?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_THP_08');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_SLF_08',
  'Do you avoid sports or exercise because you feel physically uncoordinated?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_SLF_08');

-- MOT_ADU_09: Difficulty carrying multiple items without dropping (trays, market goods)
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_PC_09',
  'Does this person struggle to carry several items at once, such as groceries, market goods, or a tray, without dropping something?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_PC_09');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_TCH_09',
  'Have you observed this person struggling to carry or transport multiple items without dropping something during work tasks?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_TCH_09');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_THP_09',
  'Does the client report difficulty carrying multiple items simultaneously without dropping objects?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_THP_09');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_SLF_09',
  'Do you struggle to carry several items at once, such as groceries, market goods, or a tray, without dropping something?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_SLF_09');

-- MOT_ADU_10: Handwriting/typing speed under time pressure
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_PC_10',
  'How often does this person fall behind on written or typed tasks when working under time pressure?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_PC_10');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_TCH_10',
  'How often does this person fall behind on written or practical tasks compared to peers when working under time pressure?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_TCH_10');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_THP_10',
  'How often does the client report falling behind on time-pressured written or motor output tasks?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_THP_10');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_SLF_10',
  'How often do you fall behind on written or typed tasks when working under time pressure?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_SLF_10');

-- MOT_ADU_11: Balance issues - tripping on stairs/uneven pavement
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_PC_11',
  'How often does this person trip on stairs or uneven pavement compared to others?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_PC_11');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_TCH_11',
  'How often have you noticed this person tripping or stumbling on stairs or uneven ground during work or training activities?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_TCH_11');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_THP_11',
  'How often does the client report tripping or balance difficulty on stairs or uneven surfaces?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_THP_11');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_SLF_11',
  'How often do you trip on stairs or uneven pavement compared to other people?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_SLF_11');

-- MOT_ADU_12: Difficulty with fine motor tasks (buttons, tying, threading needle)
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_PC_12',
  'Does this person struggle with fine motor tasks like buttons, tying knots, or threading a needle?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_PC_12');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_TCH_12',
  'Have you observed this person struggling with fine motor tasks required in practical work, such as buttons, knots, or small tools?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_TCH_12');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_THP_12',
  'Does the client demonstrate difficulty with fine motor tasks such as buttoning, tying, or threading?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_THP_12');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_SLF_12',
  'Do you struggle with fine motor tasks like buttons, tying knots, or threading a needle?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_SLF_12');

-- MOT_ADU_13: Fatigue after tasks requiring sustained motor coordination
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_PC_13',
  'How often does this person seem unusually tired or drained after tasks requiring sustained physical coordination?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_PC_13');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_TCH_13',
  'How often does this person seem unusually fatigued after physically demanding tasks compared to peers?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_TCH_13');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_THP_13',
  'How often does the client report disproportionate fatigue following tasks requiring sustained motor coordination?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_THP_13');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_SLF_13',
  'How often do you feel unusually tired or drained after tasks requiring sustained physical coordination?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_SLF_13');

-- MOT_ADU_14: Difficulty navigating crowded public transport without stumbling
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_PC_14',
  'Does this person have difficulty moving through crowded public transport, such as a matatu, danfo, or bus, without stumbling or bumping others?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_PC_14');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_TCH_14',
  'Have you observed this person having difficulty navigating crowded or busy environments without stumbling?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_TCH_14');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_THP_14',
  'Does the client report difficulty navigating crowded transport or public settings without losing balance?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_THP_14');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_SLF_14',
  'Do you have difficulty moving through crowded public transport, such as a matatu, danfo, or bus, without stumbling or bumping into others?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_SLF_14');

-- MOT_ADU_15: Takes longer to master workplace tools/machinery requiring coordination
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_PC_15',
  'Has this person taken noticeably longer than colleagues to master tools or equipment requiring hand-eye coordination?',
  'multiple_choice', '["No", "Somewhat longer", "Yes, much longer"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_PC_15');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_TCH_15',
  'Has this person taken noticeably longer than trainees or peers to master tools or machinery requiring coordination?',
  'multiple_choice', '["No", "Somewhat longer", "Yes, much longer"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_TCH_15');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_THP_15',
  'Does the client report requiring more time than peers to master coordination-dependent tools or equipment?',
  'multiple_choice', '["No", "Somewhat longer", "Yes, much longer"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_THP_15');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_SLF_15',
  'Have you taken noticeably longer than colleagues to master tools or equipment requiring hand-eye coordination?',
  'multiple_choice', '["No", "Somewhat longer", "Yes, much longer"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_SLF_15');

-- MOT_ADU_16: Avoids DIY/manual tasks due to clumsiness
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_PC_16',
  'Does this person avoid manual tasks like cooking, chopping, or fixing things around the house due to clumsiness?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_PC_16');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_TCH_16',
  'Have you noticed this person avoiding hands-on or manual tasks, possibly due to coordination difficulty?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_TCH_16');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_THP_16',
  'Does the client report avoidance of manual or DIY tasks attributed to clumsiness or coordination difficulty?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_THP_16');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_SLF_16',
  'Do you avoid manual tasks like cooking, chopping, or fixing things around the house due to clumsiness?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_SLF_16');

-- MOT_ADU_17: History of childhood clumsiness persisting
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_PC_17',
  'As far as you know, was this person considered clumsy as a child, and does that pattern continue now?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_PC_17');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_TCH_17',
  'Has this person mentioned or shown signs of a lifelong pattern of clumsiness dating back to childhood?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_TCH_17');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_THP_17',
  'Does the client''s history indicate childhood-onset motor coordination difficulty that has persisted into adulthood?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_THP_17');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Dyspraxia/Motor Coordination'), 'MOT_ADU_SLF_17',
  'Were you considered clumsy as a child, and does that pattern continue for you now?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'MOT_ADU_SLF_17');


-- ############################################################################
-- DOMAIN: Sensory Processing
-- ############################################################################

-- ============================================================
-- Sensory Processing — Toddlers (2-5)
-- ============================================================

-- SEN_TOD_01: Distress with clothing textures/tags
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_TOD_PC_01',
  'How often does your child become distressed about clothing textures or tags, such as refusing certain fabrics or new outfits worn to family gatherings?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_TOD_PC_01');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_TOD_TCH_01',
  'How often does the child become distressed about clothing textures or tags while at nursery or playgroup?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_TOD_TCH_01');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_TOD_THP_01',
  'How often does the child present with distress related to clothing texture or tags during observation or caregiver report?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_TOD_THP_01');

-- SEN_TOD_02: Food texture aversions/picky eating
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_TOD_PC_02',
  'Does your child refuse foods based on texture (e.g. certain porridge consistency, lumps, or mixed textures) more than other children their age?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_TOD_PC_02');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_TOD_TCH_02',
  'Does the child refuse foods based on texture during snack or meal time more than other children in the group?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_TOD_TCH_02');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_TOD_THP_02',
  'Does the child demonstrate texture-based food refusal beyond typical toddler pickiness for their age?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_TOD_THP_02');

-- SEN_TOD_03: Distress at loud noises (weight 2 - high signal)
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_TOD_PC_03',
  'How often does your child become distressed by loud noises, such as celebrations, markets, or thunder?',
  'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_TOD_PC_03');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_TOD_TCH_03',
  'How often does the child become distressed by loud noises at nursery, such as group singing, drums, or alarms?',
  'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'teacher', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_TOD_TCH_03');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_TOD_THP_03',
  'How often does the child present with disproportionate distress in response to loud or sudden noise?',
  'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'therapist', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_TOD_THP_03');

-- SEN_TOD_04: Seeking movement (spinning, swinging repeatedly)
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_TOD_PC_04',
  'Does your child seek out spinning, swinging, or rocking far more often and for longer than other children?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_TOD_PC_04');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_TOD_TCH_04',
  'Does the child seek out spinning, swinging, or rocking during playtime far more often than peers?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_TOD_TCH_04');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_TOD_THP_04',
  'Does the child demonstrate excessive movement-seeking behavior, such as spinning or rocking, relative to age norms?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_TOD_THP_04');

-- SEN_TOD_05: Avoiding movement/play equipment (swings, slides)
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_TOD_PC_05',
  'Does your child avoid playground equipment such as swings or slides that other children enjoy?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_TOD_PC_05');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_TOD_TCH_05',
  'Does the child avoid playground equipment such as swings or slides during outdoor play compared to classmates?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_TOD_TCH_05');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_TOD_THP_05',
  'Does the child show avoidance of vestibular play equipment such as swings or slides beyond typical caution?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_TOD_THP_05');

-- SEN_TOD_06: Covering ears in noisy environments
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_TOD_PC_06',
  'How often does your child cover their ears in noisy places, such as a place of worship, wedding, or busy market?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_TOD_PC_06');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_TOD_TCH_06',
  'How often does the child cover their ears during noisy nursery activities, such as group singing or music time?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_TOD_TCH_06');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_TOD_THP_06',
  'How often is the child observed covering their ears or otherwise protecting against auditory input in noisy settings?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_TOD_THP_06');

-- SEN_TOD_07: Reaction to bright lights or sunlight
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_TOD_PC_07',
  'Does your child react strongly to bright lights or strong sunlight, such as squinting, crying, or refusing to go outside?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_TOD_PC_07');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_TOD_TCH_07',
  'Does the child react strongly to bright lights, such as squinting or distress near windows or outdoor play areas?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_TOD_TCH_07');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_TOD_THP_07',
  'Does the child demonstrate a heightened aversive reaction to bright light or sunlight exposure?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_TOD_THP_07');

-- SEN_TOD_08: Distress during haircuts or nail trimming
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_TOD_PC_08',
  'Does your child become very distressed during haircuts or nail trimming compared to other children?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_TOD_PC_08');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_TOD_TCH_08',
  'Has the parent or caregiver reported that the child becomes very distressed during haircuts or nail trimming?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_TOD_TCH_08');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_TOD_THP_08',
  'Does the child present with heightened tactile defensiveness during grooming tasks such as haircuts or nail trimming?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_TOD_THP_08');

-- SEN_TOD_09: Aversion to messy play (sand, mud, food texture on hands)
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_TOD_PC_09',
  'Does your child avoid or become upset by messy play, such as sand, mud, or food on their hands?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_TOD_PC_09');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_TOD_TCH_09',
  'Does the child avoid or become upset by messy play activities, such as sand or paint, during nursery play?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_TOD_TCH_09');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_TOD_THP_09',
  'Does the child demonstrate tactile avoidance of messy play materials such as sand, mud, or textured foods?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_TOD_THP_09');

-- SEN_TOD_10: Seeking touch/pressure (tight hugs, squeezing into small spaces)
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_TOD_PC_10',
  'Does your child seek out very tight hugs or squeeze themselves into small spaces more than other children?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_TOD_PC_10');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_TOD_TCH_10',
  'Does the child seek out tight physical contact or enjoy squeezing into small spaces more than peers at nursery?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_TOD_TCH_10');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_TOD_THP_10',
  'Does the child demonstrate proprioceptive-seeking behavior, such as seeking deep pressure or tight enclosed spaces?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_TOD_THP_10');

-- SEN_TOD_11: Distress with certain smells (cooking, perfumes)
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_TOD_PC_11',
  'Does your child react strongly, such as gagging or covering their nose, to cooking smells or perfumes that do not bother other family members?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_TOD_PC_11');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_TOD_TCH_11',
  'Does the child react strongly to smells in the classroom or kitchen area, such as gagging or covering their nose?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_TOD_TCH_11');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_TOD_THP_11',
  'Does the child demonstrate heightened olfactory sensitivity to common household or food smells?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_TOD_THP_11');

-- SEN_TOD_12: Reaction to crowded/loud family gatherings or religious/community events
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_TOD_PC_12',
  'How often does your child become overwhelmed or have a meltdown at crowded, loud family gatherings or religious and community events?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_TOD_PC_12');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_TOD_TCH_12',
  'How often does the child become overwhelmed during crowded, loud school or community events, such as concerts or celebrations?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_TOD_TCH_12');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_TOD_THP_12',
  'How often does the child show signs of sensory overload in crowded or loud communal settings?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_TOD_THP_12');

-- SEN_TOD_13: Sensitivity to water temperature (bath, washing)
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_TOD_PC_13',
  'Does your child react strongly to bath water or washing temperature, more than would be expected for mild changes?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_TOD_PC_13');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_TOD_TCH_13',
  'Has the parent or caregiver reported that the child reacts strongly to water temperature during washing or bath time?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_TOD_TCH_13');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_TOD_THP_13',
  'Does the child demonstrate disproportionate sensitivity to water temperature during washing or bathing routines?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_TOD_THP_13');

-- SEN_TOD_14: Craving/mouthing non-food objects or excessive chewing
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_TOD_PC_14',
  'Does your child mouth or chew on non-food objects (toys, clothing) more than would be expected for their age?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_TOD_PC_14');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_TOD_TCH_14',
  'Does the child mouth or chew on non-food objects, such as toys or clothing, during nursery activities more than peers?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_TOD_TCH_14');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_TOD_THP_14',
  'Does the child demonstrate oral sensory-seeking behavior, such as mouthing non-food objects, beyond age expectations?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_TOD_THP_14');

-- SEN_TOD_15: Distress with unexpected touch
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_TOD_PC_15',
  'How often does your child react strongly, such as flinching or crying, to unexpected touch, like someone brushing past them?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_TOD_PC_15');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_TOD_TCH_15',
  'How often does the child react strongly to unexpected touch from peers, such as being bumped in line?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_TOD_TCH_15');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_TOD_THP_15',
  'Does the child demonstrate tactile defensiveness in response to unexpected or light touch?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_TOD_THP_15');

-- SEN_TOD_16: Reaction to ground textures - refusing barefoot/resisting shoes
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_TOD_PC_16',
  'Does your child refuse to walk barefoot on grass or sand, or resist wearing shoes, more than other children?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_TOD_PC_16');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_TOD_TCH_16',
  'Does the child refuse to walk barefoot on grass or sand during outdoor play, or resist wearing shoes, more than classmates?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_TOD_TCH_16');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_TOD_THP_16',
  'Does the child demonstrate tactile aversion to ground textures such as grass or sand, or resistance to footwear?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_TOD_THP_16');

-- SEN_TOD_17: Over-/under-reaction to pain or temperature
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_TOD_PC_17',
  'Does your child react much more or much less to minor bumps, heat, or cold than would be expected?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_TOD_PC_17');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_TOD_TCH_17',
  'Does the child react much more or much less to minor bumps or temperature changes during play than classmates?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_TOD_TCH_17');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_TOD_THP_17',
  'Does the child demonstrate atypical pain or temperature responsiveness, either heightened or diminished, relative to norms?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_TOD_THP_17');

-- ============================================================
-- Sensory Processing — Children/Adolescents (6-18)
-- ============================================================

-- SEN_CHI_01: Sensitivity to classroom noise
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_CHI_PC_01',
  'Does your child complain about classroom noise, such as chatter or chairs scraping, more than siblings or peers?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_CHI_PC_01');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_CHI_TCH_01',
  'Does the student complain about or appear distressed by classroom noise, such as chatter or chairs scraping, more than classmates?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_CHI_TCH_01');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_CHI_THP_01',
  'Does the child report or display heightened distress in response to ambient classroom noise?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_CHI_THP_01');

-- SEN_CHI_02: Sensitivity to classroom/overhead lighting
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_CHI_PC_02',
  'Does your child complain about bright or flickering classroom lighting affecting their comfort or focus?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_CHI_PC_02');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_CHI_TCH_02',
  'Does the student complain about or react to bright or flickering overhead lighting in the classroom?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_CHI_TCH_02');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_CHI_THP_02',
  'Does the child report visual discomfort or distraction from bright or fluorescent lighting environments?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_CHI_THP_02');

-- SEN_CHI_03: Avoidance of certain fabrics/school uniform material
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_CHI_PC_03',
  'Does your child complain about the feel of certain fabrics or the school uniform material more than other children?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_CHI_PC_03');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_CHI_TCH_03',
  'Does the student appear uncomfortable or complain about school uniform fabric more than classmates?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_CHI_TCH_03');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_CHI_THP_03',
  'Does the child demonstrate tactile sensitivity to specific fabrics or clothing materials such as uniforms?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_CHI_THP_03');

-- SEN_CHI_04: Avoidance of certain food textures at school/home
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_CHI_PC_04',
  'Does your child refuse a narrow range of foods based on texture more than siblings or peers?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_CHI_PC_04');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_CHI_TCH_04',
  'Does the student refuse a narrow range of foods based on texture during school meal times more than classmates?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_CHI_TCH_04');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_CHI_THP_04',
  'Does the child demonstrate a persistently restricted diet linked to texture sensitivity rather than preference alone?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_CHI_THP_04');

-- SEN_CHI_05: Seeking sensory input - fidgeting, chewing on pens/clothing
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_CHI_PC_05',
  'How often does your child fidget, chew on pens or clothing, or seek extra sensory input to stay settled?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_CHI_PC_05');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_CHI_TCH_05',
  'How often does the student fidget, chew on pens or clothing, or seek extra sensory input during lessons?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_CHI_TCH_05');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_CHI_THP_05',
  'How often does the child engage in sensory-seeking behaviors, such as fidgeting or chewing, to self-regulate?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_CHI_THP_05');

-- SEN_CHI_06: Distress in crowded/loud environments (weight 2 - high signal)
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_CHI_PC_06',
  'How often does your child become distressed or need to leave crowded, loud places such as the market, a place of worship, or school assembly?',
  'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_CHI_PC_06');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_CHI_TCH_06',
  'How often does the student become distressed or ask to leave crowded, loud school events, such as assembly or sports day?',
  'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_CHI_TCH_06');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_CHI_THP_06',
  'How often does the child show signs of sensory overload in crowded, loud environments relative to peers?',
  'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_CHI_THP_06');

-- SEN_CHI_07: Covering ears/eyes in response to sensory input
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_CHI_PC_07',
  'Does your child cover their ears or eyes in response to everyday sensory input more than peers?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_CHI_PC_07');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_CHI_TCH_07',
  'Does the student cover their ears or eyes in class or on the playground more than classmates?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_CHI_TCH_07');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_CHI_THP_07',
  'Does the child demonstrate protective behaviors, such as covering ears or eyes, in response to sensory input?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_CHI_THP_07');

-- SEN_CHI_08: Difficulty with transitions involving sensory change
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_CHI_PC_08',
  'Does your child have difficulty adjusting when moving from a quiet space to a noisy one, or vice versa?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_CHI_PC_08');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_CHI_TCH_08',
  'Does the student have difficulty transitioning from a noisy hallway into a quiet classroom, or vice versa?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_CHI_TCH_08');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_CHI_THP_08',
  'Does the child show difficulty regulating during transitions that involve a significant change in sensory environment?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_CHI_THP_08');

-- SEN_CHI_09: Reaction to unexpected touch from peers (bumping in line)
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_CHI_PC_09',
  'Does your child react strongly to being bumped or touched unexpectedly by siblings or other children?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_CHI_PC_09');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_CHI_TCH_09',
  'Does the student react strongly to being bumped or touched unexpectedly by classmates, such as while lining up?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_CHI_TCH_09');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_CHI_THP_09',
  'Does the child demonstrate a disproportionate reaction to unexpected touch from peers?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_CHI_THP_09');

-- SEN_CHI_10: Seeking movement - rocking, spinning, needing to move to concentrate
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_CHI_PC_10',
  'How often does your child rock, spin, or need to move around to concentrate on tasks such as homework?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_CHI_PC_10');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_CHI_TCH_10',
  'How often does the student rock, spin, or need to move around the classroom to concentrate?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_CHI_TCH_10');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_CHI_THP_10',
  'How often does the child require movement, such as rocking or pacing, to sustain attention or regulate arousal?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_CHI_THP_10');

-- SEN_CHI_11: Sensitivity to smells (cafeteria, cleaning products)
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_CHI_PC_11',
  'Does your child complain about strong smells, such as cooking or cleaning products, more than siblings or peers?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_CHI_PC_11');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_CHI_TCH_11',
  'Does the student complain about strong smells, such as the cafeteria or cleaning products, more than classmates?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_CHI_TCH_11');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_CHI_THP_11',
  'Does the child report heightened sensitivity to environmental smells at school or home?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_CHI_THP_11');

-- SEN_CHI_12: Avoidance of messy activities (art class, food prep)
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_CHI_PC_12',
  'Does your child avoid messy activities, such as art projects or helping with food preparation, more than peers?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_CHI_PC_12');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_CHI_TCH_12',
  'Does the student avoid messy activities, such as art class or hands-on projects, more than classmates?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_CHI_TCH_12');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_CHI_THP_12',
  'Does the child demonstrate avoidance of tactile-heavy activities such as art or food preparation tasks?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_CHI_THP_12');

-- SEN_CHI_13: Complaints of clothing tags/seams/shoes
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_CHI_PC_13',
  'How often does your child complain about clothing tags, seams, or shoes feeling uncomfortable?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_CHI_PC_13');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_CHI_TCH_13',
  'How often does the student complain about or fidget with uniform tags, seams, or shoes during the school day?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_CHI_TCH_13');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_CHI_THP_13',
  'How often does the child report discomfort related to clothing tags, seams, or footwear?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_CHI_THP_13');

-- SEN_CHI_14: Reaction to temperature change (school too hot/cold, uniform discomfort)
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_CHI_PC_14',
  'Does your child complain more than peers about temperature, such as feeling too hot or cold in their school uniform?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_CHI_PC_14');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_CHI_TCH_14',
  'Does the student complain more than classmates about the classroom being too hot or cold?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_CHI_TCH_14');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_CHI_THP_14',
  'Does the child demonstrate heightened sensitivity to ambient temperature relative to peers?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_CHI_THP_14');

-- SEN_CHI_15: Over-/under-reaction to minor injuries compared to peers
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_CHI_PC_15',
  'Does your child react much more or much less than expected to minor falls or bumps compared to peers?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_CHI_PC_15');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_CHI_TCH_15',
  'Does the student react much more or much less than expected to minor injuries during PE or playtime compared to classmates?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_CHI_TCH_15');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_CHI_THP_15',
  'Does the child demonstrate atypical pain responsiveness, either heightened or diminished, to minor injuries?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_CHI_THP_15');

-- SEN_CHI_16: Distress on public transport (crowded matatu/danfo/bus)
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_CHI_PC_16',
  'How often does your child become distressed on crowded public transport, such as a matatu, danfo, or bus, due to noise, motion, or smells?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_CHI_PC_16');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_CHI_TCH_16',
  'Has the parent or caregiver reported that the student becomes distressed on crowded public transport due to noise, motion, or smells?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_CHI_TCH_16');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_CHI_THP_16',
  'Does the child report or display distress related to sensory demands of crowded public transport?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_CHI_THP_16');

-- SEN_CHI_17: Needing quiet space/break during overstimulating events
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_CHI_PC_17',
  'Does your child need a quiet space or break during overstimulating events, such as assemblies or celebrations, more than peers?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_CHI_PC_17');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_CHI_TCH_17',
  'Does the student need a quiet space or break during overstimulating school events, such as assemblies, more than classmates?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_CHI_TCH_17');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_CHI_THP_17',
  'Does the child require a quiet space or sensory break during overstimulating communal events more than would be typical?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_CHI_THP_17');

-- ============================================================
-- Sensory Processing — Adults (18+)
-- ============================================================

-- SEN_ADU_01: Sensitivity to workplace noise
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_PC_01',
  'Does this person complain about workplace or household noise, such as an open office or machinery, more than others?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_PC_01');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_TCH_01',
  'Have you noticed this person struggling with noise in the workplace or training environment, such as an open office or machinery?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_TCH_01');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_THP_01',
  'Does the client report heightened sensitivity to workplace or ambient noise affecting daily functioning?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_THP_01');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_SLF_01',
  'Do you find workplace or household noise, such as an open office or machinery, more bothersome than others seem to?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_SLF_01');

-- SEN_ADU_02: Sensitivity to lighting (fluorescent lights, screens)
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_PC_02',
  'Does this person complain about fluorescent lighting or screen brightness causing discomfort more than others?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_PC_02');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_TCH_02',
  'Have you noticed this person reacting to fluorescent lighting or screen brightness in the work or training environment?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_TCH_02');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_THP_02',
  'Does the client report discomfort or visual fatigue from fluorescent lighting or prolonged screen exposure?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_THP_02');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_SLF_02',
  'Do you find fluorescent lighting or screen brightness causes you noticeable discomfort?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_SLF_02');

-- SEN_ADU_03: Discomfort in crowded public transport/markets
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_PC_03',
  'Does this person avoid or feel overwhelmed by crowded public transport or busy markets more than others?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_PC_03');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_TCH_03',
  'Have you noticed this person avoiding or appearing overwhelmed by crowded, busy environments during activities?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_TCH_03');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_THP_03',
  'Does the client report avoidance or distress related to crowded public transport or marketplace environments?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_THP_03');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_SLF_03',
  'Do you avoid or feel overwhelmed by crowded public transport or busy markets more than most people seem to?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_SLF_03');

-- SEN_ADU_04: Food texture preferences/limited diet persisting into adulthood
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_PC_04',
  'Does this person still keep to a narrow range of food textures or avoid certain foods more than other adults in the family?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_PC_04');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_TCH_04',
  'Have you noticed this person keeping to a narrow range of food textures during shared meals or breaks?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_TCH_04');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_THP_04',
  'Does the client report a persistently restricted diet linked to food texture sensitivity since childhood?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_THP_04');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_SLF_04',
  'Do you still keep to a narrow range of food textures or avoid certain foods more than other adults you know?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_SLF_04');

-- SEN_ADU_05: Need for movement breaks to concentrate/regulate
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_PC_05',
  'How often does this person need to get up and move around to concentrate or feel settled during tasks?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_PC_05');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_TCH_05',
  'How often does this person need to get up and move around during work or training sessions to stay focused?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_TCH_05');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_THP_05',
  'How often does the client report needing movement breaks to concentrate or self-regulate?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_THP_05');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_SLF_05',
  'How often do you need to get up and move around to concentrate or feel settled during tasks?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_SLF_05');

-- SEN_ADU_06: Sensitivity to clothing fabric/tags affecting work attire choices
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_PC_06',
  'Does this person limit their clothing choices due to sensitivity to certain fabrics or tags?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_PC_06');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_TCH_06',
  'Have you noticed this person limiting their work attire choices due to sensitivity to certain fabrics or tags?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_TCH_06');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_THP_06',
  'Does the client report limiting clothing choices due to tactile sensitivity to fabrics or tags?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_THP_06');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_SLF_06',
  'Do you limit your clothing choices because of sensitivity to certain fabrics or tags?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_SLF_06');

-- SEN_ADU_07: Overwhelmed in loud/crowded social gatherings (weight 2 - high signal)
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_PC_07',
  'How often does this person feel overwhelmed at loud, crowded social gatherings, such as weddings or religious events?',
  'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_PC_07');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_TCH_07',
  'How often have you noticed this person becoming overwhelmed at loud, crowded work or community gatherings?',
  'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'teacher', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_TCH_07');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_THP_07',
  'How often does the client report becoming overwhelmed in loud, crowded social gatherings?',
  'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'therapist', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_THP_07');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_SLF_07',
  'How often do you feel overwhelmed at loud, crowded social gatherings, such as weddings or religious events?',
  'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'self', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_SLF_07');

-- SEN_ADU_08: Sensitivity to smells (perfumes, food, cleaning products) at work
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_PC_08',
  'Does this person react strongly to strong smells, such as perfume, food, or cleaning products, more than others?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_PC_08');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_TCH_08',
  'Have you noticed this person reacting strongly to strong smells, such as perfume or cleaning products, in the work environment?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_TCH_08');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_THP_08',
  'Does the client report heightened olfactory sensitivity affecting comfort at work?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_THP_08');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_SLF_08',
  'Do you react strongly to strong smells, such as perfume, food, or cleaning products, more than other people seem to?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_SLF_08');

-- SEN_ADU_09: Need for noise-cancelling tools or quiet space to function
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_PC_09',
  'Does this person rely on earphones, earplugs, or a quiet space to be able to concentrate or feel comfortable?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_PC_09');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_TCH_09',
  'Have you noticed this person relying on earphones, earplugs, or a quiet space to concentrate during work or training?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_TCH_09');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_THP_09',
  'Does the client report reliance on noise-cancelling tools or a quiet space to manage sensory input and function?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_THP_09');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_SLF_09',
  'Do you rely on earphones, earplugs, or a quiet space to be able to concentrate or feel comfortable?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_SLF_09');

-- SEN_ADU_10: Over-/under-reaction to pain/temperature
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_PC_10',
  'Does this person react much more or much less than expected to pain or temperature changes compared to others?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_PC_10');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_TCH_10',
  'Have you noticed this person reacting much more or much less than expected to minor injuries or temperature change?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_TCH_10');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_THP_10',
  'Does the client demonstrate atypical pain or temperature responsiveness, either heightened or diminished?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_THP_10');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_SLF_10',
  'Do you react much more or much less than expected to pain or temperature changes compared to others?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_SLF_10');

-- SEN_ADU_11: Discomfort with unexpected touch/personal space in crowded settings
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_PC_11',
  'Does this person react strongly to unexpected touch or crowded personal space, such as in a busy taxi rank?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_PC_11');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_TCH_11',
  'Have you noticed this person reacting strongly to unexpected touch or crowded personal space during group activities?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_TCH_11');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_THP_11',
  'Does the client report discomfort with unexpected touch or reduced personal space in crowded settings?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_THP_11');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_SLF_11',
  'Do you react strongly to unexpected touch or crowded personal space, such as in a busy taxi rank?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_SLF_11');

-- SEN_ADU_12: Seeking sensory tools (fidgeting, chewing gum, tapping) to focus
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_PC_12',
  'How often does this person fidget, chew gum, or tap to help themselves focus or feel regulated?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_PC_12');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_TCH_12',
  'How often does this person fidget, chew gum, or tap during meetings or training sessions to stay focused?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_TCH_12');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_THP_12',
  'How often does the client engage in sensory-seeking behaviors, such as fidgeting or tapping, to self-regulate?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_THP_12');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_SLF_12',
  'How often do you fidget, chew gum, or tap to help yourself focus or feel regulated?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_SLF_12');

-- SEN_ADU_13: Difficulty concentrating in open-plan or shared workspaces
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_PC_13',
  'Does this person struggle to concentrate in open-plan or shared spaces due to sensory input, such as noise or activity around them?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_PC_13');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_TCH_13',
  'Have you noticed this person struggling to concentrate in an open-plan or shared workspace due to sensory input?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_TCH_13');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_THP_13',
  'Does the client report difficulty concentrating in open-plan or shared workspaces due to sensory demands?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_THP_13');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_SLF_13',
  'Do you struggle to concentrate in open-plan or shared spaces due to sensory input, such as noise or activity around you?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_SLF_13');

-- SEN_ADU_14: Distress/fatigue after sensory-heavy environments
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_PC_14',
  'How often does this person seem drained or need to withdraw after sensory-heavy events, such as market day or a big family gathering?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_PC_14');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_TCH_14',
  'How often does this person seem drained or withdrawn after busy, sensory-heavy work events or training days?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_TCH_14');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_THP_14',
  'How often does the client report fatigue or the need to withdraw following sensory-heavy environments?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_THP_14');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_SLF_14',
  'How often do you feel drained or need to withdraw after sensory-heavy events, such as market day or a big family gathering?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_SLF_14');

-- SEN_ADU_15: Sensitivity to temperature/humidity affecting comfort and function
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_PC_15',
  'Does this person struggle to function comfortably when it is very hot, humid, or a power cut affects cooling or fans?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_PC_15');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_TCH_15',
  'Have you noticed this person struggling to function comfortably in very hot, humid, or poorly ventilated conditions?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_TCH_15');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_THP_15',
  'Does the client report heightened sensitivity to temperature or humidity affecting comfort and function?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_THP_15');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_SLF_15',
  'Do you struggle to function comfortably when it is very hot, humid, or a power cut affects cooling or fans?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_SLF_15');

-- SEN_ADU_16: Avoids certain environments (crowded taxi ranks, busy markets) due to sensory overwhelm
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_PC_16',
  'Does this person actively avoid certain places, such as crowded taxi ranks or busy markets, due to sensory overwhelm?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_PC_16');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_TCH_16',
  'Have you noticed this person avoiding certain busy or crowded environments due to sensory overwhelm?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_TCH_16');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_THP_16',
  'Does the client report actively avoiding certain environments due to anticipated sensory overwhelm?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_THP_16');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_SLF_16',
  'Do you actively avoid certain places, such as crowded taxi ranks or busy markets, due to sensory overwhelm?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_SLF_16');

-- SEN_ADU_17: History of sensory sensitivities since childhood affecting daily life
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_PC_17',
  'As far as you know, has this person had sensory sensitivities since childhood that continue to affect daily life now?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_PC_17');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_TCH_17',
  'Has this person mentioned a lifelong pattern of sensory sensitivities dating back to childhood?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_TCH_17');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_THP_17',
  'Does the client''s history indicate childhood-onset sensory sensitivities that have persisted into adulthood?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_THP_17');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Sensory Processing'), 'SEN_ADU_SLF_17',
  'Have you had sensory sensitivities since childhood that continue to affect your daily life now?',
  'yes_no', '["No", "Yes"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'SEN_ADU_SLF_17');


-- ############################################################################
-- DOMAIN: Executive Function
-- ############################################################################

-- ============================================================
-- Executive Function — Toddlers (2-5)
-- ============================================================

-- EXE_TOD_01: Difficulty with transitions between activities
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_TOD_PC_01',
  'How often does your child struggle to switch from one activity to another, such as from playtime to mealtime?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_TOD_PC_01');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_TOD_TCH_01',
  'How often does the child struggle to switch from one activity to another during the nursery day, such as from free play to circle time?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_TOD_TCH_01');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_TOD_THP_01',
  'How often does the child show difficulty shifting attention or activity during structured transitions?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_TOD_THP_01');

-- EXE_TOD_02: Difficulty following 2-step instructions
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_TOD_PC_02',
  'Does your child have difficulty following simple two-step instructions, such as "pick up your toy and put it in the basket"?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_TOD_PC_02');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_TOD_TCH_02',
  'Does the child have difficulty following simple two-step instructions given during nursery activities?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_TOD_TCH_02');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_TOD_THP_02',
  'Does the child demonstrate difficulty holding and executing a two-step verbal instruction relative to age norms?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_TOD_THP_02');

-- EXE_TOD_03: Difficulty waiting for a turn
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_TOD_PC_03',
  'How often does your child struggle to wait for their turn during games or when sharing with siblings or cousins?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_TOD_PC_03');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_TOD_TCH_03',
  'How often does the child struggle to wait for their turn during group games or activities at nursery?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_TOD_TCH_03');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_TOD_THP_03',
  'How often does the child demonstrate difficulty with impulse control when waiting for a turn during structured play?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_TOD_THP_03');

-- EXE_TOD_04: Meltdowns when routine changes unexpectedly (weight 2 - high signal)
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_TOD_PC_04',
  'How often does your child have a meltdown when the daily routine changes unexpectedly, such as during a power cut or a cancelled outing?',
  'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_TOD_PC_04');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_TOD_TCH_04',
  'How often does the child have a meltdown when the nursery routine changes unexpectedly, such as a substitute caregiver or changed schedule?',
  'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'teacher', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_TOD_TCH_04');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_TOD_THP_04',
  'How often does the child present with significant emotional dysregulation in response to unexpected routine changes?',
  'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Toddlers (2-5)', 'therapist', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_TOD_THP_04');

-- EXE_TOD_05: Difficulty settling for sleep/nap without extended routine
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_TOD_PC_05',
  'Does your child need an unusually long or rigid routine to settle for sleep or nap time?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_TOD_PC_05');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_TOD_TCH_05',
  'Does the child need an unusually long or rigid routine to settle for nap time at nursery compared to peers?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_TOD_TCH_05');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_TOD_THP_05',
  'Does the child require an atypically extended or rigid routine to achieve settling for sleep or rest?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_TOD_THP_05');

-- EXE_TOD_06: Impulsivity - acting without thinking of consequences
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_TOD_PC_06',
  'How often does your child act without thinking, such as running off in a crowded market or grabbing something dangerous?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_TOD_PC_06');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_TOD_TCH_06',
  'How often does the child act without thinking during nursery activities, such as running off or grabbing something unsafe?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_TOD_TCH_06');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_TOD_THP_06',
  'How often does the child demonstrate impulsive behavior without apparent awareness of consequences?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_TOD_THP_06');

-- EXE_TOD_07: Difficulty staying on task for age-appropriate activity
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_TOD_PC_07',
  'Does your child have difficulty staying focused on an age-appropriate activity, such as a simple puzzle or game, until it is finished?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_TOD_PC_07');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_TOD_TCH_07',
  'Does the child have difficulty staying focused on an age-appropriate task or activity during nursery time?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_TOD_TCH_07');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_TOD_THP_07',
  'Does the child demonstrate reduced sustained attention on age-appropriate tasks relative to developmental expectations?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_TOD_THP_07');

-- EXE_TOD_08: Difficulty calming down after being upset
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_TOD_PC_08',
  'How often does your child take a long time to calm down after becoming upset, compared to other children their age?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_TOD_PC_08');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_TOD_TCH_08',
  'How often does the child take a long time to calm down after becoming upset compared to classmates?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_TOD_TCH_08');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_TOD_THP_08',
  'How often does the child require extended time or support to return to a calm state after emotional escalation?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_TOD_THP_08');

-- EXE_TOD_09: Resistance to being told "no" or having an activity stopped
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_TOD_PC_09',
  'Does your child react with unusually intense distress when told "no" or when an enjoyable activity is stopped?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_TOD_PC_09');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_TOD_TCH_09',
  'Does the child react with unusually intense distress when told "no" or when an activity is stopped at nursery?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_TOD_TCH_09');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_TOD_THP_09',
  'Does the child demonstrate disproportionate distress reactions to limit-setting or activity cessation?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_TOD_THP_09');

-- EXE_TOD_10: Difficulty adapting to new environments/people
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_TOD_PC_10',
  'Does your child have difficulty adjusting to new environments or people, such as visiting relatives or attending a new gathering?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_TOD_PC_10');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_TOD_TCH_10',
  'Does the child have difficulty adjusting to a new environment or unfamiliar adults, such as a substitute teacher or new classmate?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_TOD_TCH_10');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_TOD_THP_10',
  'Does the child demonstrate difficulty adapting cognitively and behaviorally to novel environments or unfamiliar people?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_TOD_THP_10');

-- EXE_TOD_11: Trouble remembering simple recent instructions
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_TOD_PC_11',
  'How often does your child forget a simple instruction you gave just moments earlier?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_TOD_PC_11');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_TOD_TCH_11',
  'How often does the child forget a simple instruction given just moments earlier during nursery activities?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_TOD_TCH_11');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_TOD_THP_11',
  'How often does the child show reduced short-term working memory for recently given simple instructions?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_TOD_THP_11');

-- EXE_TOD_12: Difficulty sharing or taking turns with siblings/other children
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_TOD_PC_12',
  'Does your child have difficulty sharing toys or taking turns with siblings or other children more than peers their age?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_TOD_PC_12');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_TOD_TCH_12',
  'Does the child have difficulty sharing toys or taking turns with other children during nursery play more than peers?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_TOD_TCH_12');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_TOD_THP_12',
  'Does the child demonstrate difficulty with turn-taking and sharing beyond what is typical for their developmental stage?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_TOD_THP_12');

-- EXE_TOD_13: Excessive difficulty separating from caregiver in new settings
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_TOD_PC_13',
  'Does your child have excessive difficulty separating from you in new settings, beyond typical toddler separation worries?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_TOD_PC_13');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_TOD_TCH_13',
  'Does the child have excessive difficulty separating from a caregiver at drop-off compared to classmates?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_TOD_TCH_13');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_TOD_THP_13',
  'Does the child present with separation difficulty exceeding what would be developmentally expected in new settings?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_TOD_THP_13');

-- EXE_TOD_14: Struggles to sit through short communal activities
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_TOD_PC_14',
  'How often does your child struggle to sit through a short communal activity, such as a family meal or brief place of worship visit?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_TOD_PC_14');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_TOD_TCH_14',
  'How often does the child struggle to sit through short group activities, such as story time or singing circle, at nursery?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_TOD_TCH_14');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_TOD_THP_14',
  'How often does the child show difficulty sustaining seated attention during brief structured communal activities?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_TOD_THP_14');

-- EXE_TOD_15: Emotional outbursts disproportionate to situation
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_TOD_PC_15',
  'Does your child have emotional outbursts that seem disproportionate to the situation compared to other children their age?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_TOD_PC_15');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_TOD_TCH_15',
  'Does the child have emotional outbursts at nursery that seem disproportionate to the situation compared to classmates?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_TOD_TCH_15');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_TOD_THP_15',
  'Does the child demonstrate emotional reactions disproportionate to the triggering event relative to developmental norms?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_TOD_THP_15');

-- EXE_TOD_16: Difficulty following simple household routines
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_TOD_PC_16',
  'Does your child have difficulty following simple household routines, such as washing hands before eating, even with reminders?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_TOD_PC_16');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_TOD_TCH_16',
  'Does the child have difficulty following simple classroom routines, such as washing hands before snack, even with reminders?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_TOD_TCH_16');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_TOD_THP_16',
  'Does the child demonstrate difficulty internalizing and independently following simple routine sequences?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_TOD_THP_16');

-- EXE_TOD_17: Trouble adjusting when plans change
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_TOD_PC_17',
  'How often does your child struggle to adjust when a planned outing or activity is changed or cancelled?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Toddlers (2-5)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_TOD_PC_17');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_TOD_TCH_17',
  'How often does the child struggle to adjust when a planned nursery activity is changed or cancelled?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Toddlers (2-5)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_TOD_TCH_17');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_TOD_THP_17',
  'How often does the child show cognitive inflexibility when previously communicated plans are changed unexpectedly?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Toddlers (2-5)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_TOD_THP_17');

-- ============================================================
-- Executive Function — Children/Adolescents (6-18)
-- ============================================================

-- EXE_CHI_01: Organizing schoolwork/belongings
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_CHI_PC_01',
  'How often does your child lose or forget schoolbooks, uniform items, or supplies compared to siblings or peers?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_CHI_PC_01');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_CHI_TCH_01',
  'How often does the student lose or forget schoolbooks, uniform items, or supplies compared to classmates?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_CHI_TCH_01');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_CHI_THP_01',
  'How often does the child demonstrate difficulty organizing and keeping track of schoolwork and belongings?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_CHI_THP_01');

-- EXE_CHI_02: Planning multi-step homework/projects
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_CHI_PC_02',
  'Does your child have difficulty planning out multi-step homework assignments or projects on their own?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_CHI_PC_02');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_CHI_TCH_02',
  'Does the student have difficulty planning out multi-step assignments or projects independently?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_CHI_TCH_02');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_CHI_THP_02',
  'Does the child demonstrate difficulty with planning and sequencing multi-step academic tasks independently?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_CHI_THP_02');

-- EXE_CHI_03: Emotional regulation during frustration (weight 2 - high signal)
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_CHI_PC_03',
  'How often does your child struggle to manage frustration when homework or games become difficult?',
  'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_CHI_PC_03');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_CHI_TCH_03',
  'How often does the student struggle to manage frustration when classwork becomes difficult?',
  'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_CHI_TCH_03');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_CHI_THP_03',
  'How often does the child demonstrate difficulty regulating emotional responses to frustration or challenge?',
  'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_CHI_THP_03');

-- EXE_CHI_04: Adapting to changes in routine/schedule
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_CHI_PC_04',
  'Does your child struggle to adapt when there is a change to routine, such as a rescheduled event or unexpected visitors?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_CHI_PC_04');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_CHI_TCH_04',
  'Does the student struggle to adapt to schedule changes, such as a substitute teacher or altered timetable?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_CHI_TCH_04');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_CHI_THP_04',
  'Does the child demonstrate cognitive inflexibility when routines or schedules are altered unexpectedly?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_CHI_THP_04');

-- EXE_CHI_05: Difficulty starting tasks without prompting (procrastination)
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_CHI_PC_05',
  'How often does your child need repeated reminders to start homework or chores rather than beginning on their own?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_CHI_PC_05');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_CHI_TCH_05',
  'How often does the student need repeated prompting to start classwork rather than beginning independently?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_CHI_TCH_05');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_CHI_THP_05',
  'How often does the child demonstrate task-initiation difficulty requiring external prompting?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_CHI_THP_05');

-- EXE_CHI_06: Difficulty managing time for homework/chores
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_CHI_PC_06',
  'Does your child have difficulty managing their time to finish homework or chores before a deadline?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_CHI_PC_06');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_CHI_TCH_06',
  'Does the student have difficulty managing their time to complete assignments before the deadline?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_CHI_TCH_06');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_CHI_THP_06',
  'Does the child demonstrate difficulty with time management for completing tasks within a deadline?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_CHI_THP_06');

-- EXE_CHI_07: Forgetting instructions given by teacher/parent
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_CHI_PC_07',
  'How often does your child forget instructions you gave shortly beforehand, such as chores or errands?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_CHI_PC_07');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_CHI_TCH_07',
  'How often does the student forget instructions given moments earlier in class?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_CHI_TCH_07');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_CHI_THP_07',
  'How often does the child demonstrate working-memory difficulty retaining recently given verbal instructions?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_CHI_THP_07');

-- EXE_CHI_08: Difficulty prioritizing tasks (what to do first)
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_CHI_PC_08',
  'Does your child have difficulty deciding what to do first when given several tasks or homework subjects at once?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_CHI_PC_08');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_CHI_TCH_08',
  'Does the student have difficulty deciding what to do first when given several tasks or subjects at once?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_CHI_TCH_08');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_CHI_THP_08',
  'Does the child demonstrate difficulty prioritizing among multiple competing tasks?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_CHI_THP_08');

-- EXE_CHI_09: Impulsivity - blurting out, acting without thinking
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_CHI_PC_09',
  'How often does your child blurt out comments or act without thinking about the consequences first?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_CHI_PC_09');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_CHI_TCH_09',
  'How often does the student blurt out answers or comments in class without waiting to be called on?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_CHI_TCH_09');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_CHI_THP_09',
  'How often does the child demonstrate impulsive verbal or behavioral responses without forethought?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_CHI_THP_09');

-- EXE_CHI_10: Difficulty with multi-step chores
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_CHI_PC_10',
  'Does your child have difficulty completing multi-step household chores, such as helping prepare a meal, without step-by-step guidance?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_CHI_PC_10');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_CHI_TCH_10',
  'Does the student have difficulty completing multi-step classroom or group tasks without step-by-step guidance?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_CHI_TCH_10');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_CHI_THP_10',
  'Does the child demonstrate difficulty independently sequencing and completing multi-step practical tasks?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_CHI_THP_10');

-- EXE_CHI_11: Losing track of belongings (uniform, shoes, school supplies)
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_CHI_PC_11',
  'How often does your child lose track of personal belongings, such as uniform items, shoes, or school supplies?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_CHI_PC_11');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_CHI_TCH_11',
  'How often does the student lose track of personal belongings, such as uniform items or school supplies, at school?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_CHI_TCH_11');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_CHI_THP_11',
  'How often does the child demonstrate difficulty keeping track of personal belongings?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_CHI_THP_11');

-- EXE_CHI_12: Difficulty following multi-step instructions during group activities/games
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_CHI_PC_12',
  'Does your child have difficulty following multi-step instructions during group games or family activities?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_CHI_PC_12');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_CHI_TCH_12',
  'Does the student have difficulty following multi-step instructions during group activities or games at school?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_CHI_TCH_12');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_CHI_THP_12',
  'Does the child demonstrate difficulty processing and executing multi-step instructions in group settings?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_CHI_THP_12');

-- EXE_CHI_13: Trouble shifting from one subject/activity to another
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_CHI_PC_13',
  'How often does your child have trouble shifting from one homework subject or activity to the next?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_CHI_PC_13');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_CHI_TCH_13',
  'How often does the student have trouble shifting from one subject or classroom activity to the next?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_CHI_TCH_13');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_CHI_THP_13',
  'How often does the child demonstrate cognitive shifting difficulty when moving between subjects or activities?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_CHI_THP_13');

-- EXE_CHI_14: Managing frustration during power cuts/disruptions to routine
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_CHI_PC_14',
  'Does your child struggle to manage frustration when routine disruptions happen, such as a power cut interrupting homework?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_CHI_PC_14');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_CHI_TCH_14',
  'Does the student struggle to manage frustration when unexpected disruptions occur, such as an interrupted lesson?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_CHI_TCH_14');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_CHI_THP_14',
  'Does the child demonstrate difficulty regulating frustration in response to unexpected disruptions to routine?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_CHI_THP_14');

-- EXE_CHI_15: Difficulty completing chores without reminders
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_CHI_PC_15',
  'How often does your child need reminders to complete assigned chores, such as fetching water or tidying their room?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_CHI_PC_15');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_CHI_TCH_15',
  'How often does the student need reminders to complete assigned classroom responsibilities or duties?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_CHI_TCH_15');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_CHI_THP_15',
  'How often does the child require external reminders to complete assigned responsibilities independently?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_CHI_THP_15');

-- EXE_CHI_16: Poor planning ahead for events
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_CHI_PC_16',
  'Does your child have difficulty planning ahead for events, such as packing a bag for a school trip or preparing for an exam?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_CHI_PC_16');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_CHI_TCH_16',
  'Does the student have difficulty planning ahead for school events, such as a trip or upcoming exam?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_CHI_TCH_16');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_CHI_THP_16',
  'Does the child demonstrate difficulty with forward planning for upcoming events or responsibilities?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_CHI_THP_16');

-- EXE_CHI_17: Difficulty regulating behavior/emotions in group/community settings
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_CHI_PC_17',
  'How often does your child struggle to regulate their behavior or emotions during extended family visits or community gatherings?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Children/Adolescents (6-18)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_CHI_PC_17');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_CHI_TCH_17',
  'How often does the student struggle to regulate behavior or emotions during group or community school events?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Children/Adolescents (6-18)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_CHI_TCH_17');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_CHI_THP_17',
  'How often does the child demonstrate difficulty self-regulating behavior or emotions in group or communal settings?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Children/Adolescents (6-18)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_CHI_THP_17');

-- ============================================================
-- Executive Function — Adults (18+)
-- ============================================================

-- EXE_ADU_01: Time management and meeting deadlines
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_PC_01',
  'Does this person have difficulty managing their time to meet work, family, or financial deadlines?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_PC_01');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_TCH_01',
  'As this person''s instructor or supervisor, have you noticed them having difficulty managing time to meet deadlines?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_TCH_01');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_THP_01',
  'Does the client report significant difficulty managing time to meet deadlines across work or personal responsibilities?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_THP_01');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_SLF_01',
  'Do you have difficulty managing your time to meet work, family, or financial deadlines?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_SLF_01');

-- EXE_ADU_02: Organizing tasks/finances/household responsibilities
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_PC_02',
  'Does this person struggle to organize household tasks, finances, or responsibilities without help?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_PC_02');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_TCH_02',
  'Have you noticed this person struggling to organize tasks or responsibilities in work or training settings?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_TCH_02');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_THP_02',
  'Does the client report difficulty organizing tasks, finances, or household responsibilities without support?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_THP_02');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_SLF_02',
  'Do you struggle to organize household tasks, finances, or responsibilities without help?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_SLF_02');

-- EXE_ADU_03: Emotional regulation under stress (weight 2 - high signal)
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_PC_03',
  'How often does this person struggle to regulate their emotions when under stress?',
  'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_PC_03');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_TCH_03',
  'How often have you noticed this person struggling to regulate their emotions under stress during work or training?',
  'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'teacher', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_TCH_03');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_THP_03',
  'How often does the client report or demonstrate difficulty regulating emotions in response to stress?',
  'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'therapist', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_THP_03');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_SLF_03',
  'How often do you struggle to regulate your emotions when under stress?',
  'likert', '["Never", "Rarely", "Sometimes", "Often", "Always"]'::jsonb, 'Adults (18+)', 'self', 2, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_SLF_03');

-- EXE_ADU_04: Adapting plans when circumstances change unexpectedly
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_PC_04',
  'Does this person struggle to adapt plans when circumstances change unexpectedly, such as a transport delay or power cut?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_PC_04');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_TCH_04',
  'Have you noticed this person struggling to adapt plans when circumstances change unexpectedly at work or training?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_TCH_04');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_THP_04',
  'Does the client demonstrate cognitive inflexibility when plans change unexpectedly due to external circumstances?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_THP_04');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_SLF_04',
  'Do you struggle to adapt your plans when circumstances change unexpectedly, such as a transport delay or power cut?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_SLF_04');

-- EXE_ADU_05: Procrastination on important tasks
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_PC_05',
  'How often does this person delay starting important tasks until the last minute?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_PC_05');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_TCH_05',
  'How often does this person delay starting important tasks or assignments until the last minute?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_TCH_05');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_THP_05',
  'How often does the client report procrastinating on important tasks until close to the deadline?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_THP_05');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_SLF_05',
  'How often do you delay starting important tasks until the last minute?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_SLF_05');

-- EXE_ADU_06: Difficulty prioritizing competing responsibilities
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_PC_06',
  'Does this person struggle to prioritize competing responsibilities, such as work, family, and community obligations?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_PC_06');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_TCH_06',
  'Have you noticed this person struggling to prioritize competing responsibilities during work or training?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_TCH_06');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_THP_06',
  'Does the client report difficulty prioritizing among competing responsibilities across life domains?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_THP_06');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_SLF_06',
  'Do you struggle to prioritize competing responsibilities, such as work, family, and community obligations?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_SLF_06');

-- EXE_ADU_07: Forgetting appointments/commitments without reminders
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_PC_07',
  'How often does this person forget appointments or commitments without reminders from others?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_PC_07');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_TCH_07',
  'How often does this person forget scheduled sessions or commitments without reminders?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_TCH_07');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_THP_07',
  'How often does the client report forgetting appointments or commitments without external reminders?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_THP_07');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_SLF_07',
  'How often do you forget appointments or commitments without reminders from others?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_SLF_07');

-- EXE_ADU_08: Difficulty breaking large tasks into manageable steps
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_PC_08',
  'Does this person have difficulty breaking large tasks, such as planning a family event, into manageable steps?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_PC_08');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_TCH_08',
  'Have you noticed this person having difficulty breaking large projects into manageable steps?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_TCH_08');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_THP_08',
  'Does the client demonstrate difficulty decomposing large tasks into manageable, sequenced steps?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_THP_08');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_SLF_08',
  'Do you have difficulty breaking large tasks, such as planning a family event, into manageable steps?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_SLF_08');

-- EXE_ADU_09: Losing track of items (keys, phone, documents)
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_PC_09',
  'How often does this person lose track of everyday items, such as keys, a phone, or important documents?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_PC_09');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_TCH_09',
  'How often does this person lose track of everyday items, such as keys, a phone, or documents, at work or training?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_TCH_09');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_THP_09',
  'How often does the client report losing track of everyday items such as keys, phone, or documents?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_THP_09');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_SLF_09',
  'How often do you lose track of everyday items, such as your keys, phone, or important documents?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_SLF_09');

-- EXE_ADU_10: Difficulty maintaining organized living/work space
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_PC_10',
  'Does this person struggle to keep their living or work space organized compared to others in the household?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_PC_10');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_TCH_10',
  'Have you noticed this person struggling to keep their workspace organized compared to colleagues or peers?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_TCH_10');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_THP_10',
  'Does the client report ongoing difficulty maintaining organization of living or work spaces?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_THP_10');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_SLF_10',
  'Do you struggle to keep your living or work space organized compared to others around you?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_SLF_10');

-- EXE_ADU_11: Impulsive decisions (financial, social) without considering consequences
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_PC_11',
  'How often does this person make impulsive financial or social decisions without considering the consequences?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_PC_11');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_TCH_11',
  'How often have you noticed this person making impulsive decisions without considering the consequences?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_TCH_11');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_THP_11',
  'How often does the client report making impulsive financial or social decisions without weighing consequences?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_THP_11');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_SLF_11',
  'How often do you make impulsive financial or social decisions without considering the consequences?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_SLF_11');

-- EXE_ADU_12: Difficulty switching between tasks/responsibilities smoothly
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_PC_12',
  'Does this person have difficulty switching smoothly between different tasks or responsibilities during the day?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_PC_12');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_TCH_12',
  'Have you noticed this person having difficulty switching smoothly between different tasks during work or training?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_TCH_12');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_THP_12',
  'Does the client demonstrate cognitive shifting difficulty when switching between tasks or responsibilities?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_THP_12');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_SLF_12',
  'Do you have difficulty switching smoothly between different tasks or responsibilities during the day?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_SLF_12');

-- EXE_ADU_13: Trouble managing household budget or bills
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_PC_13',
  'Does this person have trouble managing the household budget or paying bills on time?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_PC_13');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_TCH_13',
  'Have you noticed this person having trouble managing budgets, resources, or timely payments in a work context?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_TCH_13');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_THP_13',
  'Does the client report difficulty managing budgets or timely bill payments due to executive function challenges?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_THP_13');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_SLF_13',
  'Do you have trouble managing your household budget or paying bills on time?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_SLF_13');

-- EXE_ADU_14: Difficulty regulating frustration during unexpected disruptions
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_PC_14',
  'How often does this person struggle to regulate frustration during unexpected disruptions, such as long queues, delays, or load-shedding?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_PC_14');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_TCH_14',
  'How often have you noticed this person struggling to regulate frustration during unexpected delays or disruptions?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_TCH_14');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_THP_14',
  'How often does the client report difficulty regulating frustration in response to unexpected disruptions or delays?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_THP_14');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_SLF_14',
  'How often do you struggle to regulate your frustration during unexpected disruptions, such as long queues, delays, or load-shedding?',
  'likert', '["Never", "Rarely", "Sometimes", "Often"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_SLF_14');

-- EXE_ADU_15: Overwhelmed by multi-step processes (paperwork, planning family events)
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_PC_15',
  'Does this person become overwhelmed by multi-step processes, such as official paperwork or planning a family event?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_PC_15');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_TCH_15',
  'Have you noticed this person becoming overwhelmed by multi-step administrative or planning processes?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_TCH_15');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_THP_15',
  'Does the client report becoming overwhelmed by multi-step administrative or planning tasks?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_THP_15');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_SLF_15',
  'Do you become overwhelmed by multi-step processes, such as official paperwork or planning a family event?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_SLF_15');

-- EXE_ADU_16: Difficulty sustaining follow-through on long-term goals/plans
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_PC_16',
  'Does this person have difficulty sustaining follow-through on long-term goals or plans they set for themselves?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_PC_16');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_TCH_16',
  'Have you noticed this person having difficulty following through on long-term goals or projects?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_TCH_16');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_THP_16',
  'Does the client report ongoing difficulty sustaining follow-through on self-set long-term goals?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_THP_16');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_SLF_16',
  'Do you have difficulty sustaining follow-through on long-term goals or plans you set for yourself?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_SLF_16');

-- EXE_ADU_17: Managing responsibilities across extended family/community obligations without becoming overwhelmed
INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_PC_17',
  'Does this person become overwhelmed trying to manage responsibilities across extended family and community obligations?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'parent_caregiver', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_PC_17');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_TCH_17',
  'Have you noticed this person becoming overwhelmed juggling work responsibilities alongside family or community obligations?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'teacher', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_TCH_17');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_THP_17',
  'Does the client report becoming overwhelmed managing responsibilities across extended family and community obligations?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'therapist', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_THP_17');

INSERT INTO public.questions (domain_id, question_id, question_text, question_type, options, age_group, respondent_type, score_weight, is_follow_up)
SELECT (SELECT id FROM public.assessment_domains WHERE name = 'Executive Function'), 'EXE_ADU_SLF_17',
  'Do you become overwhelmed trying to manage responsibilities across extended family and community obligations?',
  'multiple_choice', '["No", "Sometimes", "Yes"]'::jsonb, 'Adults (18+)', 'self', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE question_id = 'EXE_ADU_SLF_17');

