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
import { FaPlus, FaSync, FaSave } from "react-icons/fa";

const QuizForm = () => {
  return (
    <CardWrap>
      <CardHeader className="border-b">
        <CardTitle>Add Quiz</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-6 md:flex-col">
          <div className="flex flex-row gap-4">
            <div className="space-y-2 flex-1">
              <Label>Title</Label>
              <Input placeholder="Enter quiz title" />
            </div>
            <div className="space-y-2 flex-1">
              <Label>Description</Label>
              <Textarea
                id="description"
                placeholder="Enter quiz description"
                className="min-h-20"
              />
            </div>
          </div>
          <div className="flex flex-row gap-4">
            <div className="space-y-2 flex-1">
              <Label>Duration</Label>
              <Input placeholder="Enter duration" />
            </div>
            <div className="space-y-2 flex-1">
              <Label>Thumbnail URL</Label>
              <Input placeholder="Enter thumbnail URL" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <div className="flex items-center space-x-2">
              <Checkbox id="new-status" />
              <Label htmlFor="new-status">Active</Label>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col-reverse md:flex-row md:justify-between gap-4 border-t pt-6">
        <Button>
          <FaPlus /> Show Questions
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" className="text-muted-foreground">
            <FaSync /> Clear
          </Button>
          <Button>
            <FaSave /> Save
          </Button>
        </div>
      </CardFooter>
    </CardWrap>
  );
};

export default QuizForm;
