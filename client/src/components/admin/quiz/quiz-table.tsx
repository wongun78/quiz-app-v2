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
import type { QuizResponse } from "@/types/backend";
import { quizService } from "@/services";
import { getQuizDuration } from "@/types/mock";
import { Authorize } from "@/components/auth";

const QUIZ_PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=400&h=300&fit=crop&q=80";

interface QuizTableProps {
  quizzes: QuizResponse[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onEdit: (quiz: QuizResponse) => void;
  onDelete?: () => void;
}

const QuizTable = ({
  quizzes,
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
}: QuizTableProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (quiz: QuizResponse) => {
    const confirmed = await confirmDialog({
      title: "Delete Quiz",
      description: `Are you sure you want to delete quiz "${quiz.title}"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive",
    });

    if (!confirmed) return;

    setDeletingId(quiz.id);
    try {
      await quizService.delete(quiz.id);
      toast.success("Quiz deleted successfully");
      onDelete?.();
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to delete quiz";
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
        </PaginationItem>,
      );
    }

    return pages;
  };

  if (error) {
    return (
      <CardWrap>
        <CardContent className="py-8">
          <div className="text-center text-destructive">
            <p className="font-semibold">Error loading quizzes</p>
            <p className="text-sm mt-2">{error}</p>
          </div>
        </CardContent>
      </CardWrap>
    );
  }

  if (isLoading) {
    return (
      <CardWrap>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">
            Loading quizzes...
          </div>
        </CardContent>
      </CardWrap>
    );
  }
  return (
    <CardWrap>
      <CardHeader className="border-b">
        <CardTitle>Quiz List</CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="pl-6">Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="hidden md:table-cell">Duration</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="text-right pr-6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quizzes.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  No quizzes found
                </TableCell>
              </TableRow>
            ) : (
              quizzes.map((quiz) => (
                <TableRow key={quiz.id} className="even:bg-muted/30">
                  <TableCell className="pl-6">
                    <div className="w-20 overflow-hidden">
                      <img src={QUIZ_PLACEHOLDER_IMAGE} alt={quiz.title} />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium max-w-xs truncate">
                    {quiz.title}
                  </TableCell>
                  <TableCell>{quiz.description}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {getQuizDuration(quiz)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        quiz.active
                          ? "bg-success/20 text-success border-success/30"
                          : "bg-destructive/20 text-destructive border-destructive/30"
                      }
                    >
                      {quiz.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex justify-end gap-1">
                      <Authorize action="edit" resource="quiz">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                          onClick={() => onEdit(quiz)}
                        >
                          <FaEdit />
                        </Button>
                      </Authorize>
                      <Authorize action="delete" resource="quiz">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(quiz)}
                          disabled={deletingId === quiz.id}
                        >
                          <FaTrash />
                        </Button>
                      </Authorize>
                    </div>
                  </TableCell>
                </TableRow>
              ))
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
              <SelectValue placeholder="10" />
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

        <div className="text-sm text-muted-foreground hidden md:block">
          {quizzes.length > 0
            ? `${currentPage * pageSize + 1}-${Math.min(
                (currentPage + 1) * pageSize,
                totalElements,
              )} of ${totalElements}`
            : "0 of 0"}
        </div>
      </CardFooter>
    </CardWrap>
  );
};

export default QuizTable;
