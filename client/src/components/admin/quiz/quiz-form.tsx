import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardWrap,
  CardTitle,
} from "@/components/ui/card";
import { FaTimes, FaSave } from "react-icons/fa";
import { quizSchema, type QuizFormData } from "@/validations";
import { useCreateQuiz, useUpdateQuiz } from "@/hooks";
import type { QuizResponse } from "@/types/backend";

interface QuizFormProps {
  quiz: QuizResponse | null;
  onClose: () => void;
  onSuccess: () => void;
}

const QuizForm = ({ quiz, onClose, onSuccess }: QuizFormProps) => {
  const isEditMode = !!quiz;
  const createQuiz = useCreateQuiz();
  const updateQuiz = useUpdateQuiz();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: quiz?.title || "",
      description: quiz?.description || "",
      durationMinutes: quiz?.durationMinutes || 10,
      active: quiz?.active ?? false,
    },
  });

  useEffect(() => {
    if (quiz) {
      reset({
        title: quiz.title,
        description: quiz.description,
        durationMinutes: quiz.durationMinutes,
        active: quiz.active,
      });
    }
  }, [quiz, reset]);

  const onSubmit = async (data: QuizFormData) => {
    if (isEditMode && quiz) {
      updateQuiz.mutate(
        { id: quiz.id, data },
        {
          onSuccess: () => {
            reset();
            onSuccess();
          },
        }
      );
    } else {
      createQuiz.mutate(data, {
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
        <CardTitle>{isEditMode ? "Edit Quiz" : "Add Quiz"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <div className="flex gap-6 md:flex-col">
            <div className="flex flex-row gap-4">
              <div className="space-y-2 flex-1">
                <Label>
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="Enter quiz title"
                  className={errors.title ? "border-destructive" : ""}
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">
                    {errors.title.message}
                  </p>
                )}
              </div>
              <div className="space-y-2 flex-1">
                <Label>
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Enter quiz description"
                  className={`min-h-20 ${
                    errors.description ? "border-destructive" : ""
                  }`}
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-row gap-4">
              <div className="space-y-2 flex-1">
                <Label>
                  Duration (minutes) <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="number"
                  placeholder="Enter duration"
                  className={errors.durationMinutes ? "border-destructive" : ""}
                  {...register("durationMinutes", { valueAsNumber: true })}
                />
                {errors.durationMinutes && (
                  <p className="text-sm text-destructive">
                    {errors.durationMinutes.message}
                  </p>
                )}
              </div>
              <div className="space-y-2 flex-1">
                <Label>Thumbnail URL</Label>
                <Input
                  placeholder="Enter thumbnail URL (optional)"
                  disabled
                  value="Hardcoded images used"
                />
              </div>
            </div>
            <div className="space-y-2 pb-6">
              <Label>Status</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="new-status"
                  checked={watch("active")}
                  onCheckedChange={(checked) =>
                    setValue("active", checked === true)
                  }
                />
                <Label htmlFor="new-status">Active</Label>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col-reverse md:flex-row md:justify-end gap-4 border-t pt-6">
          <Button
            type="button"
            variant="outline"
            className="text-muted-foreground"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            <FaTimes /> Cancel
          </Button>
          <Button
            type="submit"
            disabled={
              isSubmitting || createQuiz.isPending || updateQuiz.isPending
            }
          >
            <FaSave />{" "}
            {(() => {
              const isPending =
                isSubmitting || createQuiz.isPending || updateQuiz.isPending;
              if (isPending) return "Saving...";
              return isEditMode ? "Update" : "Save";
            })()}
          </Button>
        </CardFooter>
      </form>
    </CardWrap>
  );
};

export default QuizForm;
