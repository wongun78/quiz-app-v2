import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { confirmDialog } from "@/components/shared/ConfirmDialog";
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardWrap,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FaEdit,
  FaTrash,
  FaAngleDoubleLeft,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleRight,
} from "react-icons/fa";
import { toast } from "react-toastify";
import type { RoleResponse } from "@/types/backend";
import { roleService } from "@/services";
import { Authorize } from "@/components/auth";

interface RoleTableProps {
  roles: RoleResponse[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onEdit: (role: RoleResponse) => void;
  onDelete?: () => void;
}

const RoleTable = ({
  roles,
  isLoading,
  error,
  currentPage,
  pageSize,
  totalPages,
  totalElements,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onDelete,
}: RoleTableProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (role: RoleResponse) => {
    const confirmed = await confirmDialog({
      title: "Delete Role",
      description: `Are you sure you want to delete role "${role.name}"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive",
    });

    if (!confirmed) return;

    setDeletingId(role.id);
    try {
      await roleService.delete(role.id);
      toast.success("Role deleted successfully");
      onDelete?.();
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to delete role";
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  const handlePageSizeChange = (value: string) => {
    onPageSizeChange(Number.parseInt(value, 10));
    onPageChange(0);
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 3;
    let startPage = Math.max(0, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    if (currentPage === 0) {
      endPage = Math.min(totalPages - 1, maxVisiblePages - 1);
    } else if (currentPage === totalPages - 1) {
      startPage = Math.max(0, totalPages - maxVisiblePages);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onPageChange(i);
            }}
            isActive={i === currentPage}
            className={
              i === currentPage
                ? "rounded-full border-primary bg-primary text-primary-foreground hover:bg-primary/90"
                : "rounded-full border-primary text-primary hover:bg-primary/10"
            }
          >
            {i + 1}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pages;
  };

  if (error) {
    return (
      <CardWrap>
        <CardContent className="py-8 text-center text-destructive">
          Error loading roles: {error}
        </CardContent>
      </CardWrap>
    );
  }

  return (
    <CardWrap>
      <CardHeader className="border-b">
        <CardTitle>Role List</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="pl-6 w-[200px]">Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right pr-6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              (() => {
                if (roles.length === 0) {
                  return (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No roles found
                      </TableCell>
                    </TableRow>
                  );
                }
                return roles.map((role) => (
                  <TableRow key={role.id} className="even:bg-muted/30">
                    <TableCell className="pl-6 font-medium">
                      {role.name}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {role.description || "No description"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          role.isDeleted
                            ? "bg-destructive/20 text-destructive border-destructive/30"
                            : "bg-success/20 text-success border-success/30"
                        }
                      >
                        {role.isDeleted ? "Inactive" : "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end gap-1">
                        <Authorize action="edit" resource="role">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                            onClick={() => onEdit(role)}
                            disabled={deletingId === role.id}
                          >
                            <FaEdit />
                          </Button>
                        </Authorize>
                        <Authorize action="delete" resource="role">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(role)}
                            disabled={deletingId === role.id}
                          >
                            <FaTrash />
                          </Button>
                        </Authorize>
                      </div>
                    </TableCell>
                  </TableRow>
                ));
              })()
            )}
          </TableBody>
        </Table>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>Items per page:</span>
          <Select
            value={pageSize.toString()}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize.toString()} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Pagination className="w-auto">
          <PaginationContent>
            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full border-primary text-primary hover:bg-primary/10"
                onClick={() => onPageChange(0)}
                disabled={currentPage === 0}
              >
                <FaAngleDoubleLeft />
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full border-primary text-primary hover:bg-primary/10"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 0}
              >
                <FaAngleLeft />
              </Button>
            </PaginationItem>
            {renderPagination()}
            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full border-primary text-primary hover:bg-primary/10"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
              >
                <FaAngleRight />
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full border-primary text-primary hover:bg-primary/10"
                onClick={() => onPageChange(totalPages - 1)}
                disabled={currentPage >= totalPages - 1}
              >
                <FaAngleDoubleRight />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        <span className="text-sm text-muted-foreground hidden md:block">
          {roles.length > 0
            ? `${currentPage * pageSize + 1}-${Math.min(
                (currentPage + 1) * pageSize,
                totalElements
              )} of ${totalElements}`
            : "0 of 0"}
        </span>
      </CardFooter>
    </CardWrap>
  );
};

export default RoleTable;
