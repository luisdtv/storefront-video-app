# Development Plan

This document outlines the phased development plan for the Storefront Video Platform.

## Phase 1: Foundation & Cleanup (Completed)

### Objective
Establish a clean, modern project structure and remove boilerplate code.

### Steps Taken
1.  **Project Initialization:** Standard Expo project setup.
2.  **Cleanup:** Removed unused example files and components (`app/(tabs)`, default components, hooks, constants).
3.  **Documentation Setup:** Initialized `idea.md`, `plan.md`, and `coding-standards.md`.

## Phase 2: Core Structure & Navigation (Completed)

### Objective
Implement the fundamental directory structure, navigation system, and basic reusable components.

### Steps Taken
1.  **Directory Reorganization:**
    *   Created route groups: `app/(auth)` and `app/(main)`.
    *   Set up `_layout.tsx` files for root, auth, and main navigation using `expo-router`'s `Stack`.
2.  **Core Component Creation:**
    *   `app/components/Button.tsx`
    *   `app/components/Input.tsx`
    *   `app/components/Layout.tsx`
3.  **Service Layer Setup:**
    *   `app/services/authService.ts` (with mock functions initially).
4.  **Context Setup:**
    *   `app/contexts/AuthContext.tsx` for session management.
5.  **Data Model Placeholders:**
    *   `app/models/model.ts` (with basic `User` interface).

## Phase 3: Authentication Flow (Completed)

### Objective
Build the user login and registration functionality.

### Steps Taken
1.  **Screen Implementation:**
    *   `app/(auth)/login.tsx`: Login form UI, state management (`useState`), `handleLogin` function.
    *   `app/(auth)/register.tsx`: Registration form UI, state management, `handleRegister` function.
2.  **Navigation:** Implemented navigation between login and register screens using `expo-router`.
3.  **Service Integration (Supabase):**
    *   Connected `handleLogin` and `handleRegister` to  functions in `authService.ts`.
4.  **Context Integration:**
    *   Updated `AuthContext` to hold user state and loading status.
    *   Connected `login.tsx` and `register.tsx` to update `AuthContext` (`setUser`) upon successful authentication.
    *   Configured root `_layout.tsx` to redirect based on `AuthContext`'s user state.
5. **Handle User Data:**
    * Updated `authService.ts`: updated the register and login function to return the user data.
    * Updated `AuthContext.tsx`: Updated the AuthContext to store the user data.

## Phase 4: Backend Integration (Supabase)

### Objective
Replace mock authentication with real backend integration using Supabase.

### Planned Steps
1.  **Supabase Setup:** Configure Supabase project (Database, Auth).
2.  **Environment Variables:** Set up `expo-constants` or `.env` for Supabase URL and keys.
3.  **Supabase Client:** Initialize Supabase client.
4.  **Update `authService.ts`:**
    *   Implement `login` using Supabase `signInWithPassword`.
    *   Implement `register` using Supabase `signUp`.
    *   Implement `logout`.
    *   Implement Google Sign-In (as per `README.md`).
5.  **Update `AuthContext.tsx`:**
    *   Handle session persistence (listen to Supabase auth state changes).
    *   Implement logout functionality.
6.  **Error Handling:** Add robust error handling for authentication calls.

## Phase 5: Core Business Logic & UI

### Objective
Implement business profiles and video upload functionality.

### Planned Steps
1.  **Data Models:** Define Supabase tables and corresponding TypeScript interfaces for `Business` and `Video`.
2.  **Business Profile Screen:**
    *   Create screen(s) for viewing and editing business profiles.
    *   Implement form using reusable components.
    *   Create `businessService.ts` for Supabase interactions (CRUD operations).
3.  **Video Upload Screen:**
    *   Implement UI for selecting/recording video.
    *   Integrate `expo-image-picker` or `expo-camera`.
    *   Integrate Cloudinary SDK for video uploads.
    *   Create `videoService.ts` for managing video metadata in Supabase and interacting with Cloudinary.
4.  **UI Enhancements:** Improve styling using `styled-components` or Tailwind.

## Phase 6: Video Playback & Discovery

### Objective
Allow users to browse and watch videos.

### Planned Steps
1.  **Video Feed Screen:** Create the main screen (`app/(main)/index.tsx` or similar) to display a feed of videos.
2.  **Video Player:** Integrate `expo-av` for video playback.
3.  **Data Fetching:** Use `react-query` (or similar) in `videoService.ts` to fetch video data from Supabase.
4.  **Search/Filter UI:** Implement UI elements for searching and filtering videos (by category, location - requires adding these fields).
5.  **Search/Filter Logic:** Update `videoService.ts` to handle search/filter queries.

## Phase 7: Additional Features

### Objective
Implement remaining features from the `README.md`.

### Planned Steps
1.  **Comments & Ratings:** Add functionality for users to comment on and rate videos.
2.  **Notifications:** Implement push notifications (using `expo-notifications`) for relevant events.
3.  **Monetization:** Explore and implement video promotion and/or premium subscription features.
4.  **Basic Video Editing:** Investigate and potentially integrate basic client-side video editing features.

## Phase 8: Testing & Deployment

### Objective
Ensure application quality and prepare for release.

### Planned Steps
1.  **Unit/Integration Tests:** Write tests using Jest/React Native Testing Library.
2.  **End-to-End Tests:** Consider Detox for E2E testing.
3.  **Performance Optimization:** Profile and optimize critical parts of the app.
4.  **Accessibility (a11y):** Audit and improve accessibility.
5.  **Deployment:** Configure build profiles and deploy using EAS Build/Submit.
6.  **OTA Updates:** Set up `expo-updates`.
