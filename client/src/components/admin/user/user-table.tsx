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
import type { UserResponse } from "@/types/backend";
import { userService } from "@/services";
import { Authorize } from "@/components/auth";

interface UserTableProps {
  users: UserResponse[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onEdit: (user: UserResponse) => void;
  onDelete?: () => void;
}

const UserTable = ({
  users,
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
}: UserTableProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (user: UserResponse) => {
    const confirmed = await confirmDialog({
      title: "Delete User",
      description: `Are you sure you want to delete user "${
        user.fullName || user.email
      }"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive",
    });

    if (!confirmed) return;

    setDeletingId(user.id);
    try {
      await userService.delete(user.id);
      toast.success("User deleted successfully");
      onDelete?.();
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to delete user";
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
          Error loading users: {error}
        </CardContent>
      </CardWrap>
    );
  }

  return (
    <CardWrap>
      <CardHeader className="border-b">
        <CardTitle>User List</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="pl-6">Full Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead>Username</TableHead>
              <TableHead className="hidden md:table-cell">Phone</TableHead>
              <TableHead className="hidden lg:table-cell">Roles</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right pr-6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  Loading users...
                </TableCell>
              </TableRow>
            ) : (
              (() => {
                if (users.length === 0) {
                  return (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="h-32 text-center text-muted-foreground"
                      >
                        No users found
                      </TableCell>
                    </TableRow>
                  );
                }
                return users.map((user) => (
                  <TableRow key={user.id} className="even:bg-muted/30">
                    <TableCell className="font-medium pl-6">
                      {user.fullName || `${user.firstName} ${user.lastName}`}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {user.email}
                    </TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {user.phoneNumber || "N/A"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {user.roles && user.roles.length > 0 ? (
                          user.roles.map((role) => (
                            <Badge
                              key={role}
                              variant="secondary"
                              className="text-xs"
                            >
                              {role}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            No roles
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          user.active
                            ? "bg-success/20 text-success border-success/30"
                            : "bg-destructive/20 text-destructive border-destructive/30"
                        }
                      >
                        {user.active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end gap-1">
                        <Authorize action="edit" resource="user">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                            onClick={() => onEdit(user)}
                            disabled={deletingId === user.id}
                          >
                            <FaEdit />
                          </Button>
                        </Authorize>
                        <Authorize action="delete" resource="user">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(user)}
                            disabled={deletingId === user.id}
                          >
                            {deletingId === user.id ? "..." : <FaTrash />}
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
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
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
                disabled={currentPage === 0 || isLoading}
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
                disabled={currentPage === 0 || isLoading}
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
                disabled={currentPage >= totalPages - 1 || isLoading}
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
                disabled={currentPage >= totalPages - 1 || isLoading}
              >
                <FaAngleDoubleRight />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        <div className="text-sm text-muted-foreground hidden md:block">
          {currentPage * pageSize + 1}-
          {Math.min((currentPage + 1) * pageSize, totalElements)} of{" "}
          {totalElements}
        </div>
      </CardFooter>
    </CardWrap>
  );
};

export default UserTable;
