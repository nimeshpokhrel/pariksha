import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DeleteDialog from "../Dialog/DeleteDialog";
import { FaPlus } from "react-icons/fa";
import NoHookFormInput from "@/components/FormInputs/NoHookFormInput";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { CiEdit } from "react-icons/ci";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useToast from "@/utils/useToast";
import { createTopic, deleteTopic, editTopic } from "@/hooks/admin/question";

export default function AdminQuestionTopicsInfo({
  topics,
  questionSubject,
  subjectId,
}) {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addTitle, setAddTitle] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editId, setEditId] = useState("");

  const { showToastSuccess, showToastError } = useToast();
  const queryClient = useQueryClient();

  const topicCreateMutation = useMutation({
    mutationFn: (data) => createTopic(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["questionSubjectData", questionSubject]);
      showToastSuccess({ title: "Topic Created Successfully" });
      setAddDialogOpen(false);
    },
    onError: (error) => {
      showToastError({ error });
    },
  });

  const deleteTopicMutation = useMutation({
    mutationFn: (id) => deleteTopic(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["questionSubjectData", questionSubject]);
      showToastSuccess({ title: "Topic Deleted Successfully" });
    },
    onError: (error) => {
      console.log("error: ", error);
      showToastError({ error });
    },
  });

  const editTopicMutation = useMutation({
    mutationFn: ({ id, data }) => editTopic(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["questionSubjectData", questionSubject]);
      showToastSuccess({ title: "Topic Edited Successfully" });
    },
    onError: (error) => {
      showToastError(error);
    },
  });

  const handleCreateTopic = () => {
    topicCreateMutation.mutate({
      name: addTitle,
      subjectId,
      questionSubject,
    });
  };

  const handleDeleteTopic = (id) => () => {
    deleteTopicMutation.mutate(id);
  };

  const handleEditTopic = (id, data) => {
    editTopicMutation.mutate({ id, data });
  };

  return (
    <div className="mt-20">
      <div className="mb-4 flex items-center justify-between">
        <p className="mt-1 text-xl font-bold">Question Topics</p>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <div className="flex justify-end">
            <DialogTrigger className="flex w-max items-center gap-4 rounded-md bg-primary px-4 py-1.5 font-bold text-white max-[550px]:text-xs">
              <FaPlus size={12} />
              Add Question Topic
            </DialogTrigger>
          </div>
          <DialogContent className={"max-w-4xl"}>
            <DialogHeader>
              <DialogTitle className="text-center text-xl font-semibold">
                Add a New Question Topic
              </DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateTopic();
              }}
            >
              <NoHookFormInput
                name={`name`}
                label={"Topic Name"}
                placeHolder="Enter Topic Name"
                required={true}
                onChange={(e) => {
                  setAddTitle(e.target.value);
                }}
                noError={true}
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
      </div>
      {topics.length > 0 &&
        topics.map((topic) => (
          <div
            className={`mb-2 flex items-center space-x-4 rounded-lg border bg-white p-4 shadow`}
            key={topic._id}
          >
            <div className="flex flex-grow items-center justify-between gap-8">
              <div>
                <p className="">{topic.name}</p>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => {
                      setEditId(topic._id);
                      setEditTitle(topic.name);
                      setEditDialogOpen(true);
                    }}
                    className="h-[26px] w-max rounded-md border border-black bg-transparent px-2 py-0 text-xs font-bold text-black hover:bg-gray-100"
                  >
                    <CiEdit size={8} />
                  </Button>
                  <DeleteDialog
                    title={"Are you sure you want to delete this ? "}
                    description={"Are you sure you want to delete this topic?"}
                    returnId={topic._id}
                    deleteFunction={handleDeleteTopic}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

      <Dialog
        open={editDialogOpen}
        onOpenChange={(state) => {
          if (!state) {
            setEditTitle("");
            setEditId("");
            setEditDialogOpen(state);
          }
        }}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit The Topic</DialogTitle>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEditTopic(editId, {
                name: editTitle,
              });
              setEditDialogOpen(false);
            }}
            className="mt-6"
          >
            <NoHookFormInput
              name={`name`}
              label={"Topic Name"}
              placeHolder="Enter Topic Name"
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
    </div>
  );
}
