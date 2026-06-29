import React from "react";
import { useState } from "react";
import { CiEdit } from "react-icons/ci";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import NoHookFormInput from "@/components/FormInputs/NoHookFormInput";
import NoHookEditorInput from "@/components/FormInputs/NoHookEditorInput";

const setTypeOptions = [
  { value: "mock", label: "Mock Test" },
  { value: "past", label: "Past Question Set" },
];

export default function EditQuestionSet({ questionSet, handleEditItem }) {
  const [editOpen, setEditOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(questionSet.title);
  const [editLink, setEditLink] = useState(questionSet.link);
  const [editNumber, setEditNumber] = useState(questionSet.number);
  const [editDescription, setEditDescription] = useState(
    questionSet.description
  );
  const [editSetType, setEditSetType] = useState(questionSet.setType);

  return (
    <Dialog
      open={editOpen}
      onOpenChange={(state) => {
        if (!state) {
          setEditTitle(questionSet.title);
          setEditLink(questionSet.link);
          setEditNumber(questionSet.number);
          setEditDescription(questionSet.description);
          setEditSetType(questionSet.setType);
        }
        setEditOpen(state);
      }}
    >
      <DialogTrigger className="w-max rounded-md border border-black px-2 py-1 text-xs font-bold">
        <CiEdit size={18} />
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit The Course Information</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleEditItem(
              {
                title: editTitle,
                link: editLink,
                number: editNumber,
                description: editDescription,
                setType: editSetType,
              },
              questionSet._id
            );
            setEditOpen(false);
          }}
          className="mt-6"
        >
          <NoHookFormInput
            name={`title`}
            label={"Question Set Title"}
            placeHolder="Enter Question Set Title"
            required={true}
            defaultValue={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <NoHookFormInput
            name={`link`}
            label={"Question Set Link"}
            placeHolder="Enter Question Set Link"
            required={true}
            defaultValue={editLink}
            onChange={(e) => setEditLink(e.target.value)}
          />
          <NoHookFormInput
            name={`number`}
            label={"Question Set Display Title"}
            placeHolder="Enter Question Set Display Title"
            required={true}
            defaultValue={editNumber}
            onChange={(e) => setEditNumber(e.target.value)}
          />

          <div className="mb-8 mt-2 grid grid-cols-3 gap-4 max-[420px]:grid-cols-2">
            {setTypeOptions.map((option, index) => (
              <button
                type="button"
                key={index}
                className={`whitespace-nowrap border border-gray-semiDark px-2 py-2 text-center text-sm ${editSetType === option.value ? "bg-primary text-white" : ""}`}
                onClick={() => setEditSetType(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>

          <NoHookEditorInput
            label={"Description"}
            name={`description`}
            required={true}
            placeHolder="Enter Question Set Description"
            defaultValue={editDescription}
            onChange={(value) => setEditDescription(value)}
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
      </DialogContent>
    </Dialog>
  );
}
