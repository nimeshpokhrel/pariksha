"use client";

import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import {
  createUniversity,
  deleteUniversity,
  editUniversity,
} from "@/hooks/admin/university";
import {
  Dialog,
  DialogContent,
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
import { getUniversities } from "@/hooks/admin/university";
import BreadCrumbContainer from "../BreadCrumbContainer";
import UniversityForm from "./UniversityForm";

const universitySchema = z.object({
  link: z.string().min(1, "Link is required"),
  name: z.string().min(6, "Name must be at least 6 characters long"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters long"),
  logo: z.string().min(3, "Please provide a valid image link"),
  coverImage: z.string().min(3, "Please provide a valid image link"),
  websiteLink: z.string().min(3, "Please provide a valid link"),
  establishments: z.string().min(1, "Please provide a valid establishments"),
  location: z.string().min(1, "Please provide a valid location"),
  foundedYear: z.string().min(1, "Please provide a valid foundedYear"),
  students: z.string().min(1, "Please provide a valid students"),
  ownership: z.enum(["Public", "Private", "Government", "Semi-Government"]),
});

export default function AdminUniversitiesList() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState("");

  const { showToastSuccess, showToastError } = useToast();

  const { data: allUniversities } = useQuery({
    queryKey: ["universities"],
    queryFn: () => getUniversities(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({ resolver: zodResolver(universitySchema) });

  const {
    register: editRegister,
    handleSubmit: editHandleSubmit,
    reset: editFormReset,
    formState: { errors: editErrors },
    setValue: editSetValue,
    watch: editWatch,
  } = useForm({ resolver: zodResolver(universitySchema) });

  const queryClient = useQueryClient();

  const createUniversityMutation = useMutation({
    mutationFn: (formData) => createUniversity(formData),
    onSuccess: () => {
      queryClient.invalidateQueries(["universities"]);
      setOpen(false);
      showToastSuccess({ title: "University Added Successfully" });
    },
    onError: (error) => {
      showToastError({ error });
    },
  });
  const deleteUniversityMutation = useMutation({
    mutationFn: (id) => deleteUniversity(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["universities"]);
      showToastSuccess({ title: "University Deleted Successfully" });
    },
    onError: (error) => {
      showToastError({ error });
    },
  });
  const updateUniversityMutation = useMutation({
    mutationFn: (data) => editUniversity(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["universities"]);
      setEditOpen(false);
      showToastSuccess({ title: "University Edited Successfully" });
    },
    onError: (error) => {
      showToastError({ error });
    },
  });

  const handleCreateUniversity = (data, event) => {
    event.preventDefault();
    createUniversityMutation.mutate(data);
  };
  const handleDeleteUniversity = (id) => () => {
    deleteUniversityMutation.mutate(id);
  };
  const handleEditUniversity = (data, event) => {
    event.preventDefault();
    updateUniversityMutation.mutate({ id: editId, data });
  };

  const openEditDialog = (university) => {
    // setCurrentSector(sector);
    setEditOpen(true);
    Object.entries(university).forEach(([key, value]) => {
      editSetValue(`${key}`, value);
    });

    setEditId(university._id);
  };

  return (
    <div className="flex flex-col gap-10 p-4 pt-8">
      {(createUniversityMutation.isPending ||
        deleteUniversityMutation.isPending ||
        updateUniversityMutation.isPending) && <Spinner />}
      <Dialog open={open} onOpenChange={setOpen}>
        <div>
          <BreadCrumbContainer universities={true} />
          <div className="flex items-center justify-between">
            <h1 className="mt-1 text-xl font-bold">Universities</h1>
            <DialogTrigger className="flex w-max items-center gap-4 rounded-md bg-primary px-4 py-1.5 font-bold text-white max-[550px]:text-xs">
              <FaPlus size={12} />
              ADD University
            </DialogTrigger>
          </div>
        </div>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-semibold">
              Add a new University
            </DialogTitle>
          </DialogHeader>

          <UniversityForm
            errors={errors}
            handleSubmit={handleSubmit(handleCreateUniversity)}
            register={register}
            setValue={setValue}
            watch={watch}
          />
        </DialogContent>
      </Dialog>

      {allUniversities &&
        allUniversities?.length > 0 &&
        allUniversities?.map((university) => {
          return (
            <div
              className="rounded-lg border border-solid border-[#d1d7dc] p-4 hover:bg-gray-light"
              key={university._id}
            >
              <div className="flex items-center justify-between gap-2">
                <h1 className="text-lg font-semibold">{university.name}</h1>
                <div className="flex items-center gap-2">
                  <DeleteDialog
                    title={"Are you sure you want to delete this University ? "}
                    description={university.name}
                    returnId={university._id}
                    deleteFunction={handleDeleteUniversity}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => openEditDialog(university)}
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
            <DialogTitle>Edit The Course Information</DialogTitle>
          </DialogHeader>

          <UniversityForm
            errors={editErrors}
            handleSubmit={editHandleSubmit(handleEditUniversity)}
            register={editRegister}
            setValue={editSetValue}
            watch={editWatch}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
