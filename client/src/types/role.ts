/**
 * Role Management Types
 */

/**
 * Search/Filter params
 */
export interface RoleSearchParams {
  name?: string;
  page?: number;
  size?: number;
  sort?: string;
}

/**
 * Default pagination
 */
export const ROLE_DEFAULT_PAGE_SIZE = 10;
