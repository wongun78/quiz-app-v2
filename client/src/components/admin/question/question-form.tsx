import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaSync, FaSave, FaPlus } from "react-icons/fa";

const QuestionForm = () => {
  return (
    <CardWrap>
      <CardHeader className="border-b">
        <CardTitle>Add Question</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="space-y-2 flex-1">
              <Label>Content</Label>
              <Textarea
                placeholder="Enter question content"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2 flex-1">
              <Label>Question Type</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Question Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiple">Multiple Choice</SelectItem>
                  <SelectItem value="single">Single Choice</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <div className="flex items-center space-x-2">
              <Checkbox id="new-q-active" />
              <Label htmlFor="new-q-active">Active</Label>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col-reverse md:flex-row md:justify-between gap-4 border-t pt-6">
        <Button>
          <FaPlus /> Show Answers
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" className="text-muted-foreground">
            <FaSync /> Cancel
          </Button>
          <Button>
            <FaSave /> Save
          </Button>
        </div>
      </CardFooter>
    </CardWrap>
  );
};

export default QuestionForm;
