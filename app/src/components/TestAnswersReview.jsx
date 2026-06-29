import React, { useEffect, useState } from "react";
import PrimaryButton from "./PrimaryButton";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import ReviewQuestionAnswer from "./ReviewQuestionAnswer";

export default function TestAnswersReview({ title, setTestStatus, data }) {
  const subjectsSummary = data.userSummary;
  const [subjectDisplayIndex, setSubjectDisplayIndex] = useState(0);
  const [displaySubject, setDisplaySubject] = useState(
    subjectsSummary[subjectDisplayIndex]
  );

  useEffect(() => {
    setDisplaySubject(subjectsSummary[subjectDisplayIndex]);
  }, [subjectDisplayIndex]);

  return (
    <div className="content-container pt-8">
      <PrimaryButton
        text={"Go Back"}
        onClick={() => setTestStatus("summary")}
        className={"w-max rounded-xl px-24 py-3"}
      />
      <p className="mt-8 text-2xl font-semibold">{title}</p>
      <div className="mt-8 flex w-full items-center justify-between">
        <button
          className="flex items-center justify-center gap-2 rounded-lg py-2 pl-2 pr-4 hover:bg-gray-200"
          onClick={() => {
            if (subjectDisplayIndex === 0) {
              setSubjectDisplayIndex(subjectsSummary.length - 1);
            } else {
              setSubjectDisplayIndex(subjectDisplayIndex - 1);
            }
          }}
        >
          <FaAngleLeft size={24} />

          {subjectDisplayIndex === 0
            ? subjectsSummary[subjectsSummary.length - 1].subject
            : subjectsSummary[subjectDisplayIndex - 1].subject}
        </button>
        <button
          className="flex items-center justify-center gap-2 rounded-lg py-2 pl-4 pr-2 hover:bg-gray-200"
          onClick={() => {
            if (subjectDisplayIndex === subjectsSummary.length - 1) {
              setSubjectDisplayIndex(0);
            } else {
              setSubjectDisplayIndex(subjectDisplayIndex + 1);
            }
          }}
        >
          {subjectDisplayIndex === subjectsSummary.length - 1
            ? subjectsSummary[0].subject
            : subjectsSummary[subjectDisplayIndex + 1].subject}
          <FaAngleRight size={24} />
        </button>
      </div>

      <div className="mt-6 flex flex-col">
        <div className="mt-4 flex flex-col items-center gap-1">
          <p className="text-xl font-semibold"> {displaySubject.subject}</p>
          <p>Your Marks : {displaySubject.subjectMarks}</p>
          <p>Total Marks : {displaySubject.subjectTotalMarks}</p>
        </div>

        <div className="mx-auto mt-20 grid grid-cols-2 justify-items-center gap-12 max-[1100px]:grid-cols-1">
          {displaySubject.questions.map((item, index) => (
            <ReviewQuestionAnswer
              question={item.question}
              key={index}
              count={index + 1}
              userAnswer={item.userAnswer}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
