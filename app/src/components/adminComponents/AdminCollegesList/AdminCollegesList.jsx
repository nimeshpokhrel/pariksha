"use client";

import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
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
import BreadCrumbContainer from "../BreadCrumbContainer";
import CollegeForm from "./CollegeForm";
import {
  createCollege,
  deleteCollege,
  editCollege,
  getColleges,
} from "@/hooks/admin/college";
import DeleteDialog from "@/components/Dialog/DeleteDialog";

const collegeSchema = z.object({
  link: z.string().min(1, "Link is required"),
  name: z.string().min(1, "Name is required"),
  logo: z.string().min(3, "Please provide a valid image link"),
  university: z.string().min(1, "Affiliated University is required"),
  degrees: z.array(z.string().min(1, "Degree is required")),
  coverImage: z.string().min(3, "Please provide a valid image link"),
  location: z.string().min(1, "Location is required"),
  facebookLink: z.string().optional(),
  instagramLink: z.string().optional(),
  websiteLink: z.string().optional(),
  emailLink: z.string().optional(),
  phoneNumber: z.string().min(1, "Phone number is required"),
  heading: z.string().min(1, "Heading is required"),
  description: z.string().min(1, "Description is required"),
  foundedYear: z.string().min(1, "Founded year is required"),
  salientFeatures: z.array(z.string()).optional(),
  gallery: z.array(z.string()).optional(),
  faqs: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string(),
      })
    )
    .optional()
    .default([]),
  priority: z.number().default(20),
});

export default function AdminCollegesList() {
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
  } = useForm({
    resolver: zodResolver(collegeSchema),
    defaultValues: {
      faqs: [],
      salientFeatures: [],
      gallery: [],
    },
  });

  const {
    register: editRegister,
    handleSubmit: editHandleSubmit,
    reset: editFormReset,
    formState: { errors: editErrors },
    watch: editWatch,
    setValue: editSetValue,
  } = useForm({ resolver: zodResolver(collegeSchema) });

  const queryClient = useQueryClient();

  const { data: allColleges } = useQuery({
    queryKey: ["colleges"],
    queryFn: () => getColleges(),
  });

  const createCollegeMutation = useMutation({
    mutationFn: (formData) => createCollege(formData),
    onSuccess: () => {
      queryClient.invalidateQueries(["colleges"]);
      setOpen(false);
      showToastSuccess({ title: "College Added Successfully" });
    },
    onError: (error) => {
      showToastError({ error });
    },
  });
  const deleteCollegeMutation = useMutation({
    mutationFn: (id) => deleteCollege(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["colleges"]);
      showToastSuccess({ title: "College Deleted Successfully" });
    },
    onError: (error) => {
      showToastError({ error });
    },
  });
  const updateCollegeMutation = useMutation({
    mutationFn: (data) => editCollege(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["colleges"]);
      setEditOpen(false);
      showToastSuccess({ title: "College Edited Successfully" });
    },
    onError: (error) => {
      showToastError({ error });
    },
  });

  const handleCreateCollege = (data, event) => {
    event.preventDefault();
    console.log(data);
    createCollegeMutation.mutate(data);
  };
  const handleDeleteCollege = (id) => () => {
    deleteCollegeMutation.mutate(id);
  };
  const handleEditCollege = (data, event) => {
    event.preventDefault();
    updateCollegeMutation.mutate({ id: editId, data });
  };

  const openEditDialog = (degree) => {
    setEditOpen(true);
    Object.entries(degree).forEach(([key, value]) => {
      if (key === "university") {
        editSetValue(`${key}`, value._id);
        return;
      }
      if (key === "degrees") {
        editSetValue(
          `${key}`,
          value.map((degree) => degree._id)
        );
        return;
      }
      editSetValue(`${key}`, value);
    });

    setEditId(degree._id);
  };

  return (
    <div className="flex flex-col gap-10 p-4 pt-8">
      {(createCollegeMutation.isPending ||
        deleteCollegeMutation.isPending ||
        updateCollegeMutation.isPending) && <Spinner />}
      <Dialog open={open} onOpenChange={setOpen}>
        <div>
          <BreadCrumbContainer colleges={true} />
          <div className="flex items-center justify-between">
            <h1 className="mt-1 text-xl font-bold">Colleges</h1>
            <DialogTrigger className="flex w-max items-center gap-4 rounded-md bg-primary px-4 py-1.5 font-bold text-white max-[550px]:text-xs">
              <FaPlus size={12} />
              ADD College
            </DialogTrigger>
          </div>
        </div>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-semibold">
              Add a new College
            </DialogTitle>
          </DialogHeader>
          <CollegeForm
            watch={watch}
            setValue={setValue}
            register={register}
            handleSubmit={handleSubmit(handleCreateCollege)}
            errors={errors}
          />
        </DialogContent>
      </Dialog>

      {allColleges &&
        allColleges.length > 0 &&
        allColleges.map((college) => (
          <div
            className="rounded-lg border border-solid border-[#d1d7dc] p-4 hover:bg-gray-light"
            key={college._id}
          >
            <div className="flex items-center justify-between gap-2">
              <h1 className="text-lg font-semibold">{college.name}</h1>
              <div className="flex items-center gap-2">
                <DeleteDialog
                  title={"Are you sure you want to delete this College?"}
                  description={college.name}
                  returnId={college._id}
                  deleteFunction={handleDeleteCollege}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => openEditDialog(college)}
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
          <CollegeForm
            errors={editErrors}
            handleSubmit={editHandleSubmit(handleEditCollege)}
            register={editRegister}
            setValue={editSetValue}
            watch={editWatch}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
