# Coding Standards & Best Practices

This document outlines the coding standards, conventions, and best practices to follow for the development of this Expo application.

## Core Principles

*   **Expertise:** Assume expert-level knowledge of TypeScript, React Native, Expo, and Mobile UI development.
*   **Clarity & Conciseness:** Write clean, readable, and maintainable code.
*   **Performance:** Prioritize performance and user experience.
*   **Expo Managed Workflow:** Leverage the benefits of the Expo managed workflow.
*   **Cross-Platform:** Ensure compatibility and consistent experience on both iOS and Android.

## Code Style and Structure

*   **Language:** Use TypeScript exclusively.
*   **Programming Paradigm:** Employ functional and declarative programming patterns. Avoid class components.
*   **Modularity:** Prefer iteration and modularization. Avoid code duplication (DRY principle).
*   **Variable Naming:** Use descriptive variable names. Use auxiliary verbs for boolean flags (e.g., `isLoading`, `hasError`, `canSubmit`).
*   **File Structure:** Organize files logically:
    1.  Imports
    2.  Exported Component Definition
    3.  Sub-components (if any, keep small or extract)
    4.  Helper Functions (related specifically to the component)
    5.  Static Content/Constants (if component-specific)
    6.  Type/Interface Definitions (if component-specific)
    7.  Styles (if using StyleSheet or similar)
*   **Directory Naming:** Use `lowercase-with-dashes` for directory names (e.g., `components/auth-wizard`, `screens/user-profile`).
*   **Exports:** Favor named exports for components and modules. Avoid default exports where possible for better refactoring and discoverability.
*   **Formatting:** Use Prettier for automated, consistent code formatting. Configure it in `package.json` or `.prettierrc.js`.

## TypeScript Usage

*   **Strict Mode:** Enable `strict` mode in `tsconfig.json` for maximum type safety.
*   **Types vs. Interfaces:** Prefer `interface` over `type` for defining object shapes and contracts, as interfaces are more easily extendable. Use `type` for unions, intersections, or primitives.
*   **Enums:** Avoid TypeScript `enum`s. Use object literals with `as const` or simple string/number literal unions instead for better tree-shaking and JavaScript interoperability.
    ```typescript
    // Preferred
    const STATUS = {
      PENDING: 'pending',
      COMPLETED: 'completed',
      FAILED: 'failed',
    } as const;
    type Status = typeof STATUS[keyof typeof STATUS];

    // Avoid
    // enum Status { PENDING, COMPLETED, FAILED }
    ```
*   **Component Props:** Define props using interfaces for functional components.
    ```typescript
    interface MyComponentProps {
      title: string;
      isVisible: boolean;
    }

    function MyComponent({ title, isVisible }: MyComponentProps): JSX.Element { ... }
    ```

## Syntax and Formatting

*   **Function Keyword:** Use the `function` keyword for defining named, pure functions for clarity and potentially better hoisting behavior understanding.
    ```typescript
    // Preferred for standalone functions
    function calculateTotal(price: number, quantity: number): number {
      return price * quantity;
    }

    // Arrow functions are fine for callbacks, inline functions, etc.
    const handlePress = () => { ... };
    ```
*   **Conciseness:** Avoid unnecessary curly braces in conditionals or loops for single statements. Use concise syntax.
    ```typescript
    // Preferred
    if (isValid) return true;

    // Avoid
    // if (isValid) {
    //   return true;
    // }
    ```
*   **JSX:** Write declarative and readable JSX. Keep components small and focused.

## UI and Styling

*   **Core Components:** Utilize Expo's and React Native's built-in components (`View`, `Text`, `Pressable`, `ScrollView`, `FlatList`, etc.) for standard UI patterns.
*   **Styling:**
    *   Use a consistent styling approach: `styled-components` or Tailwind CSS (e.g., `nativewind`) are recommended for maintainable and scalable styling.
    *   Avoid inline styles for anything beyond trivial cases.
*   **Layout:** Use Flexbox for responsive layouts. Leverage `gap` property where appropriate.
*   **Responsiveness:** Use `useWindowDimensions` from `react-native` for adapting layouts to different screen sizes when necessary.
*   **Dark Mode:** Implement dark mode support using `useColorScheme` from `react-native` (or `expo-appearance`) and provide theme-aware styles.
*   **Accessibility (a11y):** Prioritize accessibility.
    *   Use `accessibilityLabel`, `accessibilityRole`, `accessibilityState`, etc.
    *   Ensure sufficient color contrast.
    *   Test with screen readers.
*   **Animations & Gestures:** Use `react-native-reanimated` and `react-native-gesture-handler` for smooth and performant animations and interactions.

## Safe Area Management

*   **Provider:** Wrap the entire application root with `SafeAreaProvider` from `react-native-safe-area-context`.
*   **Views:** Use `SafeAreaView` as the top-level container for screens to automatically handle insets.
*   **Scrollables:** Use `SafeAreaScrollView` (or apply safe area insets manually to `FlatList`, etc.) for scrollable content.
*   **Avoid Hardcoding:** Do not hardcode padding/margin values to mimic safe areas. Rely on the context provider and components.

