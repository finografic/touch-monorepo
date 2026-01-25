# Translation Setup Guide

📅 Jun 28, 2025

## Current Status

The auto-translation system now uses a **fallback hierarchy** for maximum reliability:

### Translation Priority Order

1. **📚 Simple Mappings** (Instant, Most Reliable)
   - Pre-defined translations for common terms
   - Covers: Beer, Wine, Water, Juice, Glass, Plastic, etc.
   - Languages: French, German, Spanish, Italian

2. **☁️ Google Cloud Translate** (Official API, Requires Key)
   - Reliable, paid service with proper rate limits
   - Requires `GOOGLE_TRANSLATE_API_KEY` environment variable
   - **Recommended for production**

3. **🌐 Unofficial Google Translate** (Backup, Unreliable)
   - Free but heavily rate-limited
   - Often blocked by Google
   - Used as last resort

4. **🔄 Fallback Text** (Always Works)
   - Format: `"Original Text [language-code]"`
   - Example: `"Beer [fr-FR]"`

## Setup Google Cloud Translate (Recommended)

### Step 1: Get API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Cloud Translation API**
4. Go to **APIs & Services** → **Credentials**
5. Click **Create Credentials** → **API Key**
6. Copy the generated API key

### Step 2: Configure Environment

Add to your `.env` file:

```bash
GOOGLE_TRANSLATE_API_KEY="your-api-key-here"
```

### Step 3: Test

Add a new language and check the logs:

```bash
📚 Simple translation: "Beer" → "Bière" (fr)
☁️ Google Cloud: "Craft Beer" → "Bière artisanale" (fr)
```

## Current Simple Mappings

The system includes pre-defined translations for:

### Drink Types

- Beer → Bière/Bier/Cerveza/Birra
- Wine → Vin/Wein/Vino/Vino
- Water → Eau/Wasser/Agua/Acqua

### Container Types

- Glass → Verre/Glas/Vidrio/Vetro
- Plastic → Plastique/Kunststoff/Plástico/Plastica
- Metal → Métal/Metall/Metal/Metallo

### Wine Types

- Red → Rouge/Rot/Tinto/Rosso
- White → Blanc/Weiß/Blanco/Bianco
- Rosé → Rosé/Rosé/Rosado/Rosato

## Troubleshooting

### All Translations Show Fallback Format

**Problem:** Getting `"Beer [fr-FR]"` instead of `"Bière"`

**Solutions:**
1. Check if simple mappings exist for your terms
2. Add `GOOGLE_TRANSLATE_API_KEY` to environment
3. Verify API key is valid and has Translation API enabled
4. Check server logs for specific error messages

### Rate Limiting Issues

**Problem:** "Too Many Requests" errors

**Solutions:**
1. Use Google Cloud Translate (official API)
2. Simple mappings are used first (no API calls)
3. System automatically handles rate limits with backoff

## Adding More Simple Mappings

Edit `apps/server/src/utils/auto-translate.utils.ts`:

```typescript
const simpleTranslations = {
  fr: {
    'Your Term': 'Votre Terme',
    // ... add more
  },
  // ... other languages
};
```

## Cost Considerations

- **Simple Mappings**: Free, instant
- **Google Cloud Translate**: ~$20 per 1M characters
- **Unofficial API**: Free but unreliable

For most use cases, simple mappings + Google Cloud API provide the best balance of cost and reliability.
