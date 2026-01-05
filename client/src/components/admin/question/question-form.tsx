import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { FaTimes, FaSave } from "react-icons/fa";
import { questionSchema, type AnswerFormData } from "@/validations";
import { useCreateQuestion, useUpdateQuestion } from "@/hooks";
import type { QuestionResponse } from "@/types/backend";

interface QuestionFormProps {
  question: QuestionResponse | null;
  answers: AnswerFormData[];
  onClose: () => void;
  onSuccess: () => void;
}

const QuestionForm = ({
  question,
  answers,
  onClose,
  onSuccess,
}: QuestionFormProps) => {
  const isEditMode = !!question;
  const createQuestion = useCreateQuestion();
  const updateQuestion = useUpdateQuestion();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      content: question?.content || "",
      type: question?.type || "SINGLE_CHOICE",
      score: question?.score || 10,
      active: true,
    },
  });

  const selectedType = watch("type");

  useEffect(() => {
    if (question) {
      reset({
        content: question.content,
        type: question.type,
        score: question.score,
      });
      setValue("active", true);
    }
  }, [question, reset, setValue]);

  const onSubmit = async () => {
    if (!answers || answers.length === 0) {
      toast.error("At least one answer is required");
      return;
    }

    if (!answers.some((answer) => answer.isCorrect)) {
      toast.error("At least one answer must be marked as correct");
      return;
    }

    const data = {
      content: watch("content"),
      type: watch("type"),
      score: 10,
      answers: answers.map((a) => ({
        id: a.id || undefined,
        content: a.content,
        isCorrect: a.isCorrect,
      })),
    };

    if (isEditMode && question) {
      updateQuestion.mutate(
        { id: question.id, data: data as any },
        {
          onSuccess: () => {
            reset();
            onSuccess();
          },
        }
      );
    } else {
      createQuestion.mutate(data as any, {
        onSuccess: () => {
          reset();
          onSuccess();
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
        <CardTitle>{isEditMode ? "Edit Question" : "Add Question"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <div className="space-y-6">
            {/* Question Content & Type */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="space-y-2 flex-1 pb-6">
                <Label htmlFor="question-content">
                  Content <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="question-content"
                  placeholder="Enter question content"
                  className={`min-h-[100px] ${
                    errors.content ? "border-destructive" : ""
                  }`}
                  {...register("content")}
                />
                {errors.content && (
                  <p className="text-sm text-destructive">
                    {errors.content.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 flex-1">
                <Label htmlFor="question-type">
                  Question Type <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={selectedType}
                  onValueChange={(value) =>
                    setValue(
                      "type",
                      value as "SINGLE_CHOICE" | "MULTIPLE_CHOICE"
                    )
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Question Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SINGLE_CHOICE">Single Choice</SelectItem>
                    <SelectItem value="MULTIPLE_CHOICE">
                      Multiple Choice
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-sm text-destructive">
                    {errors.type.message}
                  </p>
                )}
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
            <FaSave />{" "}
            {(() => {
              if (isSubmitting) return "Saving...";
              return isEditMode ? "Update" : "Save";
            })()}
          </Button>
        </CardFooter>
      </form>
    </CardWrap>
  );
};

export default QuestionForm;
