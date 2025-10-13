# General Development Rules

## Code Quality & Standards

- Always use TypeScript with strict mode enabled
- Prefer type-safe code over any types
- Use consistent naming conventions (camelCase for variables, PascalCase for components/types)
- Add JSDoc comments for complex functions and public APIs
- Prefer explicit return types for functions
- Use meaningful variable and function names that describe their purpose
- For both JSDoc and simple comments, include name and version of model used to generate, between square-brackets [Model vX.X]
- Follow TypeScript parameter patterns from `07-typescript-patterns.md`
- Follow testing patterns from `08-testing-patterns.md`
- Follow provider/context patterns from `09-provider-context-patterns.md`

## Error Handling

- Always handle errors explicitly, never ignore them
- Use proper error types and avoid generic Error objects when possible
- Add error boundaries for React components where appropriate
- Log errors with sufficient context for debugging

## Performance

- Avoid unnecessary re-renders in React components
- Use proper dependency arrays in useEffect and useMemo
- Prefer CSS Grid/Flexbox over complex positioning
- Optimize bundle size by avoiding unnecessary imports
- Use dynamic imports for code splitting when appropriate

## Accessibility

- Always include proper ARIA labels and attributes
- Ensure keyboard navigation works for all interactive elements
- Use semantic HTML elements
- Maintain proper color contrast ratios
- Add alt text for images

## Security

- Never expose sensitive data in client-side code
- Sanitize user inputs
- Use environment variables for configuration
- Validate data at API boundaries

## Markdown Formatting

### Headings

- Use headings (`##`, `###`, etc.) WITHOUT additional bold formatting (`**`)
- Headings are already bold by default
- Wrap code elements in headings with backticks for proper styling
- Examples:
  - `## Section Title` not `## **Section Title**`
  - `## 1. tsup.config.ts ✅` not `## 1. **tsup.config.ts** ✅`
  - `### For vite.config.ts` not `### For **vite.config.ts**`

### Code Formatting

- Always add line breaks above and below code blocks for clear separation
- Wrap filenames, paths, method names, variables in backticks for inline code formatting
- Examples:
  - Filenames: `vite.config.ts`, `package.json`
  - Paths: `src/components/Button.tsx`, `@workspace/i18n/generators`
  - Methods: `generateTypes()`, `useState()`
  - Variables: `workspaceRoot`, `baseColor`

### Code Block Spacing

```typescript
// ✅ Correct - line breaks above and below
const example = 'proper spacing';
```

- Use consistent spacing for better readability
