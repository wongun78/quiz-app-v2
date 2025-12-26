import QuizSearchFilter from "@/components/admin/quiz/quiz-search-filter";
import QuizTable from "@/components/admin/quiz/quiz-table";
import QuizForm from "@/components/admin/quiz/quiz-form";
import QuestionTable from "@/components/admin/quiz/question-table";
import QuestionForm from "@/components/admin/quiz/question-form";
import type { Question } from "@/types/question";
import type { Quiz } from "@/types/quiz";

import quiz1Img from "@/assets/images/quizzes/quiz-1.png";
import quiz2Img from "@/assets/images/quizzes/quiz-2.png";
import quiz3Img from "@/assets/images/quizzes/quiz-3.png";

const QUIZZES: Quiz[] = [
  {
    id: "1",
    title: "General Knowledge Quiz",
    description: "A quiz to test your general knowledge.",
    duration: "10M",
    status: "active",
    image: quiz1Img,
  },
  {
    id: "2",
    title: "Science Quiz",
    description: "A quiz focused on scientific facts and concepts.",
    duration: "15M",
    status: "active",
    image: quiz2Img,
  },
  {
    id: "3",
    title: "Science Quiz",
    description: "A quiz focused on scientific facts and concepts.",
    duration: "15M",
    status: "inactive",
    image: quiz3Img,
  },
];

const QUESTIONS: Question[] = [
  {
    id: "1",
    content: "Who is the CEO of Tesla?",
    type: "Multiple Choice",
    answer: "Elon Musk",
    order: "1",
    status: "Active",
  },
  {
    id: "2",
    content: "What is the capital of France?",
    type: "Multiple Choice",
    answer: "Paris",
    order: "2",
    status: "Active",
  },
  {
    id: "3",
    content: "What is 2 + 2?",
    type: "Single Answer",
    answer: "4",
    order: "3",
    status: "Active",
  },
  {
    id: "4",
    content: "Is React a JavaScript library?",
    type: "True/False",
    answer: "True",
    order: "4",
    status: "Active",
  },
  {
    id: "5",
    content: "What is the largest planet in our solar system?",
    type: "Multiple Choice",
    answer: "Jupiter",
    order: "5",
    status: "Inactive",
  },
];

const QuizManagementPage = () => {
  return (
    <div className="space-y-4">
      <QuizSearchFilter />
      <QuizTable quizzes={QUIZZES} />
      <QuizForm />
      <QuestionTable questions={QUESTIONS} />
      <QuestionForm />
    </div>
  );
};

export default QuizManagementPage;
