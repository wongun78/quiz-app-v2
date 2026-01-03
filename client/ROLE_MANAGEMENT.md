# 📋 Role Management - Implementation Guide

## 🎯 Overview

Role Management system cho phép ADMIN quản lý roles trong hệ thống. Vì roles là **ENUM cố định** (ROLE_ADMIN, ROLE_USER), frontend chỉ cần CRUD đơn giản.

---

## 🔧 Backend Analysis

### **Entity Structure:**

```java
@Entity
public class Role extends BaseEntity {
    UUID id;
    @Enumerated RoleEnum name;  // ROLE_ADMIN | ROLE_USER
    // BaseEntity: createdAt, updatedAt, isDeleted
}
```

### **API Endpoints:**

| Method   | Endpoint                     | Description         | Auth  |
| -------- | ---------------------------- | ------------------- | ----- |
| `POST`   | `/api/v1/roles`              | Create role         | ADMIN |
| `GET`    | `/api/v1/roles`              | Get all (paginated) | ADMIN |
| `GET`    | `/api/v1/roles/search?name=` | Search by name      | ADMIN |
| `GET`    | `/api/v1/roles/{id}`         | Get by ID           | ADMIN |
| `PUT`    | `/api/v1/roles/{id}`         | Update role         | ADMIN |
| `DELETE` | `/api/v1/roles/{id}`         | Soft delete         | ADMIN |

### **DTOs:**

```typescript
// Response
{
  id: UUID,
  name: "ROLE_ADMIN" | "ROLE_USER"
  createdAt: LocalDateTime,
  updatedAt: LocalDateTime,
  isDeleted: boolean
}

// Request
{
  name: "ROLE_ADMIN" | "ROLE_USER"
}
```

---

## ⚠️ Important Notes

### **KHÔNG CÓ trong backend:**

- ❌ `description` field
- ❌ `active/status` field (chỉ có `isDeleted`)
- ❌ Search filter theo `isDeleted`

### **Giải pháp Frontend:**

- ✅ Dùng constants map để hiển thị description (client-side only)
- ✅ Hiển thị status từ `isDeleted` flag
- ✅ Search chỉ hỗ trợ theo `name` (RoleEnum)

---

## 📁 Frontend Implementation

### **1. Types** (`src/types/`)

#### `backend.d.ts` - API Contract

```typescript
export interface RoleResponse {
  id: string;
  name: string; // "ROLE_ADMIN" | "ROLE_USER"
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface RoleRequest {
  name: string; // "ROLE_ADMIN" | "ROLE_USER"
}
```

#### `role.ts` - UI Helpers

```typescript
export enum RoleEnum {
  ROLE_ADMIN = "ROLE_ADMIN",
  ROLE_USER = "ROLE_USER",
}

export const ROLE_LABELS = {
  ROLE_ADMIN: "Administrator",
  ROLE_USER: "User",
};

export const ROLE_DESCRIPTIONS = {
  ROLE_ADMIN: "Full system access with all administrative privileges",
  ROLE_USER: "Standard user access for taking quizzes",
};

export const ROLE_OPTIONS: RoleOption[] = [
  { value: "ROLE_ADMIN", label: "Administrator", description: "..." },
  { value: "ROLE_USER", label: "User", description: "..." },
];
```

---

### **2. Validation** (`src/validations/admin.schema.ts`)

```typescript
export const roleSchema = z.object({
  name: z.enum(["ROLE_ADMIN", "ROLE_USER"], {
    errorMap: () => ({ message: "Role must be ROLE_ADMIN or ROLE_USER" }),
  }),
});

export type RoleFormData = z.infer<typeof roleSchema>;
```

**Validation Rules:**

- ✅ `name` là required và phải là 1 trong 2 values
- ✅ Frontend validate trước khi gửi request
- ✅ Backend cũng validate bằng `@Valid` annotation

---

### **3. Service Layer** (`src/services/api/role.api.ts`)

```typescript
class RoleService {
  async getAll(params?: PaginationParams): Promise<PageResponse<RoleResponse>>;
  async search(
    name?: string,
    params?: PaginationParams
  ): Promise<PageResponse<RoleResponse>>;
  async getById(id: string): Promise<RoleResponse>;
  async create(data: RoleRequest): Promise<RoleResponse>;
  async update(id: string, data: RoleRequest): Promise<RoleResponse>;
  async delete(id: string): Promise<void>;
}

export const roleService = new RoleService();
```

**Usage:**

```typescript
// Get all roles
const roles = await roleService.getAll({ page: 0, size: 10 });

// Search by name
const adminRoles = await roleService.search("ROLE_ADMIN", {
  page: 0,
  size: 10,
});

// Create role
const newRole = await roleService.create({ name: "ROLE_ADMIN" });

// Update role
const updated = await roleService.update(id, { name: "ROLE_USER" });

// Delete role (soft delete)
await roleService.delete(id);
```