## Performance Optimization

*   **State Management:** Minimize unnecessary `useState` calls. Lift state up appropriately or use Context/Reducers/State Management Libraries for shared state.
*   **Startup:** Use `expo-splash-screen` to provide a seamless loading experience.
*   **Images:** Optimize images:
    *   Use `expo-image` for caching, placeholders, and modern format support (WebP).
    *   Specify image dimensions (`width`, `height`).
    *   Consider lazy loading for images in long lists.
*   **Code Splitting:** Use dynamic `import()` with `React.Suspense` for lazy-loading non-critical components or screens.
*   **Memoization:** Use `React.memo`, `useMemo`, and `useCallback` judiciously to prevent unnecessary re-renders, especially in lists or computationally expensive components. Profile before optimizing prematurely.
*   **Profiling:** Use Flipper, React DevTools Profiler, and Expo's performance monitoring tools to identify bottlenecks.

## Navigation

*   **Library:** Use `expo-router` for file-system based routing, which builds upon `react-navigation`.
*   **Best Practices:** Follow `react-navigation` best practices for structuring navigators (Stack, Tabs, Drawer).
*   **Deep Linking:** Configure deep linking and universal links for seamless navigation into the app.
*   **Dynamic Routes:** Leverage `expo-router`'s dynamic route capabilities.

## State Management

*   **Local State:** Use `useState` for simple component-level state.
*   **Shared State:** Use `React Context` with `useReducer` for managing related state across components.
*   **Server State/Caching:** Use `TanStack Query` (`react-query`) for data fetching, caching, synchronization, and background updates. This significantly reduces complexity around server state.
*   **Complex Global State:** For very complex global state scenarios, consider `Zustand` (preferred for simplicity) or `Redux Toolkit`.
*   **URL State:** Use `expo-router`'s built-in capabilities for handling URL search parameters.

## Error Handling and Validation

*   **Validation:** Use `Zod` for robust runtime data validation (API responses, forms).
*   **Error Handling Logic:**
    *   Handle potential errors early in functions (e.g., check inputs).
    *   Use early returns (guard clauses) to avoid deeply nested `if` statements.
    *   Avoid unnecessary `else` blocks after a `return`.
*   **Error Boundaries:** Implement React Error Boundaries at appropriate levels to catch rendering errors and display fallback UI.
*   **Reporting:** Integrate `Sentry` (via `sentry-expo`) for comprehensive error tracking and reporting in production.

## Testing

*   **Unit Tests:** Use `Jest` with `React Native Testing Library` for testing individual components and functions.
*   **Integration Tests:** Use `React Native Testing Library` for testing interactions between components.
*   **End-to-End (E2E) Tests:** Use `Detox` for testing critical user flows across the entire application.
*   **Snapshots:** Use Jest snapshot testing sparingly, primarily for stable UI components where visual regression is a concern.

## Security

*   **Input Sanitization:** Always sanitize or validate user-generated content before displaying it to prevent XSS.
*   **Secure Storage:** Use `expo-secure-store` for storing sensitive data like tokens or credentials.
*   **API Communication:** Use HTTPS exclusively. Implement proper authentication (e.g., JWT, session tokens) and authorization.
*   **Expo Security Guidelines:** Adhere to Expo's security recommendations: [https://docs.expo.dev/guides/security/](https://docs.expo.dev/guides/security/)

## Internationalization (i18n)

*   **Library:** Use `i18next` with `react-i18next` or `expo-localization` for managing translations.
*   **Implementation:** Structure translations logically. Support Right-to-Left (RTL) layouts if required.
*   **Accessibility:** Ensure text scales correctly and fonts support necessary characters.

## Key Expo Conventions & Tools

*   **Managed Workflow:** Stick to the managed workflow unless absolutely necessary.
*   **Mobile Web Vitals:** Be mindful of performance, especially Load Time, Interaction to Next Paint (INP), and Cumulative Layout Shift (CLS) if targeting web.
*   **Configuration:** Use `app.json`/`app.config.js` for static configuration. Use `expo-constants` for accessing runtime configuration and environment variables.
*   **Permissions:** Use `expo-permissions` API (or specific module permissions like `expo-camera`, `expo-location`) to request device permissions gracefully.
*   **Updates:** Implement Over-the-Air (OTA) updates using `expo-updates`.
*   **Distribution:** Follow Expo Application Services (EAS) best practices for building and submitting the app: [https://docs.expo.dev/distribution/introduction/](https://docs.expo.dev/distribution/introduction/)

## References

*   **Expo Documentation:** [https://docs.expo.dev/](https://docs.expo.dev/)
*   **React Native Documentation:** [https://reactnative.dev/docs/getting-started](https://reactnative.dev/docs/getting-started)
*   **TypeScript Documentation:** [https://www.typescriptlang.org/docs/](https://www.typescriptlang.org/docs/)
