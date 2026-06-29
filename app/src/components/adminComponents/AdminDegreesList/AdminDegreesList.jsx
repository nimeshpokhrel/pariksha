"use client";

import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";

import { FaPlus } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import useToast from "@/utils/useToast";
import Spinner from "@/utils/Spinner";
import DeleteDialog from "@/components/Dialog/DeleteDialog";

import DegreeForm from "./DegreeForm";
import {
  getDegrees,
  createDegree,
  deleteDegree,
  editDegree,
} from "@/hooks/admin/degree";
import BreadCrumbContainer from "../BreadCrumbContainer";

const SubjectSchema = z.object({
  code: z.string().optional(),
  title: z.string().optional(),
  marks: z.number().optional(),
});

const SemesterSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subjects: z.array(SubjectSchema).optional(),
  electives: z.array(z.string()).optional(),
});

export const degreeSchema = z.object({
  link: z.string().min(1, "Link is required"),
  name: z.string().min(1, "Name is required"),
  shortName: z.string().optional(),
  duration: z.number().min(1, "Duration is required"),
  semesterCount: z.number().min(1, "Semester count is required"),
  university: z.string().min(1, "University is required"),
  sector: z.string().min(1, "Sector is required"),
  coverImage: z.string().min(1, "Cover image is required"),
  description: z.string().min(1, "Description is required"),
  entranceCourse: z.string().optional(),
  eligibilityCriteria: z
    .array(
      z.object({
        title: z.string().min(1, "Title is required"),
        description: z.string().min(1, "Description is required"),
      })
    )
    .default([]),
  gradingTextUp: z.string().optional(),
  gradingSystem: z
    .array(
      z.object({
        letter: z.string().min(1, "Required"),
        scale: z.string().min(1, "Required"),
        point: z.string().min(1, "Required"),
      })
    )
    .default([]),
  gradingTextDown: z.string().optional(),
  courseStructure: z.array(SemesterSchema).default([]),
  faqs: z
    .array(
      z.object({
        question: z.string().min(1, "Question required"),
        answer: z.string().min(1, "Answer required"),
      })
    )
    .optional()
    .default([]),
  priority: z.number().default(20),
});

export default function AdminDegreesList() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState("");

  const { showToastSuccess, showToastError } = useToast();
  const { data: allDegrees } = useQuery({
    queryKey: ["degrees"],
    queryFn: () => getDegrees(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(degreeSchema),
    defaultValues: {
      areasOfStudy: [],
      careerProspect: [],
    },
  });

  const {
    register: editRegister,
    handleSubmit: editHandleSubmit,
    reset: editFormReset,
    formState: { errors: editErrors },
    setValue: editSetValue,
    watch: editWatch,
  } = useForm({ resolver: zodResolver(degreeSchema) });

  const queryClient = useQueryClient();

  const createDegreeMutation = useMutation({
    mutationFn: (formData) => createDegree(formData),
    onSuccess: () => {
      queryClient.invalidateQueries(["degrees"]);
      setOpen(false);
      showToastSuccess({ title: "Degree Added Successfully" });
    },
    onError: (error) => showToastError({ error }),
  });

  const deleteDegreeMutation = useMutation({
    mutationFn: (id) => deleteDegree(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["degrees"]);
      showToastSuccess({ title: "Degree Deleted Successfully" });
    },
    onError: (error) => showToastError({ error }),
  });

  const updateDegreeMutation = useMutation({
    mutationFn: (data) => editDegree(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["degrees"]);
      setEditOpen(false);
      showToastSuccess({ title: "Degree Edited Successfully" });
    },
    onError: (error) => showToastError({ error }),
  });

  const handleCreateDegree = (data, event) => {
    event.preventDefault();
    createDegreeMutation.mutate(data);
  };

  const handleDeleteDegree = (id) => () => {
    deleteDegreeMutation.mutate(id);
  };

  const handleEditDegree = (data, event) => {
    event.preventDefault();
    updateDegreeMutation.mutate({ id: editId, data });
  };

  const openEditDialog = (degree) => {
    setEditOpen(true);
    Object.entries(degree).forEach(([key, value]) => {
      if (key === "university") {
        editSetValue(`${key}`, value._id);
        return;
      }
      if (key === "sector") {
        editSetValue(`${key}`, value._id);
        return;
      }
      editSetValue(`${key}`, value);
    });

    setEditId(degree._id);
  };

  return (
    <div className="flex flex-col gap-10 p-4 pt-8">
      {(createDegreeMutation.isPending ||
        deleteDegreeMutation.isPending ||
        updateDegreeMutation.isPending) && <Spinner />}

      <Dialog open={open} onOpenChange={setOpen}>
        <div>
          <BreadCrumbContainer degrees={true} />
          <div className="flex items-center justify-between">
            <h1 className="mt-1 text-xl font-bold">Degrees</h1>
            <DialogTrigger className="flex w-max items-center gap-4 rounded-md bg-primary px-4 py-1.5 font-bold text-white">
              <FaPlus size={12} />
              Add Degree
            </DialogTrigger>
          </div>
        </div>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-semibold">
              Add a New Degree
            </DialogTitle>
          </DialogHeader>
          <DegreeForm
            errors={errors}
            handleSubmit={handleSubmit(handleCreateDegree)}
            register={register}
            setValue={setValue}
            watch={watch}
          />
        </DialogContent>
      </Dialog>

      {allDegrees &&
        allDegrees.length > 0 &&
        allDegrees.map((degree) => (
          <div
            className="rounded-lg border border-solid border-[#d1d7dc] p-4 hover:bg-gray-light"
            key={degree._id}
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <h1 className="text-lg font-semibold">{degree.name}</h1>
                <p className="ml-2 text-sm text-gray-500">
                  {degree.shortName} - {degree.university.name}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <DeleteDialog
                  title={"Are you sure you want to delete this Degree?"}
                  description={degree.name}
                  returnId={degree._id}
                  deleteFunction={handleDeleteDegree}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => openEditDialog(degree)}
                  className="h-max w-max rounded-md border border-black px-2 py-1 text-xs font-bold"
                >
                  <CiEdit size={18} />
                </Button>
              </div>
            </div>
          </div>
        ))}

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
            <DialogTitle>Edit Degree Information</DialogTitle>
          </DialogHeader>
          <DegreeForm
            errors={editErrors}
            handleSubmit={editHandleSubmit(handleEditDegree)}
            register={editRegister}
            setValue={editSetValue}
            watch={editWatch}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
