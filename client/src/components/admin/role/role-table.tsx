import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardWrap,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FaEdit,
  FaTrash,
  FaAngleDoubleLeft,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleRight,
} from "react-icons/fa";

interface Role {
  id: number;
  name: string;
  description: string;
  status: string;
}

interface RoleTableProps {
  roles: Role[];
}

const RoleTable = ({ roles }: RoleTableProps) => {
  return (
    <CardWrap>
      <CardHeader className="border-b">
        <CardTitle>Role List</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="pl-6 w-[200px]">Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right pr-6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id} className="even:bg-muted/30">
                <TableCell className="pl-6 font-medium">{role.name}</TableCell>
                <TableCell>{role.description}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      role.status === "Yes"
                        ? "bg-success/20 text-success border-success/30"
                        : "bg-muted text-muted-foreground border-muted-foreground/30"
                    }
                  >
                    {role.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>Items per page:</span>
          <Select defaultValue="10">
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Pagination className="w-auto">
          <PaginationContent>
            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full border-primary text-primary hover:bg-primary/10"
              >
                <FaAngleDoubleLeft />
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full border-primary text-primary hover:bg-primary/10"
              >
                <FaAngleLeft />
              </Button>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href="#"
                isActive
                className="rounded-full border-primary bg-primary text-primary-foreground hover:bg-primary/90"
              >
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href="#"
                className="rounded-full border-primary text-primary hover:bg-primary/10"
              >
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href="#"
                className="rounded-full border-primary text-primary hover:bg-primary/10"
              >
                3
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full border-primary text-primary hover:bg-primary/10"
              >
                <FaAngleRight />
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full border-primary text-primary hover:bg-primary/10"
              >
                <FaAngleDoubleRight />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        <span className="text-sm text-muted-foreground hidden md:block">
          1-{roles.length} of 32
        </span>
      </CardFooter>
    </CardWrap>
  );
};

export default RoleTable;
