import { useState } from "react";
import QuizSearchFilter from "@/components/admin/quiz/quiz-search-filter";
import QuizTable from "@/components/admin/quiz/quiz-table";
import QuizForm from "@/components/admin/quiz/quiz-form";
import QuestionTable from "@/components/admin/quiz/question-table";
import QuestionForm from "@/components/admin/quiz/question-form";
import { useQuizzes } from "@/hooks";
import type { QuizResponse } from "@/types/backend";

const QuizManagementPage = () => {
  const [searchTitle, setSearchTitle] = useState<string>("");
  const [activeOnly, setActiveOnly] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizResponse | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [questionType, setQuestionType] = useState<string>("all");
  const [availableQuestions, setAvailableQuestions] = useState<
    Array<{ id: string; order: number }>
  >([]);
  const [questionTableKey, setQuestionTableKey] = useState(0);

  const { data, isLoading, error, refetch } = useQuizzes({
    title: searchTitle || undefined,
    active: activeOnly ? true : undefined,
    page: currentPage,
    size: pageSize,
  });

  const quizzes = data?.content || [];
  const totalPages = data?.totalPages || 0;
  const totalElements = data?.totalElements || 0;

  const handleSearch = (params: { title?: string; active?: boolean }) => {
    setSearchTitle(params.title || "");
    setActiveOnly(params.active || false);
    setCurrentPage(0);
  };

  const handleClearSearch = () => {
    setSearchTitle("");
    setActiveOnly(false);
    setCurrentPage(0);
  };

  const handleCreate = () => {
    setSelectedQuiz(null);
    setIsFormOpen(true);
  };

  const handleEdit = (quiz: QuizResponse) => {
    setSelectedQuiz(quiz);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setSelectedQuiz(null);
    setIsFormOpen(false);
  };

  const handleFormSuccess = () => {
    if (!selectedQuiz) {
      setCurrentPage(0);
    }
    handleFormClose();
  };

  const handleQuestionAddSuccess = () => {
    setQuestionTableKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-4">
      <QuizSearchFilter
        onSearch={handleSearch}
        onClear={handleClearSearch}
        onCreate={handleCreate}
      />
      <QuizTable
        quizzes={quizzes}
        isLoading={isLoading}
        error={error ? String(error) : null}
        currentPage={currentPage}
        pageSize={pageSize}
        totalPages={totalPages}
        totalElements={totalElements}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        onEdit={handleEdit}
        onDelete={refetch}
      />
      {isFormOpen && (
        <>
          <QuizForm
            quiz={selectedQuiz}
            onClose={handleFormClose}
            onSuccess={handleFormSuccess}
          />
          {selectedQuiz && (
            <>
              <QuestionTable
                key={questionTableKey}
                quizId={selectedQuiz.id}
                onQuestionsChange={setAvailableQuestions}
                selectedType={questionType}
              />
              <QuestionForm
                quizId={selectedQuiz.id}
                availableQuestions={availableQuestions}
                selectedType={questionType}
                onTypeChange={setQuestionType}
                onSuccess={handleQuestionAddSuccess}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default QuizManagementPage;
