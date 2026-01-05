import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardWrap,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FaSync, FaSave } from "react-icons/fa";
import { quizService } from "@/services";
import { toast } from "react-toastify";

interface QuestionFormProps {
  quizId?: string;
  availableQuestions: Array<{ id: string; order: number }>;
  selectedType?: string;
  onTypeChange?: (type: string) => void;
  onSuccess?: () => void;
}

const QuestionForm = ({
  quizId,
  availableQuestions = [],
  selectedType = "all",
  onTypeChange,
  onSuccess,
}: QuestionFormProps) => {
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  const handleClear = () => {
    setOrderNumber("");
  };

  const handleSave = async () => {
    if (!quizId) {
      toast.error("Please select or create a quiz first");
      return;
    }

    const order = Number.parseInt(orderNumber, 10);
    if (!orderNumber || Number.isNaN(order) || order < 1) {
      toast.error("Please enter a valid order number (1 or greater)");
      return;
    }

    if (order > availableQuestions.length) {
      toast.error(
        `Order number must be between 1 and ${availableQuestions.length}`
      );
      return;
    }

    const questionToAdd = availableQuestions[order - 1];
    if (!questionToAdd) {
      toast.error("Question not found at this order");
      return;
    }

    setIsSaving(true);
    try {
      await quizService.addQuestions(quizId, [questionToAdd.id]);
      toast.success(`Question #${order} added to quiz successfully`);
      handleClear();
      onSuccess?.();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Failed to add question";
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  if (!quizId) {
    return (
      <CardWrap>
        <CardHeader className="border-b">
          <CardTitle>Add Question</CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center text-muted-foreground">
          Please select or create a quiz first
        </CardContent>
      </CardWrap>
    );
  }

  return (
    <CardWrap>
      <CardHeader className="border-b">
        <CardTitle>Add Question</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-6 md:flex-col">
          <div className="flex flex-row gap-4">
            <div className="space-y-2 flex-1">
              <Label>Question Type</Label>
              <Select value={selectedType} onValueChange={onTypeChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="MULTIPLE_CHOICE">
                    Multiple Choice
                  </SelectItem>
                  <SelectItem value="SINGLE_CHOICE">Single Choice</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 flex-1">
              <Label>Order</Label>
              <Input
                type="number"
                min="1"
                max={availableQuestions.length}
                placeholder={`Enter order`}
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                disabled={isSaving}
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col-reverse md:flex-row md:justify-between gap-4 border-t pt-6">
        <div></div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="text-muted-foreground"
            onClick={handleClear}
            disabled={isSaving}
          >
            <FaSync /> Clear
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !orderNumber}>
            <FaSave /> {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </CardFooter>
    </CardWrap>
  );
};

export default QuestionForm;
