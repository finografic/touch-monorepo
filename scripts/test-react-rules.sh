#!/bin/bash

# Create the test content
TEST_CONTENT='// @ts-nocheck
import React from '\''react'\'';

// This component intentionally violates React-specific rules:
// - react-hooks/rules-of-hooks (conditional hook)
// - react-hooks/exhaustive-deps (missing deps array)
// - react-dom/no-unknown-property (wrong DOM property)
// - react/prop-types (missing prop types)
// - react-hooks/rules-of-hooks (useState outside component)
export default function TestComponent(props) {
  // Rule violation: Conditional hook
  if (props.someCondition) {
    const [state, setState] = React.useState(null);
  }

  // Rule violation: Missing dependencies array
  React.useEffect(() => {
    console.log(props.value);
  });

  // Rule violation: Wrong DOM property name (should be onClick)
  return (
    <div onclick={() => console.log('\''clicked'\'')}>
      Test
    </div>
  );
};

// Rule violation: Hook outside component
const [globalState, setGlobalState] = React.useState(null);'

# Run ESLint on the content directly with detailed output
echo "Testing React-specific ESLint rules..."
echo "$TEST_CONTENT" | eslint --config apps/client/eslint.config.mjs --format json --stdin --stdin-filename test.tsx
