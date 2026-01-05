import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  FaAngleDoubleLeft,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleRight,
  FaTrash,
} from "react-icons/fa";
import type { QuestionResponse } from "@/types/backend";
import { questionService, quizService } from "@/services";
import { toast } from "react-toastify";

interface QuestionTableProps {
  quizId?: string;
  onQuestionsChange?: (questions: Array<{ id: string; order: number }>) => void;
  selectedType?: string;
}

const QuestionTable = ({
  quizId,
  onQuestionsChange,
  selectedType = "all",
}: QuestionTableProps) => {
  const [allQuestions, setAllQuestions] = useState<QuestionResponse[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<
    QuestionResponse[]
  >([]);
  const [questionsInQuiz, setQuestionsInQuiz] = useState<Set<string>>(
    new Set()
  );
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAllQuestions();
  }, []);

  useEffect(() => {
    if (quizId) {
      fetchQuestionsInQuiz();
    }
  }, [quizId]);

  useEffect(() => {
    filterQuestions();
  }, [allQuestions, selectedType]);

  const fetchAllQuestions = async () => {
    setIsLoading(true);
    try {
      const response = await questionService.getAll({ page: 0, size: 1000 });
      setAllQuestions(response.content);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Failed to fetch questions";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchQuestionsInQuiz = async () => {
    if (!quizId) return;

    try {
      const data = await quizService.getQuestions(quizId);
      setQuestionsInQuiz(new Set(data.map((q) => q.id)));
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Failed to fetch quiz questions";
      toast.error(errorMessage);
    }
  };

  const filterQuestions = () => {
    let filtered = allQuestions;
    if (selectedType && selectedType !== "all") {
      filtered = allQuestions.filter((q) => q.type === selectedType);
    }
    setFilteredQuestions(filtered);

    onQuestionsChange?.(
      filtered.map((q, index) => ({ id: q.id, order: index + 1 }))
    );
  };

  const handleRemoveQuestion = async (questionId: string) => {
    if (!quizId) return;

    try {
      await quizService.removeQuestion(quizId, questionId);
      toast.success("Question removed from quiz");
      await fetchQuestionsInQuiz();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Failed to remove question";
      toast.error(errorMessage);
    }
  };

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number.parseInt(value, 10));
    setCurrentPage(0);
  };

  const paginatedQuestions = filteredQuestions.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );
  const totalPages = Math.ceil(filteredQuestions.length / pageSize);

  if (isLoading) {
    return (
      <CardWrap>
        <CardHeader className="border-b">
          <CardTitle>Question List</CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center text-muted-foreground">
          Loading questions...
        </CardContent>
      </CardWrap>
    );
  }

  return (
    <CardWrap>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="pl-6">Content</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="hidden md:table-cell">Answer</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right pr-6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuestions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground py-8"
                >
                  No questions available
                </TableCell>
              </TableRow>
            ) : (
              paginatedQuestions.map((question) => {
                const index = filteredQuestions.findIndex(
                  (q) => q.id === question.id
                );
                const isInQuiz = questionsInQuiz.has(question.id);
                return (
                  <TableRow
                    key={question.id}
                    className={`even:bg-muted/30 ${
                      isInQuiz
                        ? "bg-primary/10 hover:bg-primary/15 font-semibold"
                        : ""
                    }`}
                  >
                    <TableCell className="font-medium pl-6">
                      {question.content}
                    </TableCell>
                    <TableCell>{question.type}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {question.answers?.length || 0}
                    </TableCell>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          isInQuiz
                            ? "bg-primary/20 text-primary border-primary/30"
                            : "bg-muted/50 text-muted-foreground border-muted"
                        }
                      >
                        {isInQuiz ? "In Quiz" : "Available"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end">
                        {quizId && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleRemoveQuestion(question.id)}
                            disabled={!isInQuiz}
                            title={
                              isInQuiz ? "Remove from quiz" : "Not in quiz"
                            }
                          >
                            <FaTrash />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
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
                onClick={() => setCurrentPage(0)}
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
                onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
              >
                <FaAngleLeft />
              </Button>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href="#"
                isActive
                className="rounded-full border-primary bg-primary text-primary-foreground hover:bg-primary/90"
              >
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href="#"
                className="rounded-full border-primary text-primary hover:bg-primary/10"
              >
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href="#"
                className="rounded-full border-primary text-primary hover:bg-primary/10"
              >
                3
              </PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full border-primary text-primary hover:bg-primary/10"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
                }
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
                onClick={() => setCurrentPage(totalPages - 1)}
                disabled={currentPage >= totalPages - 1}
              >
                <FaAngleDoubleRight />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        <div className="text-sm text-muted-foreground hidden md:block">
          {currentPage * pageSize + 1}-
          {Math.min((currentPage + 1) * pageSize, filteredQuestions.length)} of{" "}
          {filteredQuestions.length}
        </div>
      </CardFooter>
    </CardWrap>
  );
};

export default QuestionTable;
