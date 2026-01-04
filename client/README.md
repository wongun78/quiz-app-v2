# 🎯 Quiz Management System

A modern, full-featured quiz management platform built with React 19, TypeScript, and Tailwind CSS v4. This application provides comprehensive tools for creating, managing, and taking quizzes with an intuitive admin dashboard and beautiful user interface.

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5+-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-6.0+-646CFF?logo=vite)

## ✨ Features

### 🎓 User Features

- **Interactive Quizzes**: Take quizzes with multiple question types (multiple choice, single answer, true/false)
- **Quiz Browsing**: Browse and search available quizzes with beautiful card layouts
- **Responsive Design**: Fully responsive interface works seamlessly on desktop, tablet, and mobile
- **User Authentication**: Secure login and registration system
- **About & Contact**: Learn about the platform and get in touch

### 👨‍💼 Admin Dashboard

- **User Management**: Create, edit, delete, and manage user accounts with role-based access
- **Role Management**: Define and manage user roles and permissions
- **Quiz Management**: Full CRUD operations for quizzes with image uploads
- **Question Management**: Create questions with multiple answer options
- **Answer Management**: Manage answer options with correct/incorrect marking
- **Advanced Tables**: Sortable, filterable tables with pagination
- **Search & Filters**: Powerful search and filtering capabilities across all entities
- **Status Management**: Toggle active/inactive status for all entities

## 🛠️ Tech Stack

### Core Framework

- **React 19.2.0** - Latest React with improved performance, concurrent features, and server components support
- **TypeScript 5.9.3** - Strict type checking for enhanced developer experience and code quality
- **Vite 7.2.5** (Rolldown) - Lightning-fast build tool with native bundler for optimal performance
- **React Router 7.10.1** - Modern routing with nested layouts, lazy loading, and protected routes

### UI & Styling

- **Tailwind CSS v4.1.17** - Latest version with enhanced performance and @theme syntax
- **Shadcn/ui** - 20+ pre-built, accessible, customizable components
- **Radix UI** - Unstyled, accessible primitives (Avatar, Checkbox, Dropdown, Select, Label)
- **Lucide React 0.556.0** - 1000+ beautiful, consistent SVG icons
- **class-variance-authority** - Type-safe component variants
- **tailwind-merge** - Intelligent Tailwind class merging
- **tailwindcss-animate** - Pre-configured animations

### State Management & Data Fetching

- **React Query 5.90.16** (@tanstack/react-query) - Powerful async state management
  - Server state caching with smart invalidation
  - Automatic background refetching
  - Optimistic updates for mutations
  - DevTools integration for debugging
- **Context API** - Global state management (Auth, Theme)
- **Axios 1.13.2** - HTTP client with interceptors and refresh token flow
- **async-mutex 0.5.0** - Prevents race conditions in token refresh

### Form Management & Validation

- **React Hook Form 7.69.0** - Performant, flexible forms with minimal re-renders
- **Zod 4.3.4** - TypeScript-first schema validation
- **@hookform/resolvers 5.2.2** - Integrates Zod with React Hook Form

### Utilities & Helpers

- **Day.js 1.11.19** - Lightweight 2KB date manipulation library (Moment.js alternative)
- **Lodash 4.17.21** - Utility functions for data manipulation
- **UUID 13.0.0** - Generate unique identifiers
- **react-toastify 11.0.5** - Beautiful, customizable toast notifications

### Development Tools

