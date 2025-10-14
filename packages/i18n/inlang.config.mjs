import { missingTranslation } from '@inlang/lint-rule-missing-translation';

export default {
  referenceLanguage: 'en',
  languages: ['en', 'es'],
  lint: [missingTranslation()],
};
