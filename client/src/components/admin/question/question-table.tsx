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
import type { QuestionResponse } from "@/types/backend";
import { questionService } from "@/services";
import { Authorize } from "@/components/auth";

interface QuestionTableProps {
  questions: QuestionResponse[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onEdit: (question: QuestionResponse) => void;
  onDelete?: () => void;
}

const QuestionTable = ({
  questions,
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
}: QuestionTableProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (question: QuestionResponse) => {
    const confirmed = await confirmDialog({
      title: "Delete Question",
      description: `Are you sure you want to delete question "${question.content.substring(
        0,
        50
      )}..."? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive",
    });

    if (!confirmed) return;

    setDeletingId(question.id);
    try {
      await questionService.delete(question.id);
      toast.success("Question deleted successfully");
      onDelete?.();
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Failed to delete question";
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
        <CardContent className="py-8">
          <div className="text-center text-destructive">
            <p className="font-semibold">Error loading questions</p>
            <p className="text-sm mt-2">{error}</p>
          </div>
        </CardContent>
      </CardWrap>
    );
  }

  return (
    <CardWrap>
      <CardHeader className="border-b">
        <CardTitle>Question List</CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        {(() => {
          if (isLoading) {
            return (
              <div className="py-8 text-center text-muted-foreground">
                Loading questions...
              </div>
            );
          }
          if (questions.length === 0) {
            return (
              <div className="py-8 text-center text-muted-foreground">
                No questions found
              </div>
            );
          }
          return (
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="pl-6 w-[40%]">Content</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-center">Score</TableHead>
                  <TableHead className="text-center">Answers</TableHead>
                  <TableHead className="text-right pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {questions.map((question) => (
                  <TableRow key={question.id} className="even:bg-muted/30">
                    <TableCell className="font-medium pl-6">
                      {question.content}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          question.type === "SINGLE_CHOICE"
                            ? "bg-blue-500/20 text-blue-700 border-blue-500/30"
                            : "bg-purple-500/20 text-purple-700 border-purple-500/30"
                        }
                      >
                        {question.type === "SINGLE_CHOICE"
                          ? "Single"
                          : "Multiple"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {question.score}
                    </TableCell>
                    <TableCell className="text-center">
                      {question.answers?.length || 0}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end gap-1">
                        <Authorize action="edit" resource="question">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                            onClick={() => onEdit(question)}
                            disabled={deletingId === question.id}
                          >
                            <FaEdit />
                          </Button>
                        </Authorize>
                        <Authorize action="delete" resource="question">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(question)}
                            disabled={deletingId === question.id}
                          >
                            <FaTrash />
                          </Button>
                        </Authorize>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          );
        })()}
      </CardContent>

      {!isLoading && questions.length > 0 && (
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
            {currentPage * pageSize + 1}-
            {Math.min((currentPage + 1) * pageSize, totalElements)} of{" "}
            {totalElements}
          </div>
        </CardFooter>
      )}
    </CardWrap>
  );
};

export default QuestionTable;
