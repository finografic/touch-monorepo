# General Development Rules

## Code Quality & Standards

- Always use TypeScript with strict mode enabled
- Prefer type-safe code over any types
- Use consistent naming conventions (camelCase for variables, PascalCase for components/types)
- Add JSDoc comments for complex functions and public APIs
- Prefer explicit return types for functions
- Use meaningful variable and function names that describe their purpose

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
