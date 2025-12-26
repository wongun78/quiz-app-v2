import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CardContent,
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
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

interface Answer {
  id: number;
  content: string;
  isCorrect: string;
  status: string;
}

interface AnswerTableProps {
  answers: Answer[];
}

const AnswerTable = ({ answers }: AnswerTableProps) => {
  return (
    <CardWrap>
      <CardHeader className="border-b">
        <CardTitle>Answer List</CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="pl-6 w-[40%]">Content</TableHead>
              <TableHead>Is Correct</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right pr-6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {answers.map((answer) => (
              <TableRow key={answer.id} className="even:bg-muted/30">
                <TableCell className="pl-6">{answer.content}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      answer.isCorrect === "True"
                        ? "bg-success/20 text-success border-success/30"
                        : "bg-muted text-muted-foreground border-muted-foreground/30"
                    }
                  >
                    {answer.isCorrect}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      answer.status === "Yes"
                        ? "bg-success/20 text-success border-success/30"
                        : "bg-muted text-muted-foreground border-muted-foreground/30"
                    }
                  >
                    {answer.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                    >
                      <FaEdit />
                    </Button>
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

        <div className="pt-2 px-2 flex justify-end border-t ">
          <Button>
            <FaPlus /> Add
          </Button>
        </div>
      </CardContent>
    </CardWrap>
  );
};

export default AnswerTable;
