-- Drop it first if it exists
DROP FUNCTION IF EXISTS get_student_by_id(UUID);

-- Create the function
CREATE OR REPLACE FUNCTION get_student_by_id(p_id UUID)
RETURNS TABLE (
    id UUID,
    first_name VARCHAR,
    last_name VARCHAR,
    email VARCHAR,
    phone_number VARCHAR,
    address TEXT,
    date_of_birth DATE,
    gender VARCHAR,
    enrollment_date DATE,
    status VARCHAR,
    notes TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)
LANGUAGE sql
AS $$
    SELECT *
    FROM students
    WHERE id = p_id;
$$;
