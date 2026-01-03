import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardWrap,
  CardTitle,
} from "@/components/ui/card";
import { FaPlus, FaSync, FaSearch } from "react-icons/fa";

interface UserSearchFilterProps {
  onSearch: (params: { fullName?: string; active?: boolean }) => void;
  onClear: () => void;
  onCreate: () => void;
}

const UserSearchFilter = ({
  onSearch,
  onClear,
  onCreate,
}: UserSearchFilterProps) => {
  const [searchFullName, setSearchFullName] = useState<string>("");
  const [activeOnly, setActiveOnly] = useState<boolean>(false);

  const handleSearch = () => {
    onSearch({
      fullName: searchFullName.trim() || undefined,
      active: activeOnly ? true : undefined,
    });
  };

  const handleClear = () => {
    setSearchFullName("");
    setActiveOnly(false);
    onClear();
  };

  return (
    <CardWrap>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="space-y-2 flex-1">
            <Label htmlFor="search-user-fullname">Full Name</Label>
            <Input
              id="search-user-fullname"
              type="text"
              placeholder="Enter full name to search..."
              value={searchFullName}
              onChange={(e) => setSearchFullName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <div className="space-y-2 flex-1">
            <Label>Status</Label>
            <div className="flex items-center space-x-2 h-10">
              <Checkbox
                id="active-only"
                checked={activeOnly}
                onCheckedChange={(checked) => setActiveOnly(checked as boolean)}
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
      </CardContent>
      <CardFooter className="flex flex-col-reverse md:flex-row md:justify-between gap-4 border-t pt-6">
        <Button onClick={onCreate}>
          <FaPlus /> Create User
        </Button>

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

export default UserSearchFilter;