- **ESLint 9.39.1** - Code linting with React 19 hooks rules
- **TypeScript ESLint 8.46.4** - TypeScript-specific linting rules
- **globals 16.5.0** - Global variables for ESLint
- **@types/** - TypeScript definitions for all dependencies

## 🏗️ Architecture

### Application Architecture

The application follows a modern React architecture with clear separation of concerns:

```
Presentation Layer (Components)
        ↓
State Management (Context API + React Query)
        ↓
Business Logic (Custom Hooks)
        ↓
Data Layer (API Services + Axios)
        ↓
Backend API (Spring Boot)
```

### State Management Strategy

#### 1. **Server State** (React Query)

Manages all server data with automatic caching and synchronization:

- **Queries**: Fetch data from backend (users, quizzes, questions, roles)
- **Mutations**: Create, update, delete operations with optimistic updates
- **Cache Management**: 3-minute stale time, 10-minute garbage collection
- **Auto-refetch**: Background updates on window focus and network reconnection

```typescript
// Example: useQuiz hook with React Query
const {
  data: quizzes,
  isLoading,
  error,
} = useQuery({
  queryKey: ["quizzes", filters],
  queryFn: () => quizApi.getAllQuizzes(filters),
  staleTime: 3 * 60 * 1000,
});
```

#### 2. **Global Client State** (Context API)

- **AuthContext**: User authentication state, login/logout, token management
- **ThemeContext**: Dark/light/system theme with localStorage persistence

#### 3. **Local Component State** (useState)

- Form inputs, UI toggles, temporary state

### Security Architecture

#### JWT Authentication Flow

```
1. User Login → Receive Access Token (15min) + Refresh Token (7d)
2. Store Access Token in localStorage
3. Store Refresh Token in httpOnly cookie (backend)
4. Axios interceptor adds token to all requests
5. On 401 error → Auto-refresh using mutex pattern
6. New Access Token → Retry failed request
7. On refresh failure → Logout user
```

**Key Security Features**:

- ✅ Mutex prevents concurrent refresh requests (race condition)
- ✅ Automatic token rotation
- ✅ Secure httpOnly cookies for refresh tokens
- ✅ CORS with credentials enabled
- ✅ 30-second request timeout

#### Role-Based Access Control (RBAC)

**Implementation Pattern**:

```typescript
// 1. Hook-based (Programmatic)
const { hasRole, can, isAdmin } = usePermission();
if (hasRole('ADMIN')) {
  // Show admin features
}

// 2. Component-based (Declarative)
<Authorize roles={['ADMIN', 'MODERATOR']} fallback={<AccessDenied />}>
  <AdminPanel />
</Authorize>

// 3. Route-based (Protected Routes)
<Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
  <Route path="/admin/*" element={<AdminLayout />} />
</Route>
```

**RBAC Utilities** (9 functions in `usePermission`):

- `hasRole(role)` - Check if user has specific role(s)
- `hasPermission(permission)` - Check fine-grained permissions
- `can(action, resource)` - Permission checker (e.g., 'edit', 'quiz')
- `cannot(action, resource)` - Inverse permission check
- `isAdmin()` - Quick admin check
- `isUser()` - Regular user check
- `isAuthenticated()` - Authentication check
- `roles()` - Get all user roles
- `permissions()` - Get all permissions

### Performance Optimizations

#### Bundle Splitting Strategy

```javascript
// vite.config.ts - Manual chunk splitting
manualChunks: (id) => {
  if (id.includes("react")) return "react-vendor"; // 408 KB
  if (id.includes("@tanstack")) return "query-vendor"; // 95 KB
  if (id.includes("react-hook-form")) return "form-vendor"; // 95 KB
  if (id.includes("lucide-react")) return "ui-vendor"; // 25 KB
  return "vendor";
};
```

**Results**:

- Main bundle: 54.94 KB (15.27 KB gzip)
- Total bundle: ~580 KB → ~150 KB gzip
- Lazy loaded admin pages: 4.46 KB each (gzip)

#### Image Optimization

- Original: 6.8 MB
- Optimized: 717 KB
- **Reduction: 89.5%**

#### Code Splitting (React.lazy + Suspense)

```typescript
const QuizManagementPage = lazy(
  () => import("@/pages/admin/QuizManagementPage")
);
const UserManagementPage = lazy(
  () => import("@/pages/admin/UserManagementPage")
);
// + 2 more admin pages
```

#### Loading States

- Skeleton screens for data loading
- Suspense fallback for code splitting
- Error boundaries for graceful error handling

### Error Handling System

#### Three-Tier Error Handling

1. **Global Error Boundary** (`ErrorBoundary.tsx`)

   - Catches React rendering errors
   - Shows fallback UI with error details
   - Prevents entire app crash

2. **Route Error Boundary** (`RouteErrorBoundary.tsx`)

   - Handles route-specific errors
   - 404 Not Found pages
   - Navigation errors

3. **API Error Handling** (Axios interceptors)
   - 401 Unauthorized → Auto token refresh
   - 403 Forbidden → Access denied page
   - 404 Not Found → Resource not found
   - 500 Server Error → User-friendly message
   - Network errors → Offline notification

```typescript
// axios.config.ts - Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Attempt token refresh with mutex
      return await handleTokenRefresh(error);
    }
    // Show user-friendly error toast
    toast.error(getErrorMessage(error));
    return Promise.reject(error);
  }
);
```

### Theme System

#### Three Theme Modes

- **Light**: Professional light background
- **Dark**: OLED-friendly dark mode with proper contrast
- **System**: Auto-detects OS preference

**Features**:

- ✅ Persistent across sessions (localStorage)
- ✅ No flash of unstyled content (inline script in index.html)
- ✅ Three toggle variants (icon-only, icon+text, dropdown)
- ✅ System preference detection with `matchMedia`
- ✅ Real-time sync across tabs

**Implementation**:

```typescript
// ThemeContext.tsx
export type Theme = "light" | "dark" | "system";

const getEffectiveTheme = (theme: Theme): "light" | "dark" => {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return theme;
};
```

## 📁 Project Structure

```
client/
├── public/                    # Static assets (favicon, robots.txt)
├── src/
│   ├── assets/               # Media files (images, icons)
│   │   ├── icons/           # SVG icons
│   │   └── images/
│   │       ├── quizzes/     # Quiz cover images (optimized)
│   │       └── teams/       # Team member photos
│   ├── components/          # Reusable components (95 files)
│   │   ├── admin/          # Admin dashboard components
│   │   │   ├── question/   # Question CRUD (3 components)
│   │   │   ├── quiz/       # Quiz CRUD (5 components)
│   │   │   ├── role/       # Role management (3 components)
│   │   │   └── user/       # User management (3 components)
│   │   ├── about/          # About page sections
│   │   ├── auth/           # Auth components (Authorize, ProtectedRoute)
│   │   ├── error/          # Error boundaries (2 files)
│   │   ├── home/           # Homepage sections (Hero, Features, CTA)
│   │   ├── layout/         # Layout components (Navbar, Sidebar, Footer)
│   │   ├── quiz/           # Quiz UI components (QuizCard, QuizList)
│   │   ├── team/           # Team member cards
│   │   └── ui/             # Shadcn/ui primitives (20+ components)
│   ├── config/             # App configuration
│   │   ├── axios.config.ts # HTTP client + interceptors (210 lines)
│   │   ├── constants.ts    # App constants (routes, roles, storage keys)
│   │   └── env.ts          # Environment variables config
│   ├── contexts/           # React Context providers
│   │   ├── AuthContext.tsx # Auth state + login/logout (235 lines)
│   │   ├── ThemeContext.tsx # Theme state (light/dark/system, 119 lines)
│   │   └── index.ts        # Context exports
│   ├── hooks/              # Custom hooks
│   │   ├── usePermission.ts # RBAC utilities (117 lines, 9 functions)
│   │   ├── useQuiz.ts      # Quiz data fetching (React Query, 125 lines)
│   │   ├── useQuestions.ts # Questions data (~100 lines)
│   │   ├── useUsers.ts     # User management (~80 lines)
│   │   ├── useRole.ts      # Role management (~70 lines)
│   │   └── index.ts        # Hook exports
│   ├── lib/                # Utility functions
│   │   └── utils.ts        # Helper functions (cn, formatDate, etc.)
│   ├── pages/              # Page-level components
│   │   ├── admin/          # Admin pages (4 lazy-loaded)
│   │   │   ├── QuizManagementPage.tsx
│   │   │   ├── QuestionManagementPage.tsx
│   │   │   ├── UserManagementPage.tsx
│   │   │   └── RoleManagementPage.tsx
│   │   ├── auth/           # Auth pages (login, register)
│   │   ├── error/          # Error pages (404, 403)
│   │   ├── about/          # About page
│   │   ├── contact/        # Contact page
│   │   ├── home/           # Homepage
│   │   └── quizzes/        # Public quiz listing
│   ├── services/           # API service layer
│   │   ├── auth.api.ts     # Authentication API calls
│   │   ├── quiz.api.ts     # Quiz CRUD operations
│   │   ├── question.api.ts # Question operations
│   │   ├── user.api.ts     # User management
│   │   └── role.api.ts     # Role management
│   ├── types/              # TypeScript definitions
│   │   ├── backend.d.ts    # API response types (~150 lines)
│   │   └── file.d.ts       # File upload types
│   ├── validations/        # Zod validation schemas
│   │   ├── auth.schema.ts  # Login/register validation
│   │   ├── quiz.schema.ts  # Quiz form validation
│   │   └── user.schema.ts  # User form validation
│   ├── App.tsx             # Route definitions (118 lines)
│   ├── main.tsx            # App entry + providers (50 lines)
│   └── index.css           # Global styles + Tailwind theme
├── .env.development         # Development environment variables
├── .env.production          # Production environment variables
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore rules
├── components.json          # Shadcn/ui configuration
├── eslint.config.js         # ESLint configuration
├── index.html               # HTML entry point
├── package.json             # Dependencies (63 lines)
├── tsconfig.json            # TypeScript config (strict mode)
├── tsconfig.app.json        # App-specific TS config
├── tsconfig.node.json       # Node-specific TS config
└── vite.config.ts           # Vite config + bundle splitting

```

## ✨ Advanced Features

### 🔐 Authentication & Authorization

- **JWT-based Authentication** with automatic token refresh (mutex pattern)
- **Role-Based Access Control (RBAC)** with 9 utility functions
- **Protected Routes** with declarative `<Authorize>` component
- **Persistent Sessions** across browser tabs and page reloads
- **Secure Token Storage** (localStorage + httpOnly cookies)

### 📊 Data Management

- **React Query Integration** for server state management
  - Automatic caching with 3-minute stale time
  - Background refetching on focus/reconnection
  - Optimistic updates for instant UI feedback
  - Smart cache invalidation after mutations
- **Pagination** with customizable items per page (5, 10, 20, 50)
- **Search & Filtering** across all data tables
- **Sorting** by any column (ascending/descending)

### 🎨 UI/UX Excellence

- **Dark Mode** with 3 variants (light/dark/system)
  - Persistent across sessions
  - No flash of unstyled content
  - System preference detection
- **Responsive Design** (mobile-first, works on all screen sizes)
- **Loading States** with skeleton screens
- **Error Boundaries** for graceful error handling
- **Toast Notifications** for user feedback
- **Accessible Components** (ARIA labels, keyboard navigation)

### ⚡ Performance

- **Code Splitting** with React.lazy (4 admin pages lazy-loaded)
- **Bundle Optimization** (~150 KB gzip total)
- **Image Optimization** (89.5% size reduction)
- **Tree Shaking** (removes unused code)
- **Manual Chunk Splitting** for optimal caching

### 🛠️ Developer Experience

- **TypeScript Strict Mode** for type safety
- **ESLint + Prettier** for code quality
- **Absolute Imports** with `@/` alias
- **Hot Module Replacement** for instant updates
- **DevTools** (React Query DevTools in development)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Git

### Installation

1. **Clone the repository** (if from git)

```bash
git clone <repository-url>
cd client
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Create `.env.development` file in the `client` directory:

```bash
cp .env.example .env.development
```

Edit `.env.development` and update the API URL if needed:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_APP_NAME=Quiz Management System
VITE_APP_VERSION=1.0.0
VITE_API_TIMEOUT=30000
VITE_ENABLE_DEV_TOOLS=true
```

4. **Start development server**

```bash
npm run dev
```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

| Command           | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start development server with hot reload |
| `npm run build`   | Build for production                     |
| `npm run preview` | Preview production build locally         |
| `npm run lint`    | Run ESLint to check code quality         |

## 🎨 Component Architecture

### Admin Components Structure

Each admin module follows a consistent pattern with 3 main components:

#### User Management (`/components/admin/user/`)

- `user-search-filter.tsx` - Search and filter interface
- `user-table.tsx` - Data table with pagination
- `user-form.tsx` - Create/Edit form

#### Role Management (`/components/admin/role/`)

- `role-search-filter.tsx` - Search and filter interface
- `role-table.tsx` - Data table with pagination
- `role-form.tsx` - Create/Edit form

#### Quiz Management (`/components/admin/quiz/`)

- `quiz-search-filter.tsx` - Search and filter interface
- `quiz-table.tsx` - Quiz data table
- `quiz-form.tsx` - Create/Edit quiz form
- `question-table.tsx` - Nested questions table
- `question-form.tsx` - Add question form

#### Question Management (`/components/admin/question/`)

- `question-search-filter.tsx` - Search and filter interface
- `question-table.tsx` - Question data table
- `question-form.tsx` - Create/Edit question form
- `answer-table.tsx` - Answer options table
- `answer-form.tsx` - Add/Edit answer form

### UI Components (`/components/ui/`)

Shadcn/ui components used throughout the application:

- `button.tsx` - Customizable button component
- `card.tsx` - Card container with header/content/footer
- `table.tsx` - Data table components
- `pagination.tsx` - Pagination controls
- `badge.tsx` - Status badges
- `input.tsx` - Form input fields
- `select.tsx` - Dropdown select
- `checkbox.tsx` - Checkbox input
- `textarea.tsx` - Multi-line text input
- `avatar.tsx` - User avatar display
- `dropdown-menu.tsx` - Dropdown menu component
- `label.tsx` - Form labels

## 🎯 Key Features Implementation

### Pagination System

All admin tables feature a consistent 3-part pagination layout:

- **Left**: Items per page selector (5, 10, 20, 50)
- **Center**: Page navigation buttons
- **Right**: Record count display (e.g., "1-10 of 32")

### Status Badge System

Unified badge system for entity status:

- **Active**: Green badge (`bg-green-100 text-green-700`)
- **Inactive**: Red badge (`bg-red-100 text-red-700`)

### Form Validation

All forms include:

- Required field validation
- Type-safe input handling
- Clear/Reset functionality
- Consistent button layouts (Cancel/Save)

### Responsive Design

- Mobile-first approach
- Breakpoints: `sm:`, `md:`, `lg:`, `xl:`
- Collapsible sidebar on mobile
- Responsive tables with horizontal scroll

## 🔧 Configuration

### Tailwind CSS v4

Custom theme configuration in `src/index.css`:

```css
@theme {
  --color-primary: oklch(0.52 0.24 250.29);
  --color-secondary: oklch(0.96 0.01 286.32);
  /* ... more theme variables */
}
```

### Shadcn/ui

Configuration in `components.json`:

- Style: Default
- Base color: Zinc
- CSS variables: Yes
- Tailwind v4: Enabled

### Environment Variables

The app uses environment variables for configuration. See `.env.example` for all available options:

**Development** (`.env.development`):

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_ENABLE_DEV_TOOLS=true
```

