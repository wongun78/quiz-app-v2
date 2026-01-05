import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CardWrap,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FaTimes, FaSave } from "react-icons/fa";
import { userSchema, type UserFormData } from "@/validations";
import { useRoles, useCreateUser, useUpdateUser } from "@/hooks";
import type { UserResponse } from "@/types/backend";

interface UserFormProps {
  user: UserResponse | null;
  onClose: () => void;
  onSuccess: () => void;
}

const UserForm = ({ user, onClose, onSuccess }: UserFormProps) => {
  const isEditMode = !!user;
  const { data: rolesData } = useRoles({});
  const roles = rolesData?.content || [];
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      username: user?.username || "",
      password: "",
      confirmPassword: "",
      dateOfBirth: user?.dateOfBirth || "",
      phoneNumber: user?.phoneNumber || "",
      active: user?.active ?? true,
      roleIds: user?.roles
        ? roles.filter((r) => user.roles.includes(r.name)).map((r) => r.id)
        : [],
    },
  });

  const isActive = watch("active");
  const selectedRoles = watch("roleIds");

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        password: "",
        confirmPassword: "",
        dateOfBirth: user.dateOfBirth || "",
        phoneNumber: user.phoneNumber || "",
        active: user.active,
        roleIds: user.roles
          ? roles.filter((r) => user.roles.includes(r.name)).map((r) => r.id)
          : [],
      });
    }
  }, [user, reset, roles]);

  const onSubmit = async (data: UserFormData) => {
    const { confirmPassword, ...userData } = data;

    if (!isEditMode && (!userData.roleIds || userData.roleIds.length === 0)) {
      const userRole = roles.find((r) => r.name === "ROLE_USER");
      if (userRole) {
        userData.roleIds = [userRole.id];
      }
    }

    if (isEditMode && user) {
      const updateData: any = { ...userData };
      if (!updateData.password) {
        delete updateData.password;
      }
      updateUser.mutate(
        { id: user.id, data: updateData },
        {
          onSuccess: () => {
            reset();
            onSuccess();
            onClose();
          },
        }
      );
    } else {
      createUser.mutate(userData as any, {
        onSuccess: () => {
          reset();
          onSuccess();
          onClose();
        },
      });
    }
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  const handleRoleToggle = (roleId: string) => {
    const currentRoles = selectedRoles || [];
    const newRoles = currentRoles.includes(roleId)
      ? currentRoles.filter((id) => id !== roleId)
      : [...currentRoles, roleId];
    setValue("roleIds", newRoles);
  };

  return (
    <CardWrap>
      <CardHeader className="border-b">
        <CardTitle>{isEditMode ? "Edit User" : "Add User"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <div className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="user-firstName">
                  First Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="user-firstName"
                  type="text"
                  placeholder="Enter first name"
                  className={errors.firstName ? "border-destructive" : ""}
                  {...register("firstName")}
                />
                {errors.firstName && (
                  <p className="text-sm text-destructive">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="user-lastName">
                  Last Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="user-lastName"
                  type="text"
                  placeholder="Enter last name"
                  className={errors.lastName ? "border-destructive" : ""}
                  {...register("lastName")}
                />
                {errors.lastName && (
                  <p className="text-sm text-destructive">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email & Username */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="user-email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="user-email"
                  type="email"
                  placeholder="Enter email address"
                  className={errors.email ? "border-destructive" : ""}
                  {...register("email")}
                  disabled={isEditMode}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="user-username">
                  Username <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="user-username"
                  type="text"
                  placeholder="Enter username"
                  className={errors.username ? "border-destructive" : ""}
                  {...register("username")}
                  disabled={isEditMode}
                />
                {errors.username && (
                  <p className="text-sm text-destructive">
                    {errors.username.message}
                  </p>
                )}
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="user-password">
                  Password <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="user-password"
                  type="password"
                  placeholder="Enter password"
                  className={errors.password ? "border-destructive" : ""}
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="user-confirmPassword">
                  Confirm Password <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="user-confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  className={errors.confirmPassword ? "border-destructive" : ""}
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            {/* Date of Birth & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="user-dob">Date of Birth</Label>
                <Input
                  id="user-dob"
                  type="date"
                  className={errors.dateOfBirth ? "border-destructive" : ""}
                  {...register("dateOfBirth")}
                />
                {errors.dateOfBirth && (
                  <p className="text-sm text-destructive">
                    {errors.dateOfBirth.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="user-phone">Phone Number</Label>
                <Input
                  id="user-phone"
                  type="tel"
                  placeholder="Enter phone number"
                  className={errors.phoneNumber ? "border-destructive" : ""}
                  {...register("phoneNumber")}
                />
                {errors.phoneNumber && (
                  <p className="text-sm text-destructive">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>
            </div>

            {/* Roles Selection - Only show in edit mode */}
            {isEditMode && (
              <div className="space-y-2">
                <Label>Roles</Label>
                <div className="border rounded-md p-4 space-y-2">
                  {roles.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Loading roles...
                    </p>
                  ) : (
                    roles.map((role) => (
                      <div
                        key={role.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`role-${role.id}`}
                          checked={selectedRoles?.includes(role.id) || false}
                          onCheckedChange={() => handleRoleToggle(role.id)}
                        />
                        <label
                          htmlFor={`role-${role.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {role.name}
                          {role.description && (
                            <span className="text-muted-foreground ml-2">
                              - {role.description}
                            </span>
                          )}
                        </label>
                      </div>
                    ))
                  )}
                </div>
                {errors.roleIds && (
                  <p className="text-sm text-destructive">
                    {errors.roleIds.message}
                  </p>
                )}
              </div>
            )}

            {/* Status Checkbox */}
            <div className="space-y-2 pb-6">
              <Label>Status</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="user-active"
                  checked={isActive}
                  onCheckedChange={(checked) =>
                    setValue("active", checked as boolean)
                  }
                />
                <label
                  htmlFor="user-active"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Active
                </label>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-4 border-t pt-6">
          <Button
            type="button"
            variant="outline"
            className="text-muted-foreground"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            <FaTimes /> Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            <FaSave />
            {(() => {
              if (isSubmitting) {
                return isEditMode ? "Updating..." : "Creating...";
              }
              return isEditMode ? "Update" : "Save";
            })()}
          </Button>
        </CardFooter>
      </form>
    </CardWrap>
  );
};

export default UserForm;
