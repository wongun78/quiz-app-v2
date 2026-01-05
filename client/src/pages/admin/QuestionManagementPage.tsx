import { useState } from "react";
import QuestionSearchFilter from "@/components/admin/question/question-search-filter";
import QuestionTable from "@/components/admin/question/question-table";
import QuestionForm from "@/components/admin/question/question-form";
import AnswerTable from "@/components/admin/question/answer-table";
import AnswerForm from "@/components/admin/question/answer-form";
import { useQuestions } from "@/hooks";
import type { QuestionResponse } from "@/types/backend";
import type { AnswerFormData } from "@/validations";

const QuestionManagementPage = () => {
  const [searchContent, setSearchContent] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selectedQuestion, setSelectedQuestion] =
    useState<QuestionResponse | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(
    null
  );
  const [currentAnswers, setCurrentAnswers] = useState<AnswerFormData[]>([]);

  const { data, isLoading, error, refetch } = useQuestions({
    content: searchContent || undefined,
    type: selectedType || undefined,
    page: currentPage,
    size: pageSize,
  });

  const questions = data?.content || [];
  const totalPages = data?.totalPages || 0;
  const totalElements = data?.totalElements || 0;

  const handleSearch = (params: { content?: string; type?: string }) => {
    setSearchContent(params.content || "");
    setSelectedType(params.type || "");
    setCurrentPage(0);
  };

  const handleClearSearch = () => {
    setSearchContent("");
    setSelectedType("");
    setCurrentPage(0);
  };

  const handleCreate = () => {
    setSelectedQuestion(null);
    setCurrentAnswers([]);
    setIsFormOpen(true);
  };

  const handleEdit = (question: QuestionResponse) => {
    setSelectedQuestion(question);
    setCurrentAnswers(
      question.answers?.map((a) => ({
        id: a.id,
        content: a.content,
        isCorrect: a.isCorrect,
        active: true,
      })) || []
    );
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setSelectedQuestion(null);
    setCurrentAnswers([]);
    setIsFormOpen(false);
  };

  const handleFormSuccess = () => {
    if (!selectedQuestion) {
      setCurrentPage(0);
    }
    handleFormClose();
  };

  const handleAddAnswer = () => {
    setSelectedAnswerIndex(null);
  };

  const handleEditAnswer = (index: number) => {
    setSelectedAnswerIndex(index);
  };

  const handleDeleteAnswer = (index: number) => {
    setCurrentAnswers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveAnswer = (data: AnswerFormData) => {
    if (selectedAnswerIndex === null) {
      setCurrentAnswers((prev) => [
        ...prev,
        { ...data, id: crypto.randomUUID() },
      ]);
    } else {
      setCurrentAnswers((prev) =>
        prev.map((ans, i) =>
          i === selectedAnswerIndex ? { ...data, id: ans.id } : ans
        )
      );
    }
    setSelectedAnswerIndex(null);
  };

  const handleCancelAnswer = () => {
    setSelectedAnswerIndex(null);
  };

  return (
    <div className="space-y-4">
      <QuestionSearchFilter
        onSearch={handleSearch}
        onClear={handleClearSearch}
        onCreate={handleCreate}
      />
      <QuestionTable
        questions={questions}
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
          <QuestionForm
            question={selectedQuestion}
            answers={currentAnswers}
            onClose={handleFormClose}
            onSuccess={handleFormSuccess}
          />
          <AnswerTable
            answers={currentAnswers}
            onEdit={handleEditAnswer}
            onDelete={handleDeleteAnswer}
            onAdd={handleAddAnswer}
          />
          <AnswerForm
            answer={
              selectedAnswerIndex === null
                ? null
                : currentAnswers[selectedAnswerIndex]
            }
            onSave={handleSaveAnswer}
            onCancel={handleCancelAnswer}
          />
        </>
      )}
    </div>
  );
};

export default QuestionManagementPage;