**Production** (`.env.production`):

```env
VITE_API_BASE_URL=https://api.quiz-app.com/api/v1
VITE_ENABLE_DEV_TOOLS=false
```

**Available Variables**:

- `VITE_API_BASE_URL` - Backend API endpoint
- `VITE_APP_NAME` - Application name
- `VITE_APP_VERSION` - Application version
- `VITE_API_TIMEOUT` - API request timeout (ms)
- `VITE_ENABLE_DEV_TOOLS` - Enable development tools
- `VITE_ENABLE_MOCK_DATA` - Enable mock data (for testing)

## 📝 Code Quality

### TypeScript

- Strict mode enabled
- Type-safe component props
- Interface definitions for all data models

### ESLint

- React 19 hooks rules
- TypeScript-specific rules
- Import organization
- Code formatting standards

### Component Guidelines

- Functional components with TypeScript
- Props interfaces for all components
- Consistent naming: PascalCase for components, kebab-case for files
- Modular architecture: Single Responsibility Principle

## 🎨 Design System

### Colors

- **Primary**: Blue (`oklch(0.52 0.24 250.29)`)
- **Secondary**: Light gray (`oklch(0.96 0.01 286.32)`)
- **Success**: Green for active status
- **Danger**: Red for inactive/delete actions

### Typography

