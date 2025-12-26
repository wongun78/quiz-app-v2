export interface Quiz {
  id: string;
  title: string;
  description: string;
  duration: string;
  status: "active" | "inactive";
  image: string;
}
