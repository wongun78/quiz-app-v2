import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardWrap,
  CardTitle,
} from "@/components/ui/card";
import { FaTimes, FaSave } from "react-icons/fa";
import { answerSchema, type AnswerFormData } from "@/validations";

interface AnswerFormProps {
  answer: AnswerFormData | null;
  onSave: (data: AnswerFormData) => void;
  onCancel: () => void;
}

const AnswerForm = ({ answer, onSave, onCancel }: AnswerFormProps) => {
  const isEditMode = answer !== null;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(answerSchema),
    defaultValues: {
      content: "",
      isCorrect: false,
      active: true,
    },
  });

  const isCorrect = watch("isCorrect");
  const isActive = watch("active");

  useEffect(() => {
    if (answer) {
      reset({
        id: answer.id,
        content: answer.content,
        isCorrect: answer.isCorrect,
        active: answer.active ?? true,
      });
    } else {
      reset({
        content: "",
        isCorrect: false,
        active: true,
      });
    }
  }, [answer, reset]);

  const onSubmit = (data: AnswerFormData) => {
    onSave(data);
    reset({
      content: "",
      isCorrect: false,
      active: true,
    });
  };

  const handleCancel = () => {
    reset({
      content: "",
      isCorrect: false,
      active: true,
    });
    onCancel();
  };
  return (
    <CardWrap>
      <CardHeader className="border-b">
        <CardTitle>{isEditMode ? "Edit Answer" : "Add Answer"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="answer-content">
                Content <span className="text-destructive">*</span>
              </Label>
              <Input
                id="answer-content"
                placeholder="Enter answer content"
                className={errors.content ? "border-destructive" : ""}
                {...register("content")}
              />
              {errors.content && (
                <p className="text-sm text-destructive">
                  {errors.content.message}
                </p>
              )}
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="space-y-2 flex-1 pb-6">
                <Label>Is Correct?</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ans-correct"
                    checked={isCorrect}
                    onCheckedChange={(checked) =>
                      setValue("isCorrect", checked as boolean)
                    }
                  />
                  <Label htmlFor="ans-correct" className="cursor-pointer">
                    Yes
                  </Label>
                </div>
              </div>

              <div className="space-y-2 flex-1">
                <Label>Status</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ans-active"
                    checked={isActive}
                    onCheckedChange={(checked) =>
                      setValue("active", checked as boolean)
                    }
                  />
                  <Label htmlFor="ans-active" className="cursor-pointer">
                    Active
                  </Label>
                </div>
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
          >
            <FaTimes /> Cancel
          </Button>
          <Button type="submit">
            <FaSave /> {isEditMode ? "Update" : "Save"}
          </Button>
        </CardFooter>
      </form>
    </CardWrap>
  );
};

export default AnswerForm;
