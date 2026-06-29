import NoHookFormInput from "@/components/FormInputs/NoHookFormInput";
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { UploadDropzone } from "@uploadthing/react";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CiEdit } from "react-icons/ci";
import QuestionAnswerPreview from "@/components/adminComponents/QuestionAnswerPreview";
import useToast from "@/utils/useToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editAnswer } from "@/hooks/admin/question";
import Spinner from "@/utils/Spinner";

const AnswerItem = ({ answer, index, correct, onEdit }) => {
  const [answerText, setAnswerText] = useState(answer.text);
  const [imageAnswer, setImageAnswer] = useState(answer.type === "image");
  const { showToastError } = useToast();

  const switchChangeHandler = (checked) => {
    setAnswerText(null);
    setImageAnswer(checked);
  };

  const imageUploadComplete = async (res) => {
    setAnswerText(res[0].key);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!answerText) {
      showToastError({
        title: "Answer is required",
        description: "Please enter an answer",
      });
      return;
    }
    onEdit({
      text: answerText,
      type: imageAnswer ? "image" : "text",
      _id: answer._id,
    });
  };

  return (
    <div
      className="mb-12 flex flex-col gap-4 border-b pb-4 md:flex-row"
      key={answer._id}
    >
      <div className="relative flex-[3]">
        <div className="absolute right-0 top-0 flex items-center gap-2">
          <Switch
            id="imageAnswer"
            onCheckedChange={switchChangeHandler}
            checked={imageAnswer}
          />
          <label htmlFor="imageAnswer" className="text-xs">
            Image
          </label>
        </div>
        <form onSubmit={handleSubmit}>
          {!imageAnswer && (
            <NoHookFormInput
              name={`answer`}
              label={`Answer ${index + 1} ${
                correct === answer._id ? "( Correct ✅ )" : "( Incorrect ❌ )"
              }`}
              placeHolder={`Enter Answer`}
              defaultValue={answerText}
              required={true}
              onChange={(e) => setAnswerText(e.target.value)}
              noError={true}
            />
          )}
          {imageAnswer && (
            <div className="mb-2 flex flex-col gap-4">
              <label className="mb-1 pl-2 text-xs text-gray-500">
                Answer {index + 1}{" "}
                {correct === answer._id ? "( Correct ✅ )" : "( Incorrect ❌ )"}
              </label>
              <UploadDropzone
                endpoint="imageUploader"
                onClientUploadComplete={imageUploadComplete}
                onUploadError={(error) => {
                  alert(`ERROR! ${error.message}`);
                }}
                className="mt-0 py-4"
              />
            </div>
          )}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setAnswerText(answer.text);
                setImageAnswer(answer.type === "image");
              }}
              disabled={answerText === answer.text}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!answerText || answerText === answer.text}
            >
              Save
            </Button>
          </div>
        </form>
      </div>
      <div className="flex-[2] border-l md:ml-4 md:pl-8">
        <QuestionAnswerPreview
          answer={{
            text: answerText,
            type: imageAnswer ? "image" : "text",
          }}
          correct={correct === answer._id}
        />
      </div>
    </div>
  );
};

export default function EditQuestionAnswer({
  questionId,
  answers,
  correct,
  questionSubjectId,
  questionsOfTheDayId,
}) {
  const [editAnswersOpen, setEditAnswersOpen] = useState(false);
  const { showToastError, showToastSuccess } = useToast();
  const queryClient = useQueryClient();
  const editAnswerMutation = useMutation({
    mutationFn: (answer) => editAnswer({ questionId, answer }),
    onSuccess: () => {
      queryClient.invalidateQueries(
        questionsOfTheDayId
          ? ["questionsOfTheDay", questionsOfTheDayId]
          : ["questionSubjectData", questionSubjectId]
      );
      showToastSuccess({
        title: "Answer updated successfully",
        description: "The answer has been updated successfully",
      });
    },
    onError: () => {
      showToastError({
        title: "Error updating answer",
        description: "An error occurred while updating the answer",
      });
    },
  });

  return (
    <>
      {editAnswerMutation.isPending && <Spinner />}
      <Dialog
        open={editAnswersOpen}
        onOpenChange={(state) => {
          setEditAnswersOpen(state);
        }}
      >
        <DialogTrigger className="flex w-max items-center gap-2 rounded-md border border-black px-2 py-1 text-xs font-bold">
          <CiEdit size={18} /> Answers
        </DialogTrigger>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <div className={"flex"}>
              <DialogTitle className="flex-[3]">Edit The Answers</DialogTitle>
              <DialogTitle className="hidden flex-[2] text-center md:block">
                Answers Preview
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="mt-4 w-full">
            {answers.map((answer, index) => (
              <AnswerItem
                key={answer._id}
                answer={answer}
                index={index}
                correct={correct}
                onEdit={editAnswerMutation.mutate}
              />
            ))}
            <div className="mt-8 flex items-center justify-end gap-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Close
                </Button>
              </DialogClose>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