---

### **4. Custom Hooks** (`src/hooks/useRole.ts`)

```typescript
// Hook for list with search/pagination
export const useRoles = (options?: UseRolesOptions): UseRolesReturn => {
  const { name, page, size, autoFetch } = options;
  // Returns: { roles, isLoading, error, totalPages, totalElements, refetch }
};

// Hook for single role
export const useRole = (id?: string) => {
  // Returns: { role, isLoading, error, refetch }
};
```

**Usage:**

```typescript
// In RoleManagementPage
const { roles, isLoading, refetch } = useRoles({
  name: searchName,
  page: currentPage,
  size: 10,
});

// In RoleEditPage
const { role, isLoading } = useRole(roleId);
```

---

## 🎨 UI Components Structure

### **Page Layout:**

```
RoleManagementPage/
├── RoleSearchFilter     → Search by name (dropdown)
├── RoleTable           → Display roles with pagination
│   ├── Name (Badge)
│   ├── Description (from constants)
│   ├── Status (isDeleted)
│   └── Actions (Edit, Delete)
└── RoleFormDialog      → Create/Update modal
```

### **Form Fields:**

#### **Create Role:**

```typescript
<Select name="name">
  <option value="ROLE_ADMIN">Administrator</option>
  <option value="ROLE_USER">User</option>
</Select>
```

#### **Display in Table:**

```typescript
<Badge variant={getRoleColor(role.name)}>
  {getRoleLabel(role.name)}
</Badge>
<span className="text-sm text-muted-foreground">
  {getRoleDescription(role.name)}
</span>
<Badge variant={getRoleStatusColor(role)}>
  {getRoleStatus(role)} {/* Active/Inactive */}
</Badge>
```

---

## 🔍 Search & Filter

### **Available Filters:**

- ✅ **Name**: Dropdown select (ROLE_ADMIN | ROLE_USER | All)
- ❌ **Status**: NOT supported by backend API

### **Implementation:**

```typescript
const [searchName, setSearchName] = useState<string>("");

const { roles } = useRoles({
  name: searchName || undefined, // Empty string = get all
  page: currentPage,
  size: pageSize,
});
```

---

## 📊 Pagination

### **Default Settings:**

```typescript
const ROLE_DEFAULT_PAGE_SIZE = 10;
const ROLE_DEFAULT_SORT = "name,asc";
```

### **Backend Response:**

```typescript
{
  content: RoleResponse[],
  pageNumber: 0,
  pageSize: 10,
  totalElements: 2,
  totalPages: 1,
  first: true,
  last: true,
  hasContent: true,
  hasNext: false,
  hasPrevious: false
}
```

---

## ⚡ CRUD Operations Flow

### **Create:**

1. User clicks "Add Role" button
2. Open dialog with Select dropdown
3. Choose ROLE_ADMIN or ROLE_USER
4. Submit → `roleService.create({ name })`
5. Success → Close dialog, refresh list, show toast

### **Read:**

1. Page load → `useRoles()` auto-fetch
2. Display in table with badges
3. Click row → Navigate to detail or open edit dialog

### **Update:**

1. Click "Edit" → Open dialog pre-filled with current role
2. Change name (if allowed)
3. Submit → `roleService.update(id, { name })`
4. Success → Refresh list, show toast

### **Delete:**

1. Click "Delete" → Show confirmation dialog
2. Confirm → `roleService.delete(id)` (soft delete)
3. Success → Refresh list, show toast
4. **Note**: Role vẫn tồn tại DB với `isDeleted=true`

---

## 🚨 Error Handling

```typescript
try {
  await roleService.create(data);
  toast.success("Role created successfully");
  refetch();
} catch (error: any) {
  const message = error?.response?.data?.message || "Failed to create role";
  toast.error(message);
}
```

---

## 🎯 Best Practices

1. **Always use enum constants** instead of hardcoded strings
2. **Use helper functions** for display (getRoleLabel, getRoleDescription)
3. **Handle errors gracefully** with toast notifications
4. **Refetch list** after CUD operations
5. **Show loading states** during API calls
6. **Validate before submit** using Zod schema

---

## 📝 Summary

### ✅ **What's Implemented:**

- Complete CRUD API service
- Type-safe validation with Zod
- Custom hooks for data fetching
- Helper constants for UI display
- PageResponse pagination support

### ⚠️ **Limitations:**

- No `description` field in backend (use client-side constants)
- No filter by `isDeleted` (backend doesn't support)
- Limited to 2 role values (ROLE_ADMIN, ROLE_USER)

### 🎯 **Next Steps:**

1. Create UI components (RoleTable, RoleForm, RoleSearchFilter)
2. Implement RoleManagementPage with hooks
3. Add confirmation dialogs for delete
4. Test CRUD operations with backend
