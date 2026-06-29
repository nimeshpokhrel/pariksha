import React from "react";
import RenderKatex from "@/components/RenderKatex";
import Image from "next/image";
import rightIcon from "/public/rightIcon.svg";
import wrongIcon from "/public/wrongIcon.svg";

export default function ReviewQuestionAnswer({ question, count, userAnswer }) {
  return (
    <div className="flex w-full max-w-[450px] flex-col justify-between gap-4">
      <div className="flex gap-6">
        <p className="text-md mt-2 font-bold">{count}</p>
        <p className="leading-10">
          <RenderKatex text={question.questionText} />
        </p>
      </div>
      <div className="flex flex-col gap-4 pl-10">
        {question.answers.map((answer, idx) => (
          <p
            key={idx}
            className={`flex justify-between border-2 border-solid border-gray-200 px-8 py-4 ${question.correctAnswer === answer._id ? (question.correctAnswer === userAnswer ? "border-green-500 bg-green-50" : "border-gray-200 bg-gray-100") : ""} ${userAnswer === answer._id && userAnswer !== question.correctAnswer && "border-red-300 bg-red-50"} `}
          >
            <RenderKatex text={answer.text} />
            {question.correctAnswer === answer._id && (
              <Image src={rightIcon} alt="correct" width={24} height={24} />
            )}
            {userAnswer === answer._id &&
              userAnswer !== question.correctAnswer && (
                <Image src={wrongIcon} alt="wrong" width={24} height={24} />
              )}
          </p>
        ))}
      </div>
    </div>
  );
}
