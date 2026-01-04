/**
 * Re-export useAuth from contexts for convenience
 */
export { useAuth } from "@/contexts";

/**
 * Quiz hooks - Query & Mutations
 */
export {
  useQuizzes,
  useQuiz,
  useCreateQuiz,
  useUpdateQuiz,
  useDeleteQuiz,
} from "./useQuiz";

/**
 * Question hooks - Query & Mutations
 */
export {
  useQuestions,
  useQuestion,
  useCreateQuestion,
  useUpdateQuestion,
  useDeleteQuestion,
} from "./useQuestions";

/**
 * Role hooks - Query & Mutations
 */
export {
  useRoles,
  useRole,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
} from "./useRole";

/**
 * User hooks - Query & Mutations
 */
export {
  useUsers,
  useUser,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "./useUsers";

/**
 * Permission hooks
 */
export { usePermission } from "./usePermission";

/**
 * Theme hook (re-export from contexts)
 */
export { useTheme } from "@/contexts";
