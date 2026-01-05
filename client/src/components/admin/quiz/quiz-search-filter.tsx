import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardWrap,
  CardTitle,
} from "@/components/ui/card";
import { FaPlus, FaSync, FaSearch } from "react-icons/fa";
import { Authorize } from "@/components/auth";

interface QuizSearchFilterProps {
  onSearch: (params: { title?: string; active?: boolean }) => void;
  onClear: () => void;
  onCreate: () => void;
}

const QuizSearchFilter = ({
  onSearch,
  onClear,
  onCreate,
}: QuizSearchFilterProps) => {
  const [title, setTitle] = useState("");
  const [active, setActive] = useState(false);

  const handleSearch = () => {
    onSearch({ title, active });
  };

  const handleClear = () => {
    setTitle("");
    setActive(false);
    onClear();
  };

  return (
    <CardWrap>
      <CardHeader className="border-b">
        <CardTitle>Quiz Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex md:flex-row gap-4">
          <div className="space-y-2 flex-1">
            <Label htmlFor="search-title">Title</Label>
            <Input
              id="search-title"
              placeholder="Enter quiz title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="search-type">Type</Label>
            <div className="flex space-x-2 pt-2">
              <Checkbox
                id="status-filter"
                checked={active}
                onCheckedChange={(checked) => setActive(checked === true)}
              />
              <Label htmlFor="status-filter">Active</Label>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col-reverse md:flex-row md:justify-between gap-4 border-t">
        <Authorize action="create" resource="quiz">
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

export default QuizSearchFilter;
