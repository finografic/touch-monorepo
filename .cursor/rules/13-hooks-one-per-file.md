# Hooks File Structure

- Define **exactly one hook per file**.
- Name the file after the hook (e.g., `useFoo.ts` exports `useFoo`).
- Do not colocate multiple hooks in the same file.
- Local helper utilities are allowed inside the hook file if they are used exclusively by that hook (e.g., a fetcher or formatter).

