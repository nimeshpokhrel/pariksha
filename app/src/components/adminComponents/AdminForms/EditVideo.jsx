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

export default function EditVideo({ video, handleEditItem }) {
  const [editOpen, setEditOpen] = useState(false);
  const [editVideoFile, setEditVideoFile] = useState(video.videoFile);
  const [editTitle, setEditTitle] = useState(video.title);
  const [editDuration, setEditDuration] = useState(video.duration);

  return (
    <Dialog
      open={editOpen}
      onOpenChange={(state) => {
        if (!state) {
          setEditVideoFile(video.videoFile);
          setEditTitle(video.title);
          setEditDuration(video.duration);
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
                duration: editDuration,
                videoFile: editVideoFile,
              },
              video._id
            );
            setEditOpen(false);
          }}
          className="mt-6"
        >
          <NoHookFormInput
            name={`videoFile`}
            label={"Video Link"}
            placeHolder="Enter Video Link"
            required={true}
            defaultValue={editVideoFile}
            onChange={(e) => setEditVideoFile(e.target.value)}
          />
          <NoHookFormInput
            name={`title`}
            label={"Subject Title"}
            placeHolder="Enter Subject Title"
            required={true}
            defaultValue={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />

          <NoHookFormInput
            label={"Video Duration"}
            name={`duration`}
            required={true}
            placeHolder="Enter Video Duration"
            defaultValue={editDuration}
            onChange={(e) => setEditDuration(e.target.value)}
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
