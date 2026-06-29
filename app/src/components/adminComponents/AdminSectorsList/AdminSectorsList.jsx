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
  createSector,
  deleteSector,
  editSector,
  getSectors,
} from "@/hooks/admin/sector";

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
import SectorForm from "./SectorForm";
import BreadCrumbContainer from "../BreadCrumbContainer";

const sectorSchema = z.object({
  link: z.string().min(1, "Link is required"),
  name: z.string().min(1, "Name is required"),
  coverImage: z.string().min(3, "Please provide a valid image link"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters long"),
  areasOfStudy: z
    .array(
      z.object({
        title: z.string().min(1, "Area title is required"),
        description: z.string().min(1, "Area description is required"),
      })
    )
    .min(1, "At least one area of study is required"),
  careerProspect: z
    .array(
      z.object({
        title: z.string().min(1, "Career prospect title is required"),
        icon: z.string().min(1, "Career prospect icon is required"),
      })
    )
    .min(1, "At least one career prospect is required"),
});

export default function AdminSectorsList() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState("");

  const { showToastSuccess, showToastError } = useToast();
  const { data: allSectors } = useQuery({
    queryKey: ["sectors"],
    queryFn: () => getSectors(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(sectorSchema),
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
  } = useForm({ resolver: zodResolver(sectorSchema) });

  const queryClient = useQueryClient();

  const createSectorMutation = useMutation({
    mutationFn: (formData) => createSector(formData),
    onSuccess: () => {
      queryClient.invalidateQueries(["sectors"]);
      setOpen(false);
      showToastSuccess({ title: "Sector Added Successfully" });
    },
    onError: (error) => showToastError({ error }),
  });

  const deleteSectorMutation = useMutation({
    mutationFn: (id) => deleteSector(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["sectors"]);
      showToastSuccess({ title: "Sector Deleted Successfully" });
    },
    onError: (error) => showToastError({ error }),
  });

  const updateSectorMutation = useMutation({
    mutationFn: (data) => editSector(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["sectors"]);
      setEditOpen(false);
      showToastSuccess({ title: "Sector Edited Successfully" });
    },
    onError: (error) => showToastError({ error }),
  });

  const handleCreateSector = (data, event) => {
    event.preventDefault();
    createSectorMutation.mutate(data);
  };

  const handleDeleteSector = (id) => () => {
    deleteSectorMutation.mutate(id);
  };

  const handleEditSector = (data, event) => {
    event.preventDefault();
    updateSectorMutation.mutate({ id: editId, data });
  };

  const openEditDialog = (sector) => {
    // setCurrentSector(sector);
    setEditOpen(true);
    Object.entries(sector).forEach(([key, value]) => {
      editSetValue(`${key}`, value);
    });

    setEditId(sector._id);
  };

  return (
    <div className="flex flex-col gap-10 p-4 pt-8">
      {(createSectorMutation.isPending ||
        deleteSectorMutation.isPending ||
        updateSectorMutation.isPending) && <Spinner />}

      <Dialog open={open} onOpenChange={setOpen}>
        <div>
          <BreadCrumbContainer sectors={true} />
          <div className="flex items-center justify-between">
            <h1 className="mt-1 text-xl font-bold">Sectors</h1>
            <DialogTrigger className="flex w-max items-center gap-4 rounded-md bg-primary px-4 py-1.5 font-bold text-white">
              <FaPlus size={12} />
              Add Sector
            </DialogTrigger>
          </div>
        </div>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-semibold">
              Add a New Sector
            </DialogTitle>
          </DialogHeader>
          <SectorForm
            errors={errors}
            handleSubmit={handleSubmit(handleCreateSector)}
            register={register}
            setValue={setValue}
            watch={watch}
          />
        </DialogContent>
      </Dialog>

      {allSectors &&
        allSectors.length > 0 &&
        allSectors.map((sector) => (
          <div
            className="rounded-lg border border-solid border-[#d1d7dc] p-4 hover:bg-gray-light"
            key={sector._id}
          >
            <div className="flex items-center justify-between gap-2">
              <h1 className="text-lg font-semibold">{sector.name}</h1>
              <div className="flex items-center gap-2">
                <DeleteDialog
                  title={"Are you sure you want to delete this Sector?"}
                  description={sector.name}
                  returnId={sector._id}
                  deleteFunction={handleDeleteSector}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => openEditDialog(sector)}
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
            <DialogTitle>Edit Sector Information</DialogTitle>
          </DialogHeader>
          <SectorForm
            errors={editErrors}
            handleSubmit={editHandleSubmit(handleEditSector)}
            register={editRegister}
            setValue={editSetValue}
            watch={editWatch}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
