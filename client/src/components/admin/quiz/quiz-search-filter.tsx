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

const QuizSearchFilter = () => {
  return (
    <CardWrap>
      <CardHeader className="border-b">
        <CardTitle>Quiz Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex md:flex-row gap-4 pb-3">
          <div className="space-y-2 flex-1">
            <Label htmlFor="search-title">Title</Label>
            <Input id="search-title" placeholder="Enter quiz title to search" />
          </div>
          <div className="flex-1">
            <Label htmlFor="search-type">Type</Label>
            <div className="flex space-x-2 pt-2">
              <Checkbox id="status-filter" />
              <Label htmlFor="status-filter">Active</Label>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col-reverse md:flex-row md:justify-between gap-4 border-t">
        <Button>
          <FaPlus /> Create
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" className="text-muted-foreground">
            <FaSync /> Clear
          </Button>
          <Button>
            <FaSearch /> Search
          </Button>
        </div>
      </CardFooter>
    </CardWrap>
  );
};

export default QuizSearchFilter;
