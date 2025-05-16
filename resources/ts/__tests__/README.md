# Frontend Tests

This directory contains tests for the Eye Center frontend application.

## Test Structure

Tests are organized to mirror the structure of the source code:

- `components/` - Tests for React components
- `pages/` - Tests for page components
- `schemas/` - Tests for Zod validation schemas
- `stores/` - Tests for Zustand state stores
- `utils/` - Tests for utility functions

## Running Tests

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage report
yarn test:coverage
```

## Test Setup

Tests use the following libraries:

- Jest - Test runner
- React Testing Library - For testing React components
- Jest DOM - For DOM testing assertions

## Writing Tests

When writing new tests:

1. Create test files with the `.test.tsx` or `.test.ts` extension
2. Place them in the appropriate directory matching the source structure
3. Import the component or function you want to test
4. Write test cases using Jest's `describe` and `test` functions
5. Use React Testing Library's render and query functions for component tests

## Mocking

For components that use external dependencies:

- Use Jest's mock functions to mock API calls
- Create mock implementations for context providers
- Use the mock files in the `mocks/` directory for file imports