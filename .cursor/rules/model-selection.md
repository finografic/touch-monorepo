# Model Selection Preferences (Global Project Rule)

## Accuracy Requirements

This project requires extremely high accuracy for:
- TypeScript type inference and generics
- React (concurrent features, RHF, controlled/uncontrolled patterns)
- Schema and validation tooling (Zod)
- ORM correctness (Drizzle, SQLite)
- Server frameworks with compile-time contracts (Hono)

Because correctness and architectural reasoning are essential, the assistant **must use a model with strong multi-step reasoning**, highly reliable framework knowledge, and stable long-context performance.

## Disallowed Model Characteristics

Avoid using models that:
- hallucinate React Hook Form APIs
- misunderstand Hono routing or Drizzle schemas
- generate generic TODO lists instead of actual solutions
- output incomplete code or incorrect JSX
- rely on outdated React patterns
- mis-handle TypeScript discriminated unions or advanced generics

These problems correlate strongly with lightweight or “coding-only” models (e.g., GitHub Copilot models, minimal reasoning models, or small open-source models).
Therefore, the assistant **must not** select such models.

## Required Model Characteristics

Prefer models that:
- demonstrate consistent deep reasoning
- understand TypeScript at a senior level
- understand monorepo architecture
- produce correct, idiomatic RHF usage
- maintain architectural coherence across files

Strongly prefer models such as:
- **Claude 3.5 Sonnet / Claude 3.5 Opus**
- **GPT-4.1 / GPT-4o / GPT-5 series**

These models must be selected whenever the task involves:
- any React Hook Form work
- state management
- schema validation
- multi-file changes
- solving bugs
- planning architecture
- generating non-trivial TypeScript

## Constraint on Auto Routing

When using AUTO model selection, the assistant must avoid routing to:
- GitHub Copilot / Workspace models
- Claude 3.5 Haiku
- lightweight “coding-only” models
- open-source 7B–70B models

These may be used only for trivial, mechanical tasks such as:
- formatting
- renaming variables
- commenting
- summarizing

## Principle

When in doubt, choose a **high-reasoning model**.
Consistency, correctness, and deep framework knowledge override cost or latency.
