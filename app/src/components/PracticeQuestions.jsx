"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  ChevronRight,
  HelpCircle,
  Eye,
  Check,
  CircleCheckBig,
} from "lucide-react";
import UploadThingImage from "./UploadThingImage";
import RenderKatex from "./RenderKatex";
import { useMutation } from "@tanstack/react-query";
import { addSolvedQuestion } from "@/hooks/practiceQuestion";

export default function PracticeQuestions({
  questions,
  courseTitle,
  allQuestionsSolved,
  subjects,
  topics,
}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerId, setSelectedAnswerId] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  // Get current subject and question
  const addToSolvedQuestions = useMutation({
    mutationFn: (id) => addSolvedQuestion({ questionId: id }),
  });

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isCorrect = selectedAnswerId === currentQuestion?.correctAnswer;
  const isQuizComplete = isLastQuestion && (isAnswered || showSolution);

  const handleAnswerSelect = (answerId) => {
    if (isAnswered) return;
    setSelectedAnswerId(answerId);
    setIsAnswered(true);
    setShowSolution(true);
    if (answerId === currentQuestion.correctAnswer) {
      addToSolvedQuestions.mutate(currentQuestion._id);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswerId(null);
    setShowHint(false);
    setShowSolution(false);
    setIsAnswered(false);
    if (isQuizComplete) {
      allQuestionsSolved();
      return;
    }
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  useEffect(() => {
    if (questions) {
      setCurrentQuestionIndex(0);
    }
  }, [questions]);

  if (!currentQuestion) {
    return (
      <div className="m-auto flex max-w-4xl flex-col items-center justify-center gap-4 p-8 text-center text-lg font-semibold">
        <CircleCheckBig className="h-16 w-16 text-primary" />
        <p>
          You&apos;ve finished all questions in this topic. You can solve them
          again or choose a new topic to continue.
        </p>
      </div>
    );
  }

  const getSubjectName = (subjectId) => {
    const subject = subjects.find((subject) => subject._id === subjectId);
    return subject?.title;
  };

  const getTopicName = (topicId) => {
    const topic = topics.find((topic) => topic._id === topicId);
    return topic?.name;
  };

  return (
    <div className="mx-auto max-w-4xl p-4">
      <div className="mb-4">
        <div className="flex flex-col space-y-6">
          <h3 className="text-center text-2xl font-semibold text-muted-foreground">
            {courseTitle}
          </h3>
          <div className="flex items-center pl-4">
            <span className="font-medium">
              {getSubjectName(currentQuestion.subjectId)}
            </span>
            {currentQuestion.topic && (
              <>
                <span className="mx-2 text-muted-foreground">•</span>
                <span className="text-muted-foreground">
                  {getTopicName(currentQuestion.topic)}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <Card className="m-auto">
        <CardHeader>
          <CardTitle className="text-xl">
            <RenderKatex text={currentQuestion.questionText} />
            {currentQuestion.image ? (
              <div>
                <UploadThingImage
                  src={`${currentQuestion.image}`}
                  alt={`Question Image`}
                  width={250}
                  height={250}
                  className="m-auto my-2"
                />
              </div>
            ) : null}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedAnswerId || ""} className="space-y-3">
            {currentQuestion.answers.map((answer) => (
              <div
                key={answer._id}
                className={`flex cursor-pointer items-center space-x-2 rounded-md border p-3 ${
                  isAnswered && answer._id === currentQuestion.correctAnswer
                    ? "border-green-500 bg-green-50"
                    : isAnswered &&
                        answer._id === selectedAnswerId &&
                        answer._id !== currentQuestion.correctAnswer
                      ? "border-red-500 bg-red-50"
                      : showSolution &&
                          answer._id === currentQuestion.correctAnswer
                        ? "border-green-500 bg-green-50"
                        : "hover:bg-muted"
                }`}
                onClick={() => handleAnswerSelect(answer._id)}
              >
                <RadioGroupItem
                  value={answer._id}
                  id={answer._id}
                  disabled={isAnswered || showSolution}
                />
                <Label
                  htmlFor={answer._id}
                  className="flex-grow cursor-pointer"
                >
                  {answer.type === "image" ? (
                    <UploadThingImage
                      src={`${answer.text}`}
                      alt={`Answer`}
                      width={100}
                      height={100}
                    />
                  ) : (
                    <RenderKatex text={answer.text} />
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="flex w-full flex-wrap justify-between gap-4">
            {!isAnswered && !showSolution && (
              <Button
                variant="outline"
                onClick={() => setShowHint(!showHint)}
                className="flex items-center"
              >
                <HelpCircle className="h-4 w-4" />
                {showHint ? "Hide Hint" : "Show Hint"}
              </Button>
            )}

            {!isAnswered && !showSolution && (
              <Button
                variant="outline"
                onClick={() => {
                  setShowSolution(true);
                  // Highlight the correct answer when viewing solution
                  if (!isAnswered) {
                    setSelectedAnswerId(currentQuestion.correctAnswer);
                  }
                }}
                className="flex items-center"
              >
                <Eye className="h-4 w-4" />
                View Solution
              </Button>
            )}

            <Button
              onClick={handleNextQuestion}
              className="ml-auto flex items-center justify-center"
            >
              {isAnswered || showSolution ? "Next Question" : "Skip Question"}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          {currentQuestion.hint && showHint && !showSolution && (
            <div className="w-full rounded-md bg-muted p-4">
              <p className="mb-1 font-medium">Hint:</p>
              <p>{currentQuestion.hint}</p>
            </div>
          )}

          {showSolution && (
            <div className="w-full">
              {isAnswered && (
                <div
                  className={`mb-4 rounded-md p-3 ${isCorrect ? "bg-green-100" : "bg-red-100"}`}
                >
                  <p className="font-medium">
                    {isCorrect
                      ? "✓ Correct! Well done."
                      : "✗ Incorrect. See the solution below."}
                  </p>
                </div>
              )}

              <div className="mb-4">
                <p className="mb-2 font-medium">Solution:</p>
                <div className="overflow-hidden rounded-md border">
                  {currentQuestion.solution ? (
                    <UploadThingImage
                      src={currentQuestion.solution}
                      alt="Solution"
                      width={800}
                      height={600}
                      className="w-full object-contain"
                    />
                  ) : (
                    <h1 className="p-4 text-lg">
                      We&apos;re sorry, the solution is not available at the
                      moment. It will be added soon. Thank you for your
                      patience!
                    </h1>
                  )}
                </div>
              </div>

              {!isQuizComplete && (
                <Button
                  onClick={handleNextQuestion}
                  className="mt-4 flex w-full items-center justify-center"
                >
                  Next Question
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              )}

              {isQuizComplete && (
                <div className="rounded-md bg-green-50 p-4 text-center">
                  <h3 className="text-lg font-bold">Question Set Complete!</h3>
                  <p>Solve other questions sets below.</p>
                </div>
              )}
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
