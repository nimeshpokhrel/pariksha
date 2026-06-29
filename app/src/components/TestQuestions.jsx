"use client";
import { useEffect, useState } from "react";

import {
  Radio,
  RadioGroup,
  Stack,
  Button,
  ButtonGroup,
} from "@chakra-ui/react";
import RenderKatex from "@/components/RenderKatex";

import QuestionSelector from "@/components/QuestionSelector";
import Image from "next/image";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import UploadThingImage from "./UploadThingImage";

const TestQuestions = ({ subjects, setUserSelectedAnswers, pageChanged }) => {
  const [currentSubjectIndex, setCurrentSubjectIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const questionsPerPage = 1;
  const [questionSelectorCount, setQuestionSelectorCount] = useState(
    subjects?.[0].questions.length
  );

  useEffect(() => {
    if (userAnswers) {
      setUserSelectedAnswers(userAnswers);
    }
  }, [userAnswers]);

  useEffect(() => {
    if (currentPage) {
      pageChanged(currentPage);
    }
  }, [currentPage]);

  if (!subjects || subjects.length === 0) {
    return <div>No subjects available</div>;
  }

  const currentSubject = subjects[currentSubjectIndex];

  const totalPages = Math.ceil(
    currentSubject.questions.length / questionsPerPage
  );

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    } else if (currentSubjectIndex < subjects.length - 1) {
      setCurrentSubjectIndex(currentSubjectIndex + 1);
      setCurrentPage(0);
    }
  };

  const handleBack = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    } else if (currentSubjectIndex > 0) {
      setCurrentSubjectIndex(currentSubjectIndex - 1);
      setCurrentPage(
        Math.ceil(
          subjects[currentSubjectIndex - 1].questions.length / questionsPerPage
        ) - 1
      );
    }
  };
  const jumpToQuestion = (questionNumber) => {
    let totalQuestions = 0;
    for (let i = 0; i < subjects.length; i++) {
      totalQuestions += subjects[i].questions.length;
      if (questionNumber <= totalQuestions) {
        setCurrentSubjectIndex(i);
        const questionIndexInSubject =
          questionNumber - (totalQuestions - subjects[i].questions.length);
        setCurrentPage(
          Math.floor((questionIndexInSubject - 1) / questionsPerPage)
        );
        break;
      }
    }
  };
  const globalQuestionIndex = subjects
    .slice(0, currentSubjectIndex)
    .reduce((acc, subject) => acc + subject.questions.length, 0);

  const startIdx = currentPage * questionsPerPage;
  const currentQuestions = currentSubject.questions.slice(
    startIdx,
    startIdx + questionsPerPage
  );

  const selectAnswer = (questionId, answerId) => {
    if (userAnswers[questionId] == answerId) {
      console.log("Already selected");
    } else {
      setUserAnswers((prev) => ({
        ...prev,
        [questionId]: answerId,
      }));
    }
  };

  return (
    <div className="content-container flex flex-col items-center gap-2 pt-2">
      <h2 className="mb-6 text-xl font-semibold min-[900px]:-mt-14">
        {currentSubject.name}
      </h2>
      <div className="m-auto w-full max-w-[600px]">
        {currentQuestions.map((question, idx) => {
          return (
            <div key={idx} className="w-full">
              <div className="mb-2 flex gap-6">
                <p className="text-md mt-2 font-bold">
                  {globalQuestionIndex + startIdx + idx + 1}.
                </p>
                <div>
                  <p className="leading-8">
                    <RenderKatex text={question.questionText} />
                  </p>
                  {question.image ? (
                    <UploadThingImage
                      src={`${question.image}`}
                      alt={`Question Image`}
                      width={250}
                      height={250}
                      className="m-auto my-2"
                    />
                  ) : null}
                </div>
              </div>
              <div className="pl-2">
                <RadioGroup
                  onChange={(e) => selectAnswer(question._id, e)}
                  value={userAnswers[question._id]}
                >
                  <Stack direction="column" spacing={4}>
                    {question.answers.map((answer, idx) => (
                      <Radio value={answer._id} key={idx} spacing={6}>
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
                      </Radio>
                    ))}
                  </Stack>
                </RadioGroup>
              </div>
            </div>
          );
        })}
      </div>
      <div className="m-auto mb-4 mt-6 flex w-full max-w-[400px] justify-between">
        <Button
          onClick={handleBack}
          isDisabled={currentSubjectIndex === 0 && currentPage === 0}
          colorScheme={"blackAlpha"}
          paddingX={2}
        >
          <FaAngleLeft size={24} />
        </Button>
        <QuestionSelector
          subjects={subjects}
          questionSelectorCount={questionSelectorCount}
          jumpToQuestion={jumpToQuestion}
          userAnswers={userAnswers}
        />
        <Button
          onClick={handleNext}
          isDisabled={
            currentSubjectIndex === subjects.length - 1 &&
            currentPage === totalPages - 1
          }
          paddingX={2}
        >
          <FaAngleRight size={24} />
        </Button>
      </div>
    </div>
  );
};

export default TestQuestions;
