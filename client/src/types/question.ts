export interface Question {
  id: string | number;
  content: string;
  type: string;
  answer?: string;
  answers?: number;
  order?: string;
  status: string;
}
