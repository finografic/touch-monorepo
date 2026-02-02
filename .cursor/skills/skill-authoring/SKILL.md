---
name: skill-authoring
description: How to create and structure Cursor Skills. Use when adding new skills, organizing skill folders, or writing SKILL.md files. Covers YAML frontmatter, progressive disclosure, and best practices.
---

# Creating Cursor Skills

## Skill Structure

Every skill lives in its own folder under `.cursor/skills/`:

```
.cursor/skills/
└── your-skill-name/
    ├── SKILL.md          # Required: main entry point
    ├── REFERENCE.md      # Optional: detailed docs
    └── scripts/          # Optional: executable code
        └── helper.py
```

---

## SKILL.md Template

```yaml
---
name: your-skill-name
description: Brief description of what this Skill does and when to use it. Include trigger phrases.
---

# Your Skill Name

## Quick Start
[Most common usage pattern]

## Instructions
[Step-by-step guidance]

## Examples
[Concrete code examples]
```

---

## YAML Frontmatter Requirements

### Required Fields

| Field | Requirements |
|-------|--------------|
| `name` | Max 64 chars, lowercase letters/numbers/hyphens only |
| `description` | Max 1024 chars, non-empty |

### Naming Rules

- ✅ `pdf-processing`, `code-review`, `api-design`
- ❌ `PDF_Processing`, `my skill`, `claude-helper`
- ❌ Cannot contain: "anthropic", "claude", XML tags

### Description Best Practices

Include **what** it does AND **when** to use it:

```yaml
# ❌ Too vague
description: Helps with comments

# ✅ Clear trigger
description: Guidelines for code comments and inline documentation. Use when writing or reviewing comments, JSDoc, or inline notes.
```

---

## Progressive Disclosure Model

Skills load content in stages to conserve context:

| Level | When Loaded | Token Cost | Content |
|-------|-------------|------------|---------|
| **Level 1** | Always (startup) | ~100 tokens | YAML `name` and `description` only |
| **Level 2** | When triggered | < 5k tokens | SKILL.md body |
| **Level 3** | As needed | Unlimited | Referenced files, scripts |

### Implications

- Keep SKILL.md concise (< 5k tokens)
- Put detailed reference in separate files
- Use scripts for deterministic operations

---

## Adding Files to a Skill

### Reference Documentation

```markdown
# In SKILL.md
For advanced usage, see [REFERENCE.md](REFERENCE.md).
```

### Executable Scripts

```markdown
# In SKILL.md
Run the validation script:
\`\`\`bash
bash .cursor/skills/your-skill/scripts/validate.sh
\`\`\`
```

Scripts execute via bash without loading into context — use for deterministic operations.

---

## Checklist: New Skill

- [ ] Create folder: `.cursor/skills/skill-name/`
- [ ] Create `SKILL.md` with YAML frontmatter
- [ ] `name`: lowercase, hyphens, max 64 chars
- [ ] `description`: clear trigger phrases, max 1024 chars
- [ ] Body: Quick start, instructions, examples
- [ ] Keep under 5k tokens
- [ ] Add reference files only if needed

---

## Security Notes

Skills from untrusted sources can be dangerous:

- **Audit all files** — SKILL.md, scripts, resources
- **Watch for external fetches** — URLs can contain malicious instructions
- **Tool misuse risk** — Skills can invoke bash, file ops, code execution
- **Treat like installing software** — only use trusted sources
