-- =======================================================
-- MIGRATION: Add Default Assignments for Existing Tasks
-- Run this in Supabase SQL Editor to make existing tasks visible
-- =======================================================

-- Create assignments for all existing tasks, assigned to all kids, on all dates (daily recurring)
-- This maintains the original behavior where tasks showed for everyone every day

INSERT INTO public.task_assignments (task_id, kid_id, assigned_date)
SELECT id, NULL, NULL
FROM public.tasks
WHERE id NOT IN (SELECT task_id FROM public.task_assignments);
