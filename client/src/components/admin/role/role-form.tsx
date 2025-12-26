import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CardWrap,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FaSync, FaSave } from "react-icons/fa";

const RoleForm = () => {
  return (
    <CardWrap>
      <CardHeader className="border-b">
        <CardTitle>Add Role</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col gap-6 flex-1">
            <div className="space-y-2">
              <Label htmlFor="role-name">Name</Label>
              <Input id="role-name" placeholder="Enter role name" />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex items-center space-x-2">
                <Checkbox id="new-role-active" />
                <Label htmlFor="new-role-active">Active</Label>
              </div>
            </div>
          </div>

          <div className="space-y-2 flex-1">
            <Label htmlFor="role-desc">Description</Label>
            <Textarea
              id="role-desc"
              placeholder="Enter description"
              className="min-h-[120px]"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-4 border-t pt-6">
        <Button variant="outline" className="text-muted-foreground">
          <FaSync /> Cancel
        </Button>
        <Button>
          <FaSave /> Save
        </Button>
      </CardFooter>
    </CardWrap>
  );
};

export default RoleForm;
