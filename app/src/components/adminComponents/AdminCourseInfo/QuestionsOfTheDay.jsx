"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useToast from "@/utils/useToast";
import Spinner from "@/utils/Spinner";
import { CiEdit } from "react-icons/ci";
import DeleteDialog from "@/components/Dialog/DeleteDialog";
import DatePicker from "@/components/FormInputs/DatePicker";
import {
  createQuestionsOfTheDay,
  deleteQuestionsOfTheDay,
  editQuestionsOfTheDay,
} from "@/hooks/admin/questionsOfTheDay";
import convertDate from "@/utils/convertDate";
import Link from "next/link";

const QuestionsOfTheDaySchema = z.object({
  date: z.preprocess((val) => {
    if (val instanceof Date && !isNaN(val)) {
      return new Date(
        Date.UTC(val.getFullYear(), val.getMonth(), val.getDate())
      );
    }
    return val;
  }, z.date()),
});

export default function QuestionsOfTheDay({ courseId, questionsOfTheDay }) {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState("");

  const { showToastSuccess, showToastError } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({ resolver: zodResolver(QuestionsOfTheDaySchema) });

  const {
    register: editRegister,
    handleSubmit: editHandleSubmit,
    reset: editFormReset,
    formState: { errors: editErrors },
    setValue: editSetValue,
    watch: editWatch,
  } = useForm({ resolver: zodResolver(QuestionsOfTheDaySchema) });

  const queryClient = useQueryClient();

  const createQuestionsOfTheDayMutation = useMutation({
    mutationFn: (formData) => createQuestionsOfTheDay(formData),
    onSuccess: () => {
      queryClient.invalidateQueries(["course-details", courseId]);
      setOpen(false);
      showToastSuccess({ title: "Questions Of The Day Added Successfully" });
    },
    onError: (error) => {
      showToastError({ error });
    },
  });
  const deleteQuestionsOfTheDayMutation = useMutation({
    mutationFn: (id) => deleteQuestionsOfTheDay(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["course-details", courseId]);
      showToastSuccess({ title: "Questions Of The Day Deleted Successfully" });
    },
    onError: (error) => {
      showToastError({ error });
    },
  });
  const updateQuestionsOfTheDayMutation = useMutation({
    mutationFn: (data) => editQuestionsOfTheDay(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["course-details", courseId]);
      setEditOpen(false);
      showToastSuccess({ title: "Questions Of The Day Edited Successfully" });
    },
    onError: (error) => {
      showToastError({ error });
    },
  });

  const handleCreateQuestionsOfTheDay = (data, event) => {
    event.preventDefault();

    createQuestionsOfTheDayMutation.mutate({
      course: courseId,
      date: data.date,
    });
  };
  const handleDeleteQuestionsOfTheDay = (id) => () => {
    deleteQuestionsOfTheDayMutation.mutate(id);
  };
  const handleEditQuestionsOfTheDay = (data, event) => {
    event.preventDefault();
    updateQuestionsOfTheDayMutation.mutate({ id: editId, data });
  };

  const openEditDialog = (questionsOfTheDay) => {
    setEditOpen(true);
    editSetValue(`date`, questionsOfTheDay.date);
    setEditId(questionsOfTheDay._id);
  };

  return (
    <div className="mb-20 flex flex-col gap-10 pt-8">
      {(createQuestionsOfTheDayMutation.isPending ||
        deleteQuestionsOfTheDayMutation.isPending ||
        updateQuestionsOfTheDayMutation.isPending) && <Spinner />}
      <Dialog open={open} onOpenChange={setOpen}>
        <div className="flex items-center justify-between">
          <h1 className="mt-1 text-xl font-bold">Questions Of The Day</h1>
          <DialogTrigger className="flex w-max items-center gap-4 rounded-md bg-primary px-4 py-1.5 font-bold text-white max-[550px]:text-xs">
            <FaPlus size={12} />
            ADD Question Set
          </DialogTrigger>
        </div>

        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-semibold">
              Add a new Questions Of The Day
            </DialogTitle>
          </DialogHeader>

          <QuestionsOfTheDayForm
            errors={errors}
            handleSubmit={handleSubmit(handleCreateQuestionsOfTheDay)}
            register={register}
            setValue={setValue}
            watch={watch}
          />
        </DialogContent>
      </Dialog>

      {questionsOfTheDay &&
        questionsOfTheDay?.length > 0 &&
        questionsOfTheDay?.map((questionsOfTheDay) => {
          return (
            <div
              className="rounded-lg border border-solid border-[#d1d7dc] p-4 hover:bg-gray-light"
              key={questionsOfTheDay._id}
            >
              <div className="flex items-center justify-between gap-2">
                <Link
                  href={`/admin/courses/${courseId}/questionsoftheday/${questionsOfTheDay._id}`}
                >
                  <h1 className="text-lg font-semibold">
                    {convertDate(questionsOfTheDay.date)}
                  </h1>
                </Link>
                <div className="flex items-center gap-2">
                  <DeleteDialog
                    title={
                      "Are you sure you want to delete this questions of the day of date: "
                    }
                    description={convertDate(questionsOfTheDay.date)}
                    returnId={questionsOfTheDay._id}
                    deleteFunction={handleDeleteQuestionsOfTheDay}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => openEditDialog(questionsOfTheDay)}
                    className="h-max w-max rounded-md border border-black px-2 py-1 text-xs font-bold"
                  >
                    <CiEdit size={18} />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      <Dialog
        open={editOpen}
        onOpenChange={(state) => {
          if (!state) {
            editFormReset();
            setEditId("");
            setEditOpen(state);
          }
        }}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit The Questions Of The Day</DialogTitle>
          </DialogHeader>

          <QuestionsOfTheDayForm
            errors={editErrors}
            handleSubmit={editHandleSubmit(handleEditQuestionsOfTheDay)}
            register={editRegister}
            setValue={editSetValue}
            watch={editWatch}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function QuestionsOfTheDayForm({
  errors,
  handleSubmit,
  register,
  setValue,
  watch,
}) {
  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <DatePicker
        name="date"
        register={register}
        setValue={setValue}
        watch={watch}
        error={errors.date}
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
  );
}
