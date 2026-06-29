import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { SortableListContainer } from "../SortableList";
import { SortableItem } from "../SortableItem";
import useToast from "@/utils/useToast";
import Spinner from "@/utils/Spinner";
import {
  createSubject,
  deleteSubject,
  editSubject,
  editSubjectArray,
} from "@/hooks/admin/subject";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { CiEdit } from "react-icons/ci";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SubjectForm from "./SubjectForm";

const subjectSchema = z.object({
  title: z.string().min(1, "Please Enter a valid title"),
  link: z.string().min(1, "Please provide a valid link"),
  duration: z.string().min(1, "Please provide a valid duration"),
  image: z.string().optional().nullable(),
});

export default function SubjectsList({ courseData }) {
  const courseId = courseData._id;
  const [courseSubjects, setCourseSubjects] = useState([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState("");

  const [editSubjects, setEditSubjects] = useState(false);
  const { showToastSuccess, showToastError } = useToast();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({ resolver: zodResolver(subjectSchema) });

  const {
    register: editRegister,
    handleSubmit: editHandleSubmit,
    reset: editFormReset,
    formState: { errors: editErrors },
    setValue: editSetValue,
    watch: editWatch,
  } = useForm({ resolver: zodResolver(subjectSchema) });

  const createSubjectMutation = useMutation({
    mutationFn: (formData) => createSubject(formData),
    onSuccess: () => {
      queryClient.invalidateQueries(["course-details", courseId]);
      editFormReset();
      setAddDialogOpen(false);
      showToastSuccess({ title: "Subject Added Successfully" });
    },
    onError: (error) => {
      showToastError({ error });
    },
  });
  const updateSubjectsArrayMutation = useMutation({
    mutationFn: (data) => editSubjectArray(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["course-details", courseId]);
      setEditSubjects(false);
      showToastSuccess({ title: "Subjects Edited Successfully" });
    },
    onError: (error) => {
      showToastError({ error });
    },
  });
  const deleteSubjectMutation = useMutation({
    mutationFn: (id) => deleteSubject({ id, courseId }),
    onSuccess: () => {
      queryClient.invalidateQueries(["course-details", courseId]);
      showToastSuccess({ title: "Subject Deleted Successfully" });
    },
    onError: (error) => {
      showToastError({ error });
    },
  });
  const updateSubjectMutation = useMutation({
    mutationFn: (data) => editSubject(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["course-details", courseId]);
      setEditOpen(false);
      showToastSuccess({ title: "Subject Edited Successfully" });
    },
    onError: (error) => {
      showToastError({ error });
    },
  });

  useEffect(() => {
    if (courseData) {
      setCourseSubjects(courseData.subjects);
    }
  }, [courseData]);

  const handleCreateSubject = (data, event) => {
    event.preventDefault();
    createSubjectMutation.mutate({ ...data, courseId });
  };

  const saveEditedSubjects = () => {
    const listArray = courseSubjects.map((subject) => subject._id);
    updateSubjectsArrayMutation.mutate({
      data: listArray,
      id: courseData._id,
    });
  };
  const cancelSubjectEdit = () => {
    setCourseSubjects(courseData.subjects);
    setEditSubjects(false);
  };

  const handleDeleteSubject = (id) => () => {
    deleteSubjectMutation.mutate(id);
  };

  const handleEditSubject = (data, event) => {
    event.preventDefault();
    updateSubjectMutation.mutate({ id: editId, data });
  };

  const openEditDialog = (subject) => {
    console.log(subject);
    setEditOpen(true);
    Object.entries(subject).forEach(([key, value]) => {
      editSetValue(`${key}`, value);
    });
    setEditId(subject._id);
  };
  return (
    <div className="mb-20 w-full">
      {(createSubjectMutation.isPending ||
        updateSubjectsArrayMutation.isPending ||
        deleteSubjectMutation.isPending ||
        updateSubjectMutation.isPending) && <Spinner />}
      <SortableListContainer
        listItems={courseSubjects}
        changeListItems={setCourseSubjects}
        title={`Course Subjects`}
        enableEdit={editSubjects}
        saveEdit={saveEditedSubjects}
        cancelEdit={cancelSubjectEdit}
        onEditClick={() => setEditSubjects(true)}
        addDialogExists={true}
        dialogOpen={addDialogOpen}
        setDialogOpen={setAddDialogOpen}
        addButtonTitle={"Add Subject"}
        addDialogTitle={"Add a New Subject"}
        form={
          <SubjectForm
            errors={errors}
            handleSubmit={handleSubmit(handleCreateSubject)}
            register={register}
            setValue={setValue}
            watch={watch}
          />
        }
      >
        {courseSubjects?.length > 0 &&
          courseSubjects.map((subject) => (
            <SortableItem
              key={subject._id}
              id={subject._id}
              link={`/admin/courses/${courseData._id}/videos/${subject._id}`}
              title={subject.title}
              description={`${subject.videoCount} videos | ${subject.duration}`}
              enableEdit={editSubjects}
              handleDelete={handleDeleteSubject}
              deleteTitle={`Are you sure you want to delete this subject ? This will delete all the videos and questions related to this subject.`}
              editDialog={
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => openEditDialog(subject)}
                  className="h-max w-max rounded-md border border-black px-2 py-1 text-xs font-bold"
                >
                  <CiEdit size={18} />
                </Button>
              }
            />
          ))}
      </SortableListContainer>
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
            <DialogTitle>Edit The Subject Information</DialogTitle>
          </DialogHeader>

          <SubjectForm
            errors={editErrors}
            handleSubmit={editHandleSubmit(handleEditSubject)}
            register={editRegister}
            setValue={editSetValue}
            watch={editWatch}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
