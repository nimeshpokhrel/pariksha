"use client";

import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Circle,
  Clock,
  BookOpen,
  Eye,
  RotateCcw,
  Menu,
  ChevronUp,
  ChevronDown,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import RenderKatex from "./RenderKatex";
import UploadThingImage from "./UploadThingImage";

export default function TestReview({
  testData = [],
  title,
  setTestStatus,
  score,
}) {
  // State to store the processed test data
  const [processedData, setProcessedData] = useState({});
  const [activeSubject, setActiveSubject] = useState("");
  const [activeQuestionBySubject, setActiveQuestionBySubject] = useState({});
  const [showSolutions, setShowSolutions] = useState({});
  const [isFloatingNavOpen, setIsFloatingNavOpen] = useState(false);
  const [shouldEnableScroll, setShouldEnableScroll] = useState(false);

  const questionRefs = useRef({});

  // Process the test data when it's received
  useEffect(() => {
    if (testData.length === 0) return;

    // Process the data into a more usable format
    const processed = {};
    const initialActiveQuestions = {};

    testData.forEach((subject) => {
      const subjectKey = subject.subject.toLowerCase().replace(/\s+/g, "-");
      processed[subjectKey] = {
        name: subject.subject,
        shortName: subject.subject.split(" ")[0],
        questions: subject.questions.map((q) => ({
          id: q.question._id,
          questionText: q.question.questionText,
          image: q.question.image,
          options: q.question.answers.map((answer) => ({
            id: answer._id,
            text: answer.text,
            type: answer.type,
          })),
          correctAnswer: q.question.correctAnswer,
          userAnswer: q.userAnswer || null,
          solution: q.question.solution,
        })),
        totalMarks: subject.subjectTotalMarks,
        marks: subject.subjectMarks,
      };

      // Set the first question of each subject as active
      if (subject.questions.length > 0) {
        initialActiveQuestions[subjectKey] = subject.questions[0].question._id;
      }
    });

    setProcessedData(processed);
    setActiveQuestionBySubject(initialActiveQuestions);

    // Set the first subject as active
    if (Object.keys(processed).length > 0) {
      setActiveSubject(Object.keys(processed)[0]);
    }
  }, [testData]);

  // Completely disable initial scroll
  useEffect(() => {
    // Only enable scrolling after user interaction
    const enableScrollAfterInteraction = () => {
      setShouldEnableScroll(true);
      window.removeEventListener("click", enableScrollAfterInteraction);
    };

    window.addEventListener("click", enableScrollAfterInteraction);

    return () => {
      window.removeEventListener("click", enableScrollAfterInteraction);
    };
  }, []);

  // Only scroll when explicitly triggered by user actions
  useEffect(() => {
    if (
      !shouldEnableScroll ||
      !activeSubject ||
      !activeQuestionBySubject[activeSubject]
    )
      return;

    const activeQuestionId = activeQuestionBySubject[activeSubject];
    if (activeQuestionId && questionRefs.current[activeQuestionId]) {
      questionRefs.current[activeQuestionId]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [activeQuestionBySubject, activeSubject, shouldEnableScroll]);

  // If no data or still processing, show a message
  if (Object.keys(processedData).length === 0 || !activeSubject) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold">Loading test data...</h2>
          <p className="text-gray-500">
            Please wait while we prepare your test review.
          </p>
        </div>
      </div>
    );
  }

  const currentSubjectData = processedData[activeSubject];
  const activeQuestionId = activeQuestionBySubject[activeSubject];

  const getAnswerStatus = (question) => {
    if (!question.userAnswer) return "unanswered";
    return question.userAnswer === question.correctAnswer
      ? "correct"
      : "incorrect";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "correct":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "incorrect":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "unanswered":
        return <Circle className="h-4 w-4 text-gray-400" />;
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "correct":
        return "Correct";
      case "incorrect":
        return "Incorrect";
      case "unanswered":
        return "Not Answered";
      default:
        return "";
    }
  };

  const getSubjectStats = (subjectKey) => {
    const questions = processedData[subjectKey].questions;
    const correct = questions.filter(
      (q) => getAnswerStatus(q) === "correct"
    ).length;
    const incorrect = questions.filter(
      (q) => getAnswerStatus(q) === "incorrect"
    ).length;
    const unanswered = questions.filter(
      (q) => getAnswerStatus(q) === "unanswered"
    ).length;
    return { correct, incorrect, unanswered, total: questions.length };
  };

  const toggleSolution = (questionId) => {
    setShowSolutions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const scrollToQuestion = (questionId) => {
    setShouldEnableScroll(true);

    setActiveQuestionBySubject((prev) => ({
      ...prev,
      [activeSubject]: questionId,
    }));

    setIsFloatingNavOpen(false);

    if (questionRefs.current[questionId]) {
      questionRefs.current[questionId]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleSubjectChange = (newSubject) => {
    setShouldEnableScroll(true);
    setActiveSubject(newSubject);
    setIsFloatingNavOpen(false);
  };

  const getCurrentQuestionIndex = () => {
    return (
      currentSubjectData.questions.findIndex((q) => q.id === activeQuestionId) +
      1
    );
  };

  const navigateToQuestion = (direction) => {
    setShouldEnableScroll(true);

    const currentIndex = currentSubjectData.questions.findIndex(
      (q) => q.id === activeQuestionId
    );
    let newIndex = currentIndex;

    if (direction === "prev" && currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else if (
      direction === "next" &&
      currentIndex < currentSubjectData.questions.length - 1
    ) {
      newIndex = currentIndex + 1;
    }

    if (newIndex !== currentIndex) {
      scrollToQuestion(currentSubjectData.questions[newIndex].id);
    }
  };

  return (
    <div className="content-container min-h-screen bg-white">
      <div className="mx-auto max-w-6xl">
        <div className="relative grid grid-cols-1 lg:grid-cols-4 lg:gap-8">
          {/* Question Navigation Sidebar - Hidden on mobile */}
          <div className="flex justify-end lg:col-span-1">
            <div className="fixed top-[100px] hidden lg:block">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Compact Subject Selector */}
                  <div className="space-y-2">
                    <Select
                      value={activeSubject}
                      onValueChange={handleSubjectChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue>
                          <div className="flex w-full items-center justify-between">
                            <span>{currentSubjectData.name}</span>
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(processedData).map(([key, subject]) => {
                          const stats = getSubjectStats(key);
                          return (
                            <SelectItem key={key} value={key}>
                              <div className="flex w-full items-center justify-between">
                                <span>{subject.name}</span>
                                <div className="ml-4 flex gap-2 text-xs">
                                  <span className="text-green-600">
                                    {stats.correct}
                                  </span>
                                  <span className="text-red-600">
                                    {stats.incorrect}
                                  </span>
                                  <span className="text-gray-400">
                                    {stats.unanswered}
                                  </span>
                                </div>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Question Grid */}
                  <div className="grid grid-cols-5 gap-2">
                    {currentSubjectData.questions.map((question, index) => {
                      const questionStatus = getAnswerStatus(question);
                      let buttonClass =
                        "w-8 h-8 text-xs font-medium rounded border ";

                      if (question.id === activeQuestionId) {
                        buttonClass += "bg-blue-600 text-white border-blue-600";
                      } else if (questionStatus === "correct") {
                        buttonClass +=
                          "bg-green-100 text-green-800 border-green-200 hover:bg-green-200";
                      } else if (questionStatus === "incorrect") {
                        buttonClass +=
                          "bg-red-100 text-red-800 border-red-200 hover:bg-red-200";
                      } else {
                        buttonClass +=
                          "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200";
                      }

                      return (
                        <button
                          key={question.id}
                          className={buttonClass}
                          onClick={() => scrollToQuestion(question.id)}
                        >
                          {index + 1}
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Question Area */}
          <div className="col-span-1 pt-3 lg:col-span-3 lg:pt-6">
            <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600"
                onClick={() => setTestStatus("summary")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Results
              </Button>
              <div className="flex w-full items-center justify-between gap-8 text-sm text-gray-500 md:w-max">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>{title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>{score}</span>
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                <div className="flex items-center gap-4">
                  <h1 className="text-xl font-semibold text-gray-900">
                    {currentSubjectData.name}
                  </h1>
                </div>

                <div className="flex gap-2">
                  {(() => {
                    const stats = getSubjectStats(activeSubject);
                    return (
                      <>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          {stats.correct} Correct
                        </Badge>
                        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                          {stats.incorrect} Incorrect
                        </Badge>
                        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                          {stats.unanswered} Unanswered
                        </Badge>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* All Questions */}
              {currentSubjectData.questions.map((question, index) => {
                const status = getAnswerStatus(question);
                const showSolution = showSolutions[question.id] || false;

                return (
                  <div
                    key={question.id}
                    ref={(el) => (questionRefs.current[question.id] = el)}
                    id={`question-${question.id}`}
                    className={`scroll-mt-8 ${question.id === activeQuestionId ? "rounded-xl ring-2 ring-primary/40" : ""}`}
                  >
                    <Card className="border border-gray-200">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <CardTitle className="flex items-start gap-3 text-base font-medium text-gray-900">
                            <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-medium">
                              {index + 1}
                            </span>
                            <span className="pt-0.5">
                              <RenderKatex text={question.questionText} />
                            </span>
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Question Image if available */}
                        {question.image && (
                          <div className="h-48 w-full overflow-hidden rounded-lg bg-gray-100">
                            {question.image ? (
                              <UploadThingImage
                                src={`${question.image}`}
                                alt={`Question Image`}
                                width={250}
                                height={250}
                                className="h-full w-full object-contain"
                              />
                            ) : null}
                          </div>
                        )}

                        {/* Options */}
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                          {question.options.map((option) => {
                            const isCorrect =
                              option.id === question.correctAnswer;
                            const isUserAnswer =
                              option.id === question.userAnswer;

                            let optionClass = "p-3 rounded-lg border text-sm ";
                            if (isCorrect) {
                              optionClass +=
                                "bg-green-50 border-green-200 text-green-800";
                            } else if (isUserAnswer && !isCorrect) {
                              optionClass +=
                                "bg-red-50 border-red-200 text-red-800";
                            } else {
                              optionClass +=
                                "bg-gray-50 border-gray-200 text-gray-700";
                            }

                            return (
                              <div key={option.id} className={optionClass}>
                                <div className="flex items-center justify-between gap-2">
                                  {option.type === "image" ? (
                                    <UploadThingImage
                                      src={`${option.text}`}
                                      alt={`Answer`}
                                      width={100}
                                      height={100}
                                    />
                                  ) : (
                                    <RenderKatex text={option.text} />
                                  )}
                                  {isCorrect && (
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  )}
                                  {isUserAnswer && !isCorrect && (
                                    <XCircle className="h-4 w-4 text-red-600" />
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Status and Solution Button - Justified Between */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {(() => {
                              const badgeClass =
                                status === "correct"
                                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                                  : status === "incorrect"
                                    ? "bg-red-100 text-red-800 hover:bg-red-100"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-100";

                              return (
                                <Badge className={badgeClass}>
                                  <div className="flex items-center gap-1.5">
                                    {getStatusIcon(status)}
                                    <span>{getStatusText(status)}</span>
                                  </div>
                                </Badge>
                              );
                            })()}
                          </div>

                          <Button
                            variant={showSolution ? "outline" : "default"}
                            onClick={() => toggleSolution(question.id)}
                            className="flex items-center gap-2"
                            disabled={!question.solution}
                          >
                            {showSolution ? (
                              <>
                                <RotateCcw className="h-4 w-4" />
                                Hide Solution
                              </>
                            ) : (
                              <>
                                <Eye className="h-4 w-4" />
                                View Solution
                              </>
                            )}
                          </Button>
                        </div>

                        {showSolution && question.solution && (
                          <div className="rounded-lg bg-blue-50 p-4">
                            <h4 className="mb-3 font-medium text-blue-900">
                              Solution
                            </h4>
                            <div className="h-64 w-full overflow-hidden rounded-lg bg-gray-100">
                              <UploadThingImage
                                src={question.solution}
                                alt="Solution"
                                className="h-full w-full object-contain"
                                loading="lazy"
                              />
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Floating Navigation for Mobile */}
        <div className="lg:hidden">
          {/* Floating Navigation Button */}
          <div className="fixed bottom-6 right-6 z-50">
            <Sheet open={isFloatingNavOpen} onOpenChange={setIsFloatingNavOpen}>
              <SheetTrigger asChild>
                <Button
                  size="lg"
                  className="h-14 w-14 rounded-full p-0 shadow-lg"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[80vh] pt-9">
                <SheetHeader>
                  <SheetTitle className="flex items-center justify-between">
                    <span>Question Navigation</span>
                    <span className="text-sm font-normal text-gray-500">
                      {getCurrentQuestionIndex()} of{" "}
                      {currentSubjectData.questions.length}
                    </span>
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  {/* Subject Selector */}
                  <Select
                    value={activeSubject}
                    onValueChange={handleSubjectChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue>
                        <span>{currentSubjectData.name}</span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(processedData).map(([key, subject]) => (
                        <SelectItem key={key} value={key}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Quick Navigation */}
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateToQuestion("prev")}
                      disabled={getCurrentQuestionIndex() === 1}
                    >
                      <ChevronUp className="mr-2 h-4 w-4" />
                      Previous
                    </Button>
                    <span className="text-sm text-gray-600">
                      Question {getCurrentQuestionIndex()}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateToQuestion("next")}
                      disabled={
                        getCurrentQuestionIndex() ===
                        currentSubjectData.questions.length
                      }
                    >
                      Next
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </div>

                  {/* Question Grid */}
                  <div className="grid grid-cols-5 gap-3">
                    {currentSubjectData.questions.map((question, index) => {
                      const questionStatus = getAnswerStatus(question);
                      let buttonClass =
                        "w-12 h-12 text-sm font-medium rounded border ";

                      if (question.id === activeQuestionId) {
                        buttonClass += "bg-blue-600 text-white border-blue-600";
                      } else if (questionStatus === "correct") {
                        buttonClass +=
                          "bg-green-100 text-green-800 border-green-200";
                      } else if (questionStatus === "incorrect") {
                        buttonClass += "bg-red-100 text-red-800 border-red-200";
                      } else {
                        buttonClass +=
                          "bg-gray-100 text-gray-600 border-gray-200";
                      }

                      return (
                        <button
                          key={question.id}
                          className={buttonClass}
                          onClick={() => scrollToQuestion(question.id)}
                        >
                          {index + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Floating Quick Navigation */}
          <div className="fixed bottom-6 left-6 z-40">
            <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white p-2 shadow-lg">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateToQuestion("prev")}
                disabled={getCurrentQuestionIndex() === 1}
                className="h-8 w-8 rounded-full p-0"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <span className="px-2 text-xs font-medium text-gray-600">
                {getCurrentQuestionIndex()}/
                {currentSubjectData.questions.length}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateToQuestion("next")}
                disabled={
                  getCurrentQuestionIndex() ===
                  currentSubjectData.questions.length
                }
                className="h-8 w-8 rounded-full p-0"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
