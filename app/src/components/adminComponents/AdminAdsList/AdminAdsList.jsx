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
import BreadCrumbContainer from "../BreadCrumbContainer";
import { getAds } from "@/hooks/ad";
import AdForm from "./AdForm";
import { createAd, deleteAd, editAd } from "@/hooks/admin/ad";

export const adFormSchema = z.object({
  banner100: z
    .string()
    .trim()
    .url({ message: "Must be a valid URL" })
    .nonempty({ message: "Banner 100 is required" }),

  banner200: z
    .string()
    .trim()
    .url({ message: "Must be a valid URL" })
    .nonempty({ message: "Banner 200 is required" }),

  fullPageMobile: z
    .string()
    .trim()
    .url({ message: "Must be a valid URL" })
    .nonempty({ message: "Full Page Mobile is required" }),

  fullPageDesktop: z
    .string()
    .trim()
    .url({ message: "Must be a valid URL" })
    .nonempty({ message: "Full Page Desktop is required" }),

  video: z.string().trim().nonempty({ message: "Video URL is required" }),

  link: z.string().trim().nonempty({ message: "Please select a college" }),

  probability: z
    .number()
    .min(0, { message: "Must be at least 0" })
    .max(1, { message: "Must be at most 1" }),

  location: z.string().trim().optional(),
});

export default function AdminAdsList() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState("");

  const { showToastSuccess, showToastError } = useToast();
  const { data: allAds } = useQuery({
    queryKey: ["allAds"],
    queryFn: () => getAds(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(adFormSchema),
    defaultValues: {
      location: "Kathmandu",
    },
  });

  const {
    register: editRegister,
    handleSubmit: editHandleSubmit,
    reset: editFormReset,
    formState: { errors: editErrors },
    setValue: editSetValue,
    watch: editWatch,
  } = useForm({ resolver: zodResolver(adFormSchema) });

  const queryClient = useQueryClient();

  const createAdMutation = useMutation({
    mutationFn: (formData) => createAd(formData),
    onSuccess: () => {
      queryClient.invalidateQueries(["allAds"]);
      setOpen(false);
      showToastSuccess({ title: "Ad Added Successfully" });
    },
    onError: (error) => showToastError({ error }),
  });

  const deleteAdMutation = useMutation({
    mutationFn: (id) => deleteAd(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["allAds"]);
      showToastSuccess({ title: "Ad Deleted Successfully" });
    },
    onError: (error) => showToastError({ error }),
  });

  const updateAdMutation = useMutation({
    mutationFn: (data) => editAd(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["allAds"]);
      setEditOpen(false);
      showToastSuccess({ title: "Ad Edited Successfully" });
    },
    onError: (error) => showToastError({ error }),
  });

  const handleCreateAd = (data, event) => {
    event.preventDefault();
    createAdMutation.mutate(data);
  };

  const handleDeleteAd = (id) => () => {
    deleteAdMutation.mutate(id);
  };

  const handleEditAd = (data, event) => {
    event.preventDefault();
    updateAdMutation.mutate({ id: editId, data });
  };

  const openEditDialog = (ad) => {
    setEditOpen(true);
    Object.entries(ad).forEach(([key, value]) => {
      if (key === "value") {
        Object.entries(ad.value).forEach(([objKey, objValue]) => {
          editSetValue(`${objKey}`, objValue);
        });
      } else {
        editSetValue(`${key}`, value);
      }
    });
    setEditId(ad._id);
  };

  return (
    <div className="flex flex-col gap-10 p-4 pt-8">
      {(createAdMutation.isPending ||
        deleteAdMutation.isPending ||
        updateAdMutation.isPending) && <Spinner />}

      <Dialog open={open} onOpenChange={setOpen}>
        <div>
          <BreadCrumbContainer ads={true} />
          <div className="flex items-center justify-between">
            <h1 className="mt-1 text-xl font-bold">College Ads</h1>
            <DialogTrigger className="flex w-max items-center gap-4 rounded-md bg-primary px-4 py-1.5 font-bold text-white">
              <FaPlus size={12} />
              Add Ad
            </DialogTrigger>
          </div>
        </div>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-semibold">
              Add a New Ad
            </DialogTitle>
          </DialogHeader>
          <AdForm
            errors={errors}
            handleSubmit={handleSubmit(handleCreateAd)}
            register={register}
            setValue={setValue}
            watch={watch}
          />
        </DialogContent>
      </Dialog>

      {allAds &&
        allAds.length > 0 &&
        allAds.map((ad) => (
          <div
            className="rounded-lg border border-solid border-[#d1d7dc] p-4 hover:bg-gray-light"
            key={ad._id}
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <h1 className="text-lg font-semibold">{ad.value.link}</h1>
              </div>
              <div className="flex items-center gap-2">
                <DeleteDialog
                  title={
                    "Are you sure you want to delete this Ad For the college:"
                  }
                  description={ad.name}
                  returnId={ad._id}
                  deleteFunction={handleDeleteAd}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => openEditDialog(ad)}
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
            <DialogTitle>Edit Ad Information</DialogTitle>
          </DialogHeader>
          <AdForm
            errors={editErrors}
            handleSubmit={editHandleSubmit(handleEditAd)}
            register={editRegister}
            setValue={editSetValue}
            watch={editWatch}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
