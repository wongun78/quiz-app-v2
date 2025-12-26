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
import { FaPlus, FaSync } from "react-icons/fa";

const UserForm = () => {
  return (
    <CardWrap>
      <CardHeader className="border-b">
        <CardTitle>Add User</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>First Name</Label>
            <Input placeholder="Enter first name" />
          </div>
          <div className="space-y-2">
            <Label>Last Name</Label>
            <Input placeholder="Enter last name" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" placeholder="Enter email" />
          </div>
          <div className="space-y-2">
            <Label>Username</Label>
            <Input placeholder="Enter username" />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input type="password" placeholder="Enter password" />
          </div>
          <div className="space-y-2">
            <Label>Confirm Password</Label>
            <Input type="password" placeholder="Confirm password" />
          </div>
          <div className="space-y-2">
            <Label>Date of Birth</Label>
            <Input type="date" placeholder="Enter date of birth" />
          </div>
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input placeholder="Enter phone number" />
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
      <CardFooter className="flex justify-end gap-4 border-t pt-6">
        <Button variant="outline" className="text-muted-foreground">
          <FaSync /> Cancel
        </Button>
        <Button>
          <FaPlus /> Save
        </Button>
      </CardFooter>
    </CardWrap>
  );
};

export default UserForm;
