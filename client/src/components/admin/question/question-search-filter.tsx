import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardWrap,
  CardTitle,
} from "@/components/ui/card";
import { FaPlus, FaSync, FaSearch } from "react-icons/fa";
import { Authorize } from "@/components/auth";

interface QuestionSearchFilterProps {
  onSearch: (params: { content?: string; type?: string }) => void;
  onClear: () => void;
  onCreate: () => void;
}

const QuestionSearchFilter = ({
  onSearch,
  onClear,
  onCreate,
}: QuestionSearchFilterProps) => {
  const [content, setContent] = useState("");
  const [type, setType] = useState("ALL");
  const [activeOnly, setActiveOnly] = useState(false);

  const handleSearch = () => {
    onSearch({
      content: content || undefined,
      type: type === "ALL" ? undefined : type,
    });
  };

  const handleClear = () => {
    setContent("");
    setType("ALL");
    setActiveOnly(false);
    onClear();
  };

  return (
    <CardWrap>
      <CardHeader>
        <CardTitle>Question Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="space-y-2 flex-1">
              <Label htmlFor="search-content">Content</Label>
              <Input
                id="search-content"
                placeholder="Enter question content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <div className="space-y-2 flex-1">
              <Label>Type</Label>
              <Select value={type || "ALL"} onValueChange={setType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>
                  <SelectItem value="SINGLE_CHOICE">Single Choice</SelectItem>
                  <SelectItem value="MULTIPLE_CHOICE">
                    Multiple Choice
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="space-y-2 flex-1">
              <Label>Status</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="active-only"
                  checked={activeOnly}
                  onCheckedChange={(checked) =>
                    setActiveOnly(checked as boolean)
                  }
                />
                <label
                  htmlFor="active-only"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Active
                </label>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col-reverse md:flex-row md:justify-between gap-4 border-t pt-6">
        <Authorize action="create" resource="question">
          <Button onClick={onCreate}>
            <FaPlus /> Create
          </Button>
        </Authorize>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="text-muted-foreground"
            onClick={handleClear}
          >
            <FaSync /> Clear
          </Button>
          <Button onClick={handleSearch}>
            <FaSearch /> Search
          </Button>
        </div>
      </CardFooter>
    </CardWrap>
  );
};

export default QuestionSearchFilter;
