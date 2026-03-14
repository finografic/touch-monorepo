# Documentation Rules

## Date Tags

- Add a date tag on line 3: `📅 Dec 15, 2025`.
- Keep a blank line after the tag.
- Update for significant changes; skip minor edits.

## When to Document

- Large refactors, complex systems, major features, explicit user requests, architectural decisions.

## Structure

1. H1 title
2. Date tag on line 3
3. Blank line
4. Organized sections (H2/H3)
5. Clear, concise content with examples when helpful

## Markdown Tables

- Use padded pipe style — one space on each side of every `|`, including the header separator row.
- Align column widths so all cells in the same column are padded to equal width.
- dprint (markdown plugin) enforces this on save.

**Correct:**

```markdown
| Component | Recipe type | Notes            |
| --------- | ----------- | ---------------- |
| `badge`   | `cva`       | `<span>` wrapper |
```

**Incorrect:**

```markdown
| Component | Recipe type | Notes |
|---|---|---|
| `badge` | `cva` | `<span>` wrapper |
```

## Comments vs Docs

- Use JSDoc for inline code.
- Use markdown for architecture/refactors/system docs.
