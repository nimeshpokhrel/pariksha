"use client";

import { fetchCourses, useFetchCourses } from "@/hooks/courses";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import Link from "next/link";
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
import { createCourse, deleteCourse, editCourse } from "@/hooks/admin/course";
import useToast from "@/utils/useToast";
import Spinner from "@/utils/Spinner";

import { CiEdit } from "react-icons/ci";
import DeleteDialog from "@/components/Dialog/DeleteDialog";
import BreadCrumbContainer from "../BreadCrumbContainer";
import CourseForm from "./CourseForm";

const courseSchema = z.object({
  title: z.string().min(6, "Title must be at least 6 characters long"),
  link: z.string().min(3, "Please provide a valid link"),
  image: z.string().optional().nullable(),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters long"),
});

export default function AdminCoursesList() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState("");

  const { showToastSuccess, showToastError } = useToast();

  // const { data: allCourses } = useQuery({
  //   queryKey: ["courses"],
  //   queryFn: () => fetchCourses(),
  // });

  const { data: allCourses } = useFetchCourses();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({ resolver: zodResolver(courseSchema) });

  const {
    register: editRegister,
    handleSubmit: editHandleSubmit,
    reset: editFormReset,
    formState: { errors: editErrors },
    setValue: editSetValue,
    watch: editWatch,
  } = useForm({ resolver: zodResolver(courseSchema) });

  const queryClient = useQueryClient();

  const createCourseMutation = useMutation({
    mutationFn: (formData) => createCourse(formData),
    onSuccess: () => {
      queryClient.invalidateQueries(["courses"]);
      setOpen(false);
      showToastSuccess({ title: "Course Added Successfully" });
    },
    onError: (error) => {
      showToastError({ error });
    },
  });
  const deleteCourseMutation = useMutation({
    mutationFn: (id) => deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["courses"]);
      showToastSuccess({ title: "Course Deleted Successfully" });
    },
    onError: (error) => {
      showToastError({ error });
    },
  });
  const updateCourseMutation = useMutation({
    mutationFn: (data) => editCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["courses"]);
      editFormReset();
      setEditOpen(false);
      showToastSuccess({ title: "Course Edited Successfully" });
    },
    onError: (error) => {
      showToastError({ error });
    },
  });

  const handleCreateCourse = (data, event) => {
    event.preventDefault();
    createCourseMutation.mutate(data);
  };
  const handleDeleteCourse = (id) => () => {
    deleteCourseMutation.mutate(id);
  };

  const handleEditCourse = (data, event) => {
    event.preventDefault();
    updateCourseMutation.mutate({ id: editId, data });
  };

  const openEditDialog = (course) => {
    setEditOpen(true);
    Object.entries(course).forEach(([key, value]) => {
      editSetValue(`${key}`, value);
    });
    setEditId(course._id);
  };

  return (
    <div className="flex flex-col gap-10 p-4 pt-8">
      {(createCourseMutation.isPending ||
        deleteCourseMutation.isPending ||
        updateCourseMutation.isPending) && <Spinner />}
      <Dialog open={open} onOpenChange={setOpen}>
        <div>
          <BreadCrumbContainer courses={true} />
          <div className="flex items-center justify-between">
            <h1 className="mt-1 text-xl font-bold">Courses</h1>
            <DialogTrigger className="flex w-max items-center gap-4 rounded-md bg-primary px-4 py-1.5 font-bold text-white max-[550px]:text-xs">
              <FaPlus size={12} />
              ADD COURSE
            </DialogTrigger>
          </div>
        </div>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-semibold">
              Add a new Course
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(handleCreateCourse)} className="mt-6">
            <CourseForm
              errors={errors}
              handleSubmit={handleSubmit(handleCreateCourse)}
              register={register}
              setValue={setValue}
              watch={watch}
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

      {allCourses &&
        allCourses.length > 0 &&
        allCourses.map((course, index) => {
          return (
            <div
              className="rounded-lg border border-solid border-[#d1d7dc] p-4 hover:bg-gray-light"
              key={index}
            >
              <div className="flex items-center justify-between gap-2">
                <h1 className="mb-2 text-lg font-semibold">
                  <Link href={`/admin/courses/${course._id}`} key={index}>
                    {course.title}
                  </Link>
                </h1>
                <div className="flex items-center gap-2">
                  <DeleteDialog
                    title={"Are you sure you want to delete this course ? "}
                    description={course.title}
                    returnId={course._id}
                    deleteFunction={handleDeleteCourse}
                  />

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => openEditDialog(course)}
                    className="h-max w-max rounded-md border border-black px-2 py-1 text-xs font-bold"
                  >
                    <CiEdit size={18} />
                  </Button>
                </div>
              </div>
              <p className="text-sm">
                Question Sets : {course.questionSetCount}
                <span className="ml-8">Subjects : {course.subjectCount}</span>
              </p>
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

          <CourseForm
            errors={editErrors}
            handleSubmit={editHandleSubmit(handleEditCourse)}
            register={editRegister}
            setValue={editSetValue}
            watch={editWatch}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
