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

export default function EditSection({ section, handleEditItem }) {
  const [editOpen, setEditOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(section.title);

  return (
    <Dialog
      open={editOpen}
      onOpenChange={(state) => {
        if (!state) {
          setEditTitle(section.title);
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
              },
              section._id
            );
            setEditOpen(false);
          }}
          className="mt-6"
        >
          <NoHookFormInput
            name={`title`}
            label={"Section Title"}
            placeHolder="Enter Section Title"
            required={true}
            defaultValue={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
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
