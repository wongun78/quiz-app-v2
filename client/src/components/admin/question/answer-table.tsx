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
import type { AnswerFormData } from "@/validations";

interface AnswerTableProps {
  answers: AnswerFormData[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  onAdd: () => void;
}

const AnswerTable = ({
  answers,
  onEdit,
  onDelete,
  onAdd,
}: AnswerTableProps) => {
  return (
    <CardWrap>
      <CardHeader className="border-b">
        <CardTitle>Answer List</CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        {answers.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            No answers added yet
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="pl-6 w-[60%]">Content</TableHead>
                <TableHead>Is Correct</TableHead>
                <TableHead className="text-right pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {answers.map((answer, index) => (
                <TableRow
                  key={`answer-${index}-${answer.content}`}
                  className="even:bg-muted/30"
                >
                  <TableCell className="pl-6">{answer.content}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        answer.isCorrect
                          ? "bg-success/20 text-success border-success/30"
                          : "bg-muted text-muted-foreground border-muted-foreground/30"
                      }
                    >
                      {answer.isCorrect ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                        onClick={() => onEdit(index)}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => onDelete(index)}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <div className="pt-2 px-2 flex justify-end border-t">
          <Button onClick={onAdd}>
            <FaPlus /> Add
          </Button>
        </div>
      </CardContent>
    </CardWrap>
  );
};

export default AnswerTable;
