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
  PaginationEllipsis,
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
  FaTrash,
  FaAngleDoubleLeft,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleRight,
} from "react-icons/fa";
import type { Question } from "@/types/question";

interface QuestionTableProps {
  questions: Question[];
}

const QuestionTable = ({ questions }: QuestionTableProps) => {
  return (
    <CardWrap>
      <CardHeader className="border-b">
        <CardTitle>Question List</CardTitle>
      </CardHeader>

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
            {questions.map((question) => (
              <TableRow key={question.id} className="even:bg-muted/30">
                <TableCell className="font-medium pl-6">
                  {question.content}
                </TableCell>
                <TableCell>{question.type}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {question.answer}
                </TableCell>
                <TableCell>{question.order}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      question.status === "Active"
                        ? "bg-success/20 text-success border-success/30"
                        : "bg-destructive/20 text-destructive border-destructive/30"
                    }
                  >
                    {question.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>Items per page:</span>
          <Select defaultValue="10">
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
              >
                <FaAngleDoubleLeft />
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full border-primary text-primary hover:bg-primary/10"
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
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full border-primary text-primary hover:bg-primary/10"
              >
                <FaAngleRight />
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full border-primary text-primary hover:bg-primary/10"
              >
                <FaAngleDoubleRight />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        <div className="text-sm text-muted-foreground hidden md:block">
          1-{questions.length} of 32
        </div>
      </CardFooter>
    </CardWrap>
  );
};

export default QuestionTable;
