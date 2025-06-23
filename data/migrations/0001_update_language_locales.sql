-- Migration: Update language codes to proper locale format
-- Convert simple language codes to full locale identifiers

UPDATE supported_languages
SET iso_code = 'es-ES'
WHERE iso_code = 'es';

UPDATE supported_languages
SET iso_code = 'en-GB'
WHERE iso_code = 'en';

UPDATE supported_languages
SET iso_code = 'ca-ES'
WHERE iso_code = 'ca';