- Font family: System fonts stack
- Responsive font sizes
- Consistent heading hierarchy

### Spacing

- Consistent spacing scale (4px base)
- Card padding: `p-6`
- Button padding: `px-4 py-2`
- Section spacing: `space-y-6`

## 🚀 Deployment

### Build for Production

```bash
# Install dependencies
npm install

# Build with production environment variables
npm run build

# Preview production build locally
npm run preview
```

**Build Output**:

- Location: `dist/` directory
- Size: ~580 KB total (~150 KB gzip)
- Assets: HTML, CSS, JS chunks, images
- Ready for: Static hosting services

### Deployment Platforms

#### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

**Environment Variables** (Vercel Dashboard):

```env
VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
VITE_ENABLE_DEV_TOOLS=false
```

#### Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

**Build Settings**:

- Build command: `npm run build`
- Publish directory: `dist`
- Environment variables: Set in Netlify dashboard

#### Docker (Full-Stack)

Create `Dockerfile` in `client/`:

```dockerfile
# Multi-stage build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

# Production stage with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf** (for SPA routing):

```nginx
server {
  listen 80;
  server_name _;
  root /usr/share/nginx/html;
  index index.html;

  # Enable gzip compression
  gzip on;
  gzip_types text/css application/javascript application/json;

  # SPA routing - serve index.html for all routes
  location / {
    try_files $uri $uri/ /index.html;
  }

  # Cache static assets for 1 year
  location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}
