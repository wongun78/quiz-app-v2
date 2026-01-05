import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CardWrap,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FaTimes, FaSave } from "react-icons/fa";
import { roleSchema, type RoleFormData } from "@/validations";
import { useCreateRole, useUpdateRole } from "@/hooks";
import type { RoleResponse } from "@/types/backend";

interface RoleFormProps {
  role: RoleResponse | null;
  onClose: () => void;
  onSuccess: () => void;
}

const RoleForm = ({ role, onClose, onSuccess }: RoleFormProps) => {
  const isEditMode = !!role;
  const createRole = useCreateRole();
  const updateRole = useUpdateRole();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: role?.name || "",
      description: role?.description || "",
    },
  });

  const isActive = watch("isActive");

  useEffect(() => {
    if (role) {
      reset({
        name: role.name,
        description: role.description || "",
      });
      setValue("isActive", !role.isDeleted);
    }
  }, [role, reset, setValue]);

  const onSubmit = async (data: RoleFormData) => {
    if (isEditMode && role) {
      updateRole.mutate(
        { id: role.id, data },
        {
          onSuccess: () => {
            reset();
            onSuccess();
            onClose();
          },
        }
      );
    } else {
      createRole.mutate(data, {
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

  return (
    <CardWrap>
      <CardHeader className="border-b">
        <CardTitle>{isEditMode ? "Edit Role" : "Add Role"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <div className="space-y-6">
            {/* Role Name Input */}
            <div className="space-y-2">
              <Label htmlFor="role-name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="role-name"
                type="text"
                placeholder="Enter role name"
                className={errors.name ? "border-destructive" : ""}
                {...register("name")}
                disabled={isEditMode}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="role-desc">Description</Label>
              <Textarea
                id="role-desc"
                placeholder="Enter role description"
                className={`min-h-[120px] ${
                  errors.description ? "border-destructive" : ""
                }`}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Status Checkbox */}
            <div className="space-y-2 pb-6">
              <Label>Status</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="role-active"
                  checked={isActive}
                  onCheckedChange={(checked) =>
                    setValue("isActive", checked as boolean)
                  }
                />
                <label
                  htmlFor="role-active"
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

export default RoleForm;
