import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "@/components/layout/main-layout";
import AdminLayout from "@/components/layout/admin-layout";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import {
  ErrorBoundary,
  LoadingFallback,
} from "@/components/error/ErrorBoundary";
import { ROLES } from "@/config/constants";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

const HomePage = lazy(() => import("@/pages/home"));
const AboutPage = lazy(() => import("@/pages/about"));
const ContactPage = lazy(() => import("@/pages/contact"));
const QuizPage = lazy(() => import("@/pages/quizzes"));

const LoginPage = lazy(() => import("@/pages/auth/login"));
const RegisterPage = lazy(() => import("@/pages/auth/register"));

const NotFoundPage = lazy(() => import("@/pages/error/404"));
const ForbiddenPage = lazy(() => import("@/pages/error/403"));

const QuizManagementPage = lazy(
  () => import("@/pages/admin/QuizManagementPage")
);
const QuestionManagementPage = lazy(
  () => import("@/pages/admin/QuestionManagementPage")
);
const UserManagementPage = lazy(
  () => import("@/pages/admin/UserManagementPage")
);
const RoleManagementPage = lazy(
  () => import("@/pages/admin/RoleManagementPage")
);

const ExamPage = lazy(() => import("@/pages/exam"));
const ExamResultPage = lazy(() => import("@/pages/exam/result"));

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProtectedRoute requiredRole={[ROLES.ADMIN]}>{children}</ProtectedRoute>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/quizzes" element={<QuizPage />} />
            <Route path="/exam/:quizId" element={<ExamPage />} />
            <Route
              path="/exam/result/:submissionId"
              element={<ExamResultPage />}
            />
          </Route>

          {/* ADMIN ROUTES */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="quizzes" replace />} />

            <Route
              path="quizzes"
              element={
                <AdminRoute>
                  <QuizManagementPage />
                </AdminRoute>
              }
            />
            <Route
              path="questions"
              element={
                <AdminRoute>
                  <QuestionManagementPage />
                </AdminRoute>
              }
            />
            <Route
              path="users"
              element={
                <AdminRoute>
                  <UserManagementPage />
                </AdminRoute>
              }
            />
            <Route
              path="roles"
              element={
                <AdminRoute>
                  <RoleManagementPage />
                </AdminRoute>
              }
            />
          </Route>

          {/* AUTH & ERROR ROUTES */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/403" element={<ForbiddenPage />} />

          {/* EXAM ROUTES */}

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <ConfirmDialog />
    </ErrorBoundary>
  );
}

export default App;
