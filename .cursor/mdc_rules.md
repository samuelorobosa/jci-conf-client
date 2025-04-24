# React Development Guidelines (Vite + TypeScript)

## General Principles

### Code Organization

- Use English for all code and documentation
- Follow Vite's project structure
- Implement clean architecture principles
- Maintain clear separation of concerns
- Keep files focused and single-purpose
- One export per file (preferably default exports)
- Use absolute imports with `@/*` path alias (configured in vite.config.ts)

### TypeScript Guidelines

- Always declare types for variables, functions, and components
- Avoid using `any` type
- Create necessary interfaces and types in `src/types`
- Use strict TypeScript configuration
- Leverage TypeScript's type inference when appropriate
- Use generics for reusable components and functions
- Use enums for constant values
- Keep type definitions close to their usage

### Naming Conventions

- Use PascalCase for components and interfaces
- Use camelCase for variables, functions, and methods
- Use kebab-case for file and directory names
- Use UPPERCASE for environment variables
- Use descriptive names that reflect purpose
- Prefix boolean variables with verbs (isLoading, hasError, canDelete)
- Use complete words instead of abbreviations
- Standard abbreviations allowed: API, URL, etc.
- Common abbreviations allowed:
  - i, j for loops
  - err for errors
  - ctx for contexts
  - req, res for API requests/responses

## Vite Project Structure

```
src/
  ├── components/          # Reusable components
  │   ├── shared/         # Shared UI components
  │   ├── features/       # Feature-specific components
  │   └── layouts/        # Layout components
  ├── types/              # TypeScript type definitions
  ├── hooks/              # Custom hooks
  ├── utils/              # Utility functions
  ├── services/           # API and external services
  ├── store/              # State management
  ├── assets/             # Static assets
  ├── styles/             # Global styles
  ├── pages/              # Page components
  └── App.tsx             # Root component
```

### Component Structure

```typescript
// imports
import { FC } from 'react';
import { type } from '@/types';

// types
interface ComponentProps {
  // props
}

// component
const Component: FC<ComponentProps> = ({ prop1, prop2 }) => {
  // implementation
};

// export
export default Component;
```

### State Management

- Use React Query for server state
- Use Zustand for global client state
- Use local state for component-specific state
- Implement proper state initialization
- Use proper state update patterns
- Avoid prop drilling
- Implement proper loading and error states

### Performance Optimization

- Use React.memo for expensive renders
- Implement proper dependency arrays in hooks
- Use useCallback for function props
- Use useMemo for expensive computations
- Implement proper code splitting
- Use dynamic imports for lazy loading
- Optimize images using proper techniques
- Implement proper caching strategies

### Hooks Guidelines

- Create custom hooks for reusable logic
- Follow hooks naming convention (useX)
- Keep hooks focused and single-purpose
- Implement proper cleanup in useEffect
- Use proper dependency arrays
- Avoid hooks in loops or conditions
- Implement proper error handling

### Styling Guidelines

- Use Tailwind CSS for styling
- Follow mobile-first approach
- Implement proper responsive design
- Use CSS modules for component-specific styles
- Implement proper theme support
- Use CSS variables for dynamic values
- Follow BEM naming convention when needed
- Use consistent color variables

### Testing Guidelines

- Write unit tests for components
- Write integration tests for features
- Use Vitest and React Testing Library
- Follow Arrange-Act-Assert pattern
- Implement proper test coverage
- Use proper test doubles
- Write meaningful test descriptions
- Test edge cases and error states

### Code Quality

- Implement proper error boundaries
- Use proper logging
- Implement proper loading states
- Use proper error handling
- Implement proper accessibility
- Follow React best practices
- Use proper TypeScript features
- Implement proper documentation

### Environment Configuration

- Use `.env` for local development
- Use `.env.production` for production
- Provide `.env.example` with required variables
- Use proper environment variable naming
- Keep sensitive data out of version control
- Document required environment variables

### Security

- Implement proper authentication
- Use proper authorization
- Implement proper input validation
- Use proper error handling
- Implement proper security headers
- Use proper security best practices
- Implement proper data encryption
- Use route guards for protected routes

### Accessibility

- Use proper ARIA attributes
- Implement proper keyboard navigation
- Use proper color contrast
- Implement proper screen reader support
- Use proper semantic HTML
- Implement proper focus management
- Use proper accessibility testing

### Internationalization

- Use proper translation files
- Implement proper RTL support
- Use proper date formatting
- Implement proper number formatting
- Use proper currency formatting
- Implement proper language switching
- Use proper translation management

### Documentation

- Use proper JSDoc comments
- Implement proper README files
- Use proper API documentation
- Implement proper component documentation
- Use proper code comments
- Implement proper changelog
- Use proper documentation tools

### Vite-Specific Guidelines

- Use Vite's built-in features for development
- Configure proper build optimizations
- Use proper plugin configurations
- Implement proper asset handling
- Use proper environment variable handling
- Configure proper proxy settings
- Use proper development server settings
- Implement proper build output configuration

### Dependency Management

- Use `npm install` for installing dependencies
- When encountering dependency conflicts:
  - Prefer using `npm install --force` over `--legacy-peer-deps`
  - Document any forced installations in the project's README
  - Keep track of dependency versions in package.json
  - Regularly update dependencies to maintain security
  - Test thoroughly after dependency updates
  - Use exact versions for critical dependencies
  - Document any known dependency issues and their solutions
