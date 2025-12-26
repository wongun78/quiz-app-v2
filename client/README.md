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

### Core

- **React 19.2** - Latest React with improved performance and features
- **TypeScript 5.5+** - Type-safe development
- **Vite 6.0** - Next-generation frontend tooling with Rolldown
- **React Router 7** - Client-side routing with nested layouts

### UI & Styling

- **Tailwind CSS v4** - Utility-first CSS framework with custom theme
- **Shadcn/ui** - High-quality, accessible component library
- **Radix UI** - Unstyled, accessible UI primitives
- **React Icons** - Popular icon library
- **Lucide React** - Beautiful icon set

### State & Data

- **Axios** - HTTP client for API requests
- **Day.js** - Lightweight date manipulation library
- **Lodash** - Utility functions for data manipulation

### Development

- **ESLint** - Code linting with TypeScript support
- **Prettier** - Code formatting
- **TypeScript ESLint** - TypeScript-specific linting rules

## 📁 Project Structure

```
project-fe/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images, icons, and other media
│   │   ├── icons/
│   │   └── images/
│   │       ├── quizzes/   # Quiz cover images
│   │       └── teams/     # Team member photos
│   ├── components/        # Reusable components
│   │   ├── admin/        # Admin-specific components
│   │   │   ├── question/ # Question management components
│   │   │   ├── quiz/     # Quiz management components
│   │   │   ├── role/     # Role management components
│   │   │   └── user/     # User management components
│   │   ├── about/        # About page components
│   │   ├── home/         # Home page components
│   │   ├── layout/       # Layout components (navbar, footer, sidebar)
│   │   ├── quiz/         # Quiz-related components
│   │   ├── team/         # Team components
│   │   └── ui/           # Shadcn/ui components
│   ├── pages/            # Page components
│   │   ├── admin/        # Admin pages
│   │   ├── auth/         # Authentication pages
│   │   ├── error/        # Error pages (404, 403)
│   │   ├── about/        # About page
│   │   ├── contact/      # Contact page
│   │   ├── home/         # Home page
│   │   └── quizzes/      # Quiz listing page
│   ├── types/            # TypeScript type definitions
│   ├── lib/              # Utility functions
│   ├── App.tsx           # Main app component
│   └── main.tsx          # Application entry point
├── components.json        # Shadcn/ui configuration
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Project dependencies

```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Git

### Installation

1. **Clone the repository** (if from git)

```bash
git clone <repository-url>
cd project-fe
```

2. **Install dependencies**

```bash
npm install
```

3. **Start development server**

```bash
npm run dev
```

4. **Open your browser**
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
npm run build
```

The build output will be in the `dist/` directory, ready to deploy to:

- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

### Environment Variables

Create `.env` file for environment-specific configuration:

```env
VITE_API_URL=your_api_url
VITE_APP_NAME=Quiz Management System
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
