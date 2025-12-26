import QuestionSearchFilter from "@/components/admin/question/question-search-filter";
import QuestionTable from "@/components/admin/question/question-table";
import QuestionForm from "@/components/admin/question/question-form";
import AnswerTable from "@/components/admin/question/answer-table";
import AnswerForm from "@/components/admin/question/answer-form";

const QUESTIONS = [
  {
    id: 1,
    content: "Who is the inventor of the airplane?",
    type: "MultipleChoice",
    answers: 4,
    status: "Yes",
  },
  {
    id: 2,
    content: "Who is the inventor of the World Wide Web?",
    type: "MultipleChoice",
    answers: 4,
    status: "Yes",
  },
  {
    id: 3,
    content: "Where is Viet Nam?",
    type: "MultipleChoice",
    answers: 4,
    status: "Yes",
  },
  {
    id: 4,
    content: "What is the capital of France?",
    type: "SingleChoice",
    answers: 4,
    status: "cell",
  },
  {
    id: 5,
    content: "Who is the inventor of the alternating current?",
    type: "MultipleChoice",
    answers: 4,
    status: "cell",
  },
];

const ANSWERS = [
  { id: 1, content: "Wright brothers", isCorrect: "True", status: "Yes" },
  {
    id: 2,
    content: "Alexander Graham Bell",
    isCorrect: "False",
    status: "Yes",
  },
  { id: 3, content: "Albert Einstein", isCorrect: "False", status: "Yes" },
  { id: 4, content: "Charles Babbage", isCorrect: "False", status: "cell" },
];

const QuestionManagementPage = () => {
  return (
    <div className="space-y-4">
      <QuestionSearchFilter />
      <QuestionTable questions={QUESTIONS} />
      <QuestionForm />
      <AnswerTable answers={ANSWERS} />
      <AnswerForm />
    </div>
  );
};

export default QuestionManagementPage;
