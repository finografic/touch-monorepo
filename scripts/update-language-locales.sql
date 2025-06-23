-- Step 1: Update existing data to use locale format
UPDATE supported_languages
SET iso_code = 'es-ES'
WHERE iso_code = 'es';

UPDATE supported_languages
SET iso_code = 'en-GB'
WHERE iso_code = 'en';

UPDATE supported_languages
SET iso_code = 'ca-ES'
WHERE iso_code = 'ca';

-- Verify the changes
SELECT id, iso_code, native_name, display_name, flag_code, is_active, is_default, sort_order
FROM supported_languages
ORDER BY sort_order;
