import React, { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import AddQuestionAnswer from "../AdminForms/AddQuestionAnswer";
import NoHookFormInput from "@/components/FormInputs/NoHookFormInput";
import { UploadDropzone } from "@/utils/uploadthing";

import QuestionAnswerPreview from "@/components/adminComponents/QuestionAnswerPreview";
import useToast from "@/utils/useToast";

import RenderKatex from "@/components/RenderKatex";
import UploadThingImage from "@/components/UploadThingImage";
import { NoHookComboboxInput } from "@/components/FormInputs/NoHookComboboxInput";
import CreatableSelect from "react-select/creatable";

export default function QuestionForm({
  handleFormSubmit,
  topics,
  subjects,
  handleCreateTopic,
}) {
  const [questionImage, setQuestionImage] = useState(null);
  const [questionText, setQuestionText] = useState(null);
  const [answer1, setAnswer1] = useState({ text: null, type: "text" });
  const [answer2, setAnswer2] = useState({ text: null, type: "text" });
  const [answer3, setAnswer3] = useState({ text: null, type: "text" });
  const [answer4, setAnswer4] = useState({ text: null, type: "text" });
  const [hint, setHint] = useState(null);
  const [subject, setSubject] = useState(null);
  const [topic, setTopic] = useState(null);
  const [solution, setSolution] = useState(null);
  const { showToastError } = useToast();

  const imageUploadComplete = async (res) => {
    setQuestionImage(res[0].key);
  };

  const solutionUploadComplete = async (res) => {
    setSolution(res[0].key);
  };

  const submitHandle = (event) => {
    event.preventDefault();
    if (!questionText) {
      showToastError({
        title: "Question is required",
        description: "Please enter a question",
      });
      return;
    }
    if (!subject) {
      showToastError({
        title: "Subject is required",
        description: "Please select a subject",
      });
      return;
    }
    if (!topic) {
      showToastError({
        title: "Topic is required",
        description: "Please select a topic",
      });
      return;
    }
    if (!answer1.text) {
      showToastError({
        title: "Answer 1 is required",
        description: "Please enter an answer",
      });
      return;
    }
    if (!answer2.text) {
      showToastError({
        title: "Answer 2 is required",
        description: "Please enter an answer",
      });
      return;
    }
    if (!answer3.text) {
      showToastError({
        title: "Answer 3 is required",
        description: "Please enter an answer",
      });
      return;
    }
    if (!answer4.text) {
      showToastError({
        title: "Answer 4 is required",
        description: "Please enter an answer",
      });
      return;
    }
    handleFormSubmit({
      questionText,
      subject,
      topic,
      questionImage,
      answers: [answer1, answer2, answer3, answer4],
      hint,
      solution,
    });
  };

  // console.log(subjects);
  // console.log(topics);

  return (
    <div className="mt-4 flex flex-col gap-6 md:flex-row">
      <form onSubmit={submitHandle} className="flex-[4]">
        <div className="mb-4 flex flex-col">
          <NoHookFormInput
            name={`question`}
            label={"Question"}
            placeHolder={"Enter Question"}
            required={true}
            onChange={(e) => setQuestionText(e.target.value)}
            noError={true}
          />
          <div className="mb-4 flex flex-col gap-8">
            <NoHookComboboxInput
              name={`subject`}
              label={"Subject"}
              placeHolder={"Select Subject"}
              required={true}
              onChange={(val) => setSubject(val)}
              noError={true}
              defaultValue={subject}
              options={subjects.map((subject) => ({
                value: subject._id,
                label: subject.title,
              }))}
            />

            {subject && (
              <div>
                <label className="mb-2 pl-2 text-xs text-gray-500">
                  Topic*
                </label>
                <CreatableSelect
                  closeMenuOnSelect={true}
                  options={topics
                    .filter((topic) => topic.subjectId === subject)
                    .map((topic) => ({
                      value: topic._id,
                      label: topic.name,
                    }))}
                  defaultValue={{
                    value: topic,
                    label: topics.find((t) => t._id === topic)?.name,
                  }}
                  onCreateOption={(inputValue) =>
                    handleCreateTopic(inputValue, subject)
                  }
                  placeholder="Select Topic"
                  required={true}
                  onChange={(val) => setTopic(val.value)}
                  className="border-none"
                />
              </div>
            )}
          </div>

          <div className="mb-8 mt-4 flex flex-col justify-between gap-4 md:flex-row">
            <div className="w-full">
              <div className="flex items-center justify-between gap-2">
                <p className="ml-1 text-xs text-gray-500">Question Image</p>
                {questionImage && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setQuestionImage(null)}
                  >
                    Remove Image
                  </Button>
                )}
              </div>
              <UploadDropzone
                endpoint="imageUploader"
                onClientUploadComplete={imageUploadComplete}
                onUploadError={(error) => {
                  alert(`ERROR! ${error.message}`);
                }}
                className="mt-0 w-full"
              />
            </div>
            <div className="w-full">
              <div className="flex items-center justify-between gap-2">
                <p className="ml-1 text-xs text-gray-500">Question Solution</p>
                {solution && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSolution(null)}
                  >
                    Remove Image
                  </Button>
                )}
              </div>
              <UploadDropzone
                endpoint="imageUploader"
                onClientUploadComplete={solutionUploadComplete}
                onUploadError={(error) => {
                  alert(`ERROR! ${error.message}`);
                }}
                className="mt-0"
              />
            </div>
          </div>
          <NoHookFormInput
            name={`hint`}
            label={"Hint"}
            placeHolder={"Enter Solution Hint"}
            required={true}
            onChange={(e) => setHint(e.target.value)}
            noError={true}
          />
        </div>

        <AddQuestionAnswer
          label={"Answer 1 ( Correct Answer ✅ )"}
          answer={answer1}
          handleChange={(answer) => setAnswer1(answer)}
        />
        <AddQuestionAnswer
          label={"Answer 2 ( Incorrect Answer ❌ )"}
          answer={answer2}
          handleChange={(answer) => setAnswer2(answer)}
        />
        <AddQuestionAnswer
          label={"Answer 3 ( Incorrect Answer ❌ )"}
          answer={answer3}
          handleChange={(answer) => setAnswer3(answer)}
        />
        <AddQuestionAnswer
          label={"Answer 4 ( Incorrect Answer ❌ )"}
          answer={answer4}
          handleChange={(answer) => setAnswer4(answer)}
        />
        <div className="mt-8 flex items-center justify-end gap-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Close
            </Button>
          </DialogClose>
          <Button type="submit">Save</Button>
        </div>
      </form>
      <div className="flex-[4] md:border-l">
        <div className="md:pl-4">
          <h1 className="mb-8 border-b-2 pb-4 text-center text-xl font-bold">
            Question Preview
          </h1>
          <div className="mb-4 border-b-2 pb-4">
            <p className="text-gray-500">Question : </p>
            <p className="ml-1">
              <RenderKatex text={questionText} />
            </p>
          </div>
          <div className="mb-4 border-b-2 pb-6">
            <p className="mb-1 text-gray-500">Question Image : </p>
            {questionImage && (
              <UploadThingImage
                src={`${questionImage}`}
                alt="Question Image"
                width={250}
                height={250}
                className="ml-4"
              />
            )}
          </div>

          <div className="mb-4 border-b-2 pb-4">
            <p className="text-gray-500">Hint : </p>
            <p className="ml-1">{hint && <RenderKatex text={hint} />}</p>
          </div>

          <div className="mb-4 border-b-2 pb-4">
            <p className="text-gray-500">Solution : </p>
            {solution && (
              <UploadThingImage
                src={`${solution}`}
                alt="Question Solution"
                width={250}
                height={250}
                className="ml-4"
              />
            )}
          </div>
          <div className="ml-4 mt-6 flex flex-col gap-2">
            <h3 className="font-bold">Answers</h3>
            <QuestionAnswerPreview answer={answer1} correct={true} />
            <QuestionAnswerPreview answer={answer2} correct={false} />
            <QuestionAnswerPreview answer={answer3} correct={false} />
            <QuestionAnswerPreview answer={answer4} correct={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