```

**Build and run**:

```bash
docker build --build-arg VITE_API_BASE_URL=https://api.yourdomain.com/api/v1 -t quiz-app .
docker run -p 80:80 quiz-app
```

### Production Checklist

**Pre-Deployment**:

- [ ] Update `.env.production` with production API URL
- [ ] Run `npm run lint` and fix all issues
- [ ] Test all user flows (login, admin, quiz taking)
- [ ] Verify responsive design on mobile/tablet/desktop
- [ ] Check dark mode works correctly
- [ ] Test protected routes and RBAC
- [ ] Optimize all images (<100 KB each)
- [ ] Enable error tracking (e.g., Sentry)

**Build Optimization**:

- [ ] Run production build: `npm run build`
- [ ] Check bundle size (target: <200 KB gzip)
- [ ] Verify code splitting (lazy loaded routes)
- [ ] Test build locally: `npm run preview`
- [ ] Check for console errors/warnings

**Post-Deployment**:

- [ ] Verify production URL loads correctly
- [ ] Test API connectivity (backend integration)
- [ ] Check CORS configuration
- [ ] Monitor performance (Lighthouse score >90)
- [ ] Set up SSL certificate (HTTPS)
- [ ] Configure CDN for static assets (optional)
- [ ] Set up monitoring/analytics

### Environment Variables Reference

**Required**:

- `VITE_API_BASE_URL` - Backend API endpoint (with `/api/v1`)

**Optional**:

- `VITE_APP_NAME` - Application name (default: "Quiz Management System")
- `VITE_APP_VERSION` - Version number (default: "1.0.0")
- `VITE_API_TIMEOUT` - Request timeout in ms (default: 30000)
- `VITE_ENABLE_DEV_TOOLS` - Show React Query DevTools (default: false in prod)
- `VITE_ENABLE_MOCK_DATA` - Use mock data instead of API (default: false)

### Performance Metrics

**Target Lighthouse Scores** (Production):

- Performance: >90
- Accessibility: >95
- Best Practices: >90
- SEO: >90

**Actual Bundle Sizes**:

```
dist/assets/react-vendor-[hash].js    408.23 KB │ gzip: 132.45 KB
dist/assets/query-vendor-[hash].js     95.12 KB │ gzip:  31.28 KB
dist/assets/form-vendor-[hash].js      95.08 KB │ gzip:  29.76 KB
dist/assets/ui-vendor-[hash].js        25.44 KB │ gzip:   9.12 KB
dist/assets/main-[hash].js             54.94 KB │ gzip:  15.27 KB
Total:                                678.81 KB │ gzip: 217.88 KB
```

**Lazy-Loaded Pages** (loaded on-demand):

```
QuizManagementPage-[hash].js     18.90 KB │ gzip: 4.46 KB
UserManagementPage-[hash].js     16.23 KB │ gzip: 3.89 KB
QuestionManagementPage-[hash].js 15.67 KB │ gzip: 3.72 KB
RoleManagementPage-[hash].js     14.12 KB │ gzip: 3.34 KB
```

## 📚 Documentation

### Component Documentation

Each component is self-documented with:

- TypeScript interfaces for props
- JSDoc comments for complex logic
- Inline comments for business logic

### Type Definitions

Centralized type definitions in `/src/types/`:

- `quiz.ts` - Quiz entity types
- `question.ts` - Question entity types
- `team.ts` - Team member types

## 🤝 Contributing

### Development Workflow

1. Create feature branch from `main`
2. Make changes following code guidelines
3. Test thoroughly
4. Submit pull request with clear description

### Code Style

- Use Prettier for formatting
- Follow ESLint rules
- Write meaningful commit messages
- Keep components small and focused

## 📦 Build & Optimization

### Performance Optimizations

- **Code Splitting**: Automatic route-based code splitting
- **Tree Shaking**: Remove unused code in production
- **Asset Optimization**: Image and CSS optimization
- **Bundle Analysis**: Monitor bundle size with Vite

### Production Checklist

- [ ] Run `npm run lint` and fix all issues
- [ ] Test all user flows
- [ ] Verify responsive design on all breakpoints
- [ ] Check accessibility (ARIA labels, keyboard navigation)
- [ ] Optimize images and assets
- [ ] Review and update meta tags
- [ ] Set up error tracking (optional)

## 🐛 Troubleshooting

### Common Issues

**Port already in use**

```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
# Or change port in vite.config.ts
```

**Module not found**

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors**

```bash
# Rebuild TypeScript
npm run build
```

## 📄 License

This project is private and intended for educational/demonstration purposes.

## 👥 Team

Developed as part of a web development course project.

## 🙏 Acknowledgments

- [Shadcn/ui](https://ui.shadcn.com/) - For the beautiful component library
- [Tailwind CSS](https://tailwindcss.com/) - For the utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) - For accessible UI primitives
- [React](https://react.dev/) - For the amazing framework
- [Vite](https://vite.dev/) - For blazing fast development experience

---

**Note**: After extracting this project, run `npm install` to install dependencies before starting the development server.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
