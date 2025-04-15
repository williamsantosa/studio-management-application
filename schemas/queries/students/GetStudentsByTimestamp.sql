-- Drop it first if it exists
DROP FUNCTION IF EXISTS get_students_by_timestamp(TIMESTAMP, TIMESTAMP);

-- Create the function
CREATE OR REPLACE FUNCTION get_students_by_timestamp(
    p_start_time TIMESTAMP,
    p_end_time TIMESTAMP
) RETURNS TABLE (
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
    WHERE created_at BETWEEN p_start_time AND p_end_time;
$$;
