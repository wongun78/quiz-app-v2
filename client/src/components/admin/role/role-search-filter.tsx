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
import { Authorize } from "@/components/auth";

interface RoleSearchFilterProps {
  onSearch: (params: { name?: string; status?: boolean }) => void;
  onClear: () => void;
  onCreate: () => void;
}

const RoleSearchFilter = ({
  onSearch,
  onClear,
  onCreate,
}: RoleSearchFilterProps) => {
  const [searchName, setSearchName] = useState<string>("");
  const [activeOnly, setActiveOnly] = useState<boolean>(false);

  const handleSearch = () => {
    onSearch({
      name: searchName.trim() || undefined,
      status: activeOnly ? true : undefined,
    });
  };

  const handleClear = () => {
    setSearchName("");
    setActiveOnly(false);
    onClear();
  };

  return (
    <CardWrap>
      <CardHeader>
        <CardTitle>Role Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="space-y-2 flex-1">
            <Label htmlFor="search-role-name">Role Name</Label>
            <Input
              id="search-role-name"
              type="text"
              placeholder="Enter role name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <div className="space-y-2 flex-1">
            <Label>Status</Label>
            <div className="flex items-center space-x-2">
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
        <Authorize action="create" resource="role">
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

export default RoleSearchFilter;
