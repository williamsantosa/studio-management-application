-- Drop the function if it already exists to avoid errors during re-creation
DROP FUNCTION IF EXISTS add_class(VARCHAR, TEXT, TEXT, TIME, TIME);

-- Create the stored function to add a new class
CREATE OR REPLACE FUNCTION add_class(
    p_name VARCHAR(100),        -- Input: Class name (required)
    p_description TEXT,         -- Input: Class description (optional, can be NULL)
    p_schedule TEXT,            -- Input: Class schedule (optional, can be NULL)
    p_start_time TIME,          -- Input: Class start time (required)
    p_end_time TIME             -- Input: Class end time (required)
)
RETURNS UUID -- Return the UUID of the newly created class
LANGUAGE plpgsql -- Specify the language as PL/pgSQL
AS $$
DECLARE
    new_class_id UUID; -- Variable to store the generated UUID
BEGIN
    -- Insert the new class record into the 'classes' table
    -- The 'id', 'created_at', and 'updated_at' columns will use their default values
    INSERT INTO classes (
        name,
        description,
        schedule,
        start_time,
        end_time
    )
    VALUES (
        p_name,
        p_description,
        p_schedule,
        p_start_time,
        p_end_time
    )
    RETURNING id INTO new_class_id; -- Capture the generated UUID into the variable

    -- Return the UUID of the newly inserted row
    RETURN new_class_id;
END;
$$;

-- Example Usage: How to call the function
-- SELECT add_class(
--     'Introduction to PostgreSQL',
--     'A beginner-friendly course covering SQL basics and PostgreSQL features.',
--     'Tue/Thu',
--     '18:00:00',
--     '19:30:00'
-- );

-- Example Usage storing the returned ID in a variable (e.g., in psql or application code)
-- DO $$
-- DECLARE
--   inserted_id UUID;
-- BEGIN
--   inserted_id := add_class(
--       'Advanced Yoga Flow',
--       'Challenging Vinyasa sequences for experienced practitioners.',
--       'Saturday',
--       '09:00:00',
--       '10:30:00'
--   );
--   RAISE NOTICE 'New class added with ID: %', inserted_id;
-- END $$;

-- Verify the insertion (optional)
-- SELECT * FROM classes WHERE name = 'Introduction to PostgreSQL';
-- SELECT * FROM classes WHERE name = 'Advanced Yoga Flow';