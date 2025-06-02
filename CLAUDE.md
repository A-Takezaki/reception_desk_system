# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a TypeScript React application for a reception desk system. The project is currently in its initial state with minimal setup.

## TypeScript Configuration

- Target: ES5 with DOM and ESNext libraries
- JSX: React JSX transform (modern)
- Strict mode enabled
- Source files expected in `src/` directory

## Development Rules

**IMPORTANT**: Always follow the rules defined in `rules/rules.md`:

1. **TDD**: Generate unit tests for all code, ensure `npm test` passes
2. **Comments**: Add JSDoc specification comments at the top of each file
3. **Testing**: Use vitest with `import.meta.vitest` pattern in same file as implementation
4. **Domain Models**: Centralize in `src/types.ts` with JSDoc usage descriptions
5. **Implementation**: Functional domain modeling, prefer functions over classes, use algebraic data types
6. **Structure**: Follow monorepo layout with `script/`, `packages/<mod-name>/src/`, etc.

## Development Setup

Development commands:

- `npm install` - Install dependencies
- `npm run dev` - Start development server (Vite)
- `npm run build` - Build for production (TypeScript + Vite)
- `npm test` - Run unit tests (vitest)
- `npm run test:e2e` - Run E2E tests (Playwright)

## Testing Workflow

**IMPORTANT**: After any code changes, ALWAYS run these commands in order to ensure all tests pass:

1. `npm test -- --run` - Run unit tests
2. `npx tsc --noEmit` - TypeScript type checking  
3. `npm run build` - Verify build succeeds
4. `npm run test:e2e` - Run E2E tests

All tests must pass before considering any code change complete.