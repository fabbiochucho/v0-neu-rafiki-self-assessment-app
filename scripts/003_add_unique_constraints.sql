-- Add unique constraint to assessment_responses table
-- This ensures one response per question per assessment
ALTER TABLE public.assessment_responses 
ADD CONSTRAINT assessment_responses_assessment_question_unique 
UNIQUE (assessment_id, question_id);

-- Add unique constraint to assessment_results table  
-- This ensures one result per domain per assessment
ALTER TABLE public.assessment_results 
ADD CONSTRAINT assessment_results_assessment_domain_unique 
UNIQUE (assessment_id, domain_name);
