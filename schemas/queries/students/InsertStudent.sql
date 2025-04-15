-- Drop it first if it exists
DROP FUNCTION IF EXISTS insert_student(
    p_first_name       VARCHAR,
    p_last_name        VARCHAR,
    p_email            VARCHAR,
    p_phone_number     VARCHAR,
    p_date_of_birth    DATE,
    p_address          TEXT DEFAULT NULL,
    p_gender           VARCHAR DEFAULT NULL,
    p_enrollment_date  DATE DEFAULT CURRENT_DATE,
    p_status           VARCHAR DEFAULT 'active',
    p_notes            TEXT DEFAULT NULL
);

-- Create the function
CREATE OR REPLACE FUNCTION insert_student(
    p_first_name       VARCHAR,
    p_last_name        VARCHAR,
    p_email            VARCHAR,
    p_phone_number     VARCHAR,
    p_date_of_birth    DATE,
    p_address          TEXT DEFAULT NULL,
    p_gender           VARCHAR DEFAULT NULL,
    p_enrollment_date  DATE DEFAULT CURRENT_DATE,
    p_status           VARCHAR DEFAULT 'active',
    p_notes            TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
    new_id UUID;
BEGIN
    INSERT INTO students (
        first_name, last_name, email, phone_number,
        date_of_birth, address, gender, enrollment_date,
        status, notes
    ) VALUES (
        p_first_name, p_last_name, p_email, p_phone_number,
        p_date_of_birth, p_address, p_gender, p_enrollment_date,
        p_status, p_notes
    )
    RETURNING id INTO new_id;

    RETURN new_id;
END;
$$;
