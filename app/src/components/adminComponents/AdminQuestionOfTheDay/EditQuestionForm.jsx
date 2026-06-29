import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import NoHookFormInput from "@/components/FormInputs/NoHookFormInput";
import { UploadDropzone } from "@/utils/uploadthing";
import RenderKatex from "@/components/RenderKatex";
import useToast from "@/utils/useToast";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CiEdit } from "react-icons/ci";
import EditQuestionAnswer from "../AdminForms/EditQuestionAnswer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editQuestion } from "@/hooks/admin/question";
import Spinner from "@/utils/Spinner";
import CreatableSelect from "react-select/creatable";
import UploadThingImage from "@/components/UploadThingImage";
import { NoHookComboboxInput } from "@/components/FormInputs/NoHookComboboxInput";

export default function EditQuestionForm({
  question,
  subjects,
  topics,
  handleCreateTopic,
  questionsOfTheDayId,
}) {
  const [questionImage, setQuestionImage] = useState(question.image);
  const [questionText, setQuestionText] = useState(question.questionText);
  const [solution, setSolution] = useState(question.solution);
  const [hint, setHint] = useState(question.hint);
  const [subject, setSubject] = useState(question.subjectId);
  const [topic, setTopic] = useState(question.topic);
  const [editOpen, setEditOpen] = useState(false);
  const queryClient = useQueryClient();

  const { showToastError, showToastSuccess } = useToast();
  const updateQuestionMutation = useMutation({
    mutationFn: (data) => editQuestion({ questionId: question._id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries(["questionsOfTheDay", questionsOfTheDayId]);
      setEditOpen(false);
      showToastSuccess({ title: "Question Edited Successfully" });
    },
    onError: (error) => {
      showToastError({ error });
    },
  });

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
    updateQuestionMutation.mutate({
      questionText: questionText,
      questionImage: questionImage,
      solution: solution,
      hint: hint,
      topic: topic,
    });
  };

  return (
    <>
      {updateQuestionMutation.isPending && <Spinner />}
      <Dialog
        open={editOpen}
        onOpenChange={(state) => {
          setEditOpen(state);
        }}
      >
        <DialogTrigger className="flex w-max items-center gap-2 rounded-md border border-black px-2 py-1 text-xs font-bold">
          <CiEdit size={18} /> Question
        </DialogTrigger>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle>Edit The Question</DialogTitle>
          </DialogHeader>

          <div className="mt-4 flex flex-col gap-6 md:flex-row">
            <form onSubmit={submitHandle} className="flex-[4]">
              <div className="mb-8 flex flex-col">
                <NoHookFormInput
                  name={`question`}
                  label={"Question"}
                  placeHolder={"Enter Question"}
                  required={true}
                  defaultValue={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  noError={true}
                />
                <div className="mb-8 mt-4 flex flex-col justify-between gap-4 md:flex-row">
                  <div className="w-full">
                    <div className="flex items-center justify-between gap-2">
                      <p className="ml-1 text-xs text-gray-500">
                        Question Image
                      </p>
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
                      className="mt-0"
                    />
                  </div>
                  <div className="w-full">
                    <div className="flex items-center justify-between gap-2">
                      <p className="ml-1 text-xs text-gray-500">
                        Question Solution
                      </p>
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
                  defaultValue={hint}
                  onChange={(e) => setHint(e.target.value)}
                  noError={true}
                />

                <NoHookComboboxInput
                  name={`subject`}
                  label={"Subject"}
                  placeHolder={"Select Subject"}
                  required={true}
                  onChange={(val) => setSubject(val)}
                  noError={true}
                  options={subjects.map((subject) => ({
                    value: subject._id,
                    label: subject.title,
                  }))}
                  defaultValue={subject}
                />
                {subject && (
                  <>
                    <p className="mb-1 mt-6 pl-2 text-sm text-gray-500">
                      Topic*
                    </p>
                    <CreatableSelect
                      closeMenuOnSelect={true}
                      options={topics.map((topic) => ({
                        value: topic._id,
                        label: topic.name,
                      }))}
                      defaultValue={{
                        value: topic,
                        label: topics.find((t) => t._id === topic)?.name,
                      }}
                      onCreateOption={handleCreateTopic}
                      placeholder="Select Topic"
                      required={true}
                      onChange={(val) => setTopic(val.value)}
                      className="border-none"
                    />
                  </>
                )}
              </div>

              <div className="mt-8 flex items-center justify-end gap-4">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Close
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={
                    updateQuestionMutation.isPending ||
                    !questionText ||
                    !topic ||
                    (questionText === question.questionText &&
                      questionImage === question.image &&
                      hint === question.hint &&
                      solution === question.solution &&
                      topic === question.topic)
                  }
                >
                  {updateQuestionMutation.isPending ? "Saving..." : "Save"}
                </Button>
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
                    {questionText && <RenderKatex text={questionText} />}
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
                  <p className="text-gray-500">Topic : </p>
                  <p className="ml-1">
                    {topic && topics.find((t) => t._id === topic)?.name}
                  </p>
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
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <EditQuestionAnswer
        questionId={question._id}
        answers={question.answers}
        correct={question.correctAnswer}
        questionsOfTheDayId={questionsOfTheDayId}
      />
    </>
  );
}
