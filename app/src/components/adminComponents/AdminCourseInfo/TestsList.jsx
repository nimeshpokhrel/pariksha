import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { SortableListContainer } from "../SortableList";
import { SortableItem } from "../SortableItem";
import useToast from "@/utils/useToast";
import Spinner from "@/utils/Spinner";
import AddQuestionSet from "../AdminForms/AddQuestionSet";
import {
  createQuestionSet,
  deleteQuestionSet,
  editQuestionSet,
  editQuestionSetArray,
} from "@/hooks/admin/questionSet";
import EditQuestionSet from "../AdminForms/EditQuestionSet";

export default function TestsList({ courseData }) {
  const courseId = courseData._id;
  const [courseQuestionSets, setCourseQuestionSets] = useState([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const [editQuestionSets, setEditQuestionSets] = useState(false);
  const { showToastSuccess, showToastError } = useToast();
  const queryClient = useQueryClient();

  const createQuestionSetMutation = useMutation({
    mutationFn: (formData) => createQuestionSet(formData),
    onSuccess: () => {
      queryClient.invalidateQueries(["course-details", courseData._id]);
      setAddDialogOpen(false);
      showToastSuccess({ title: "Question Set Added Successfully" });
    },
    onError: (error) => {
      showToastError({ error });
    },
  });
  const updateQuestionSetsArrayMutation = useMutation({
    mutationFn: (data) => editQuestionSetArray(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["course-details", courseId]);
      setEditQuestionSets(false);
      showToastSuccess({ title: "Question Sets Edited Successfully" });
    },
    onError: (error) => {
      showToastError({ error });
    },
  });
  const deleteQuestionSetMutation = useMutation({
    mutationFn: (id) => deleteQuestionSet({ id, courseId }),
    onSuccess: () => {
      queryClient.invalidateQueries(["course-details", courseId]);
      showToastSuccess({ title: "Question Set Deleted Successfully" });
    },
    onError: (error) => {
      showToastError({ error });
    },
  });
  const updateQuestionSetMutation = useMutation({
    mutationFn: (data) => editQuestionSet(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["course-details", courseId]);
      showToastSuccess({ title: "Question Set Edited Successfully" });
    },
    onError: (error) => {
      showToastError({ error });
    },
  });

  useEffect(() => {
    if (courseData) {
      setCourseQuestionSets(courseData.questionSets);
    }
  }, [courseData]);

  const handleCreateQuestionSet = (data) => {
    createQuestionSetMutation.mutate({ ...data, courseId });
  };

  const saveEditedSubjects = () => {
    const listArray = courseQuestionSets.map((questionSet) => questionSet._id);
    updateQuestionSetsArrayMutation.mutate({
      data: listArray,
      id: courseData._id,
    });
  };
  const cancelSubjectEdit = () => {
    setCourseQuestionSets(courseData.questionSets);
    setEditQuestionSets(false);
  };

  const handleDeleteQuestionSet = (id) => () => {
    deleteQuestionSetMutation.mutate(id);
  };

  const handleEditSubject = (data, id) => {
    updateQuestionSetMutation.mutate({ id, data });
  };

  return (
    <div className="w-full">
      {(createQuestionSetMutation.isPending ||
        updateQuestionSetsArrayMutation.isPending ||
        deleteQuestionSetMutation.isPending ||
        updateQuestionSetMutation.isPending) && <Spinner />}

      <SortableListContainer
        listItems={courseQuestionSets}
        changeListItems={setCourseQuestionSets}
        title={`Course Question Sets`}
        enableEdit={editQuestionSets}
        saveEdit={saveEditedSubjects}
        cancelEdit={cancelSubjectEdit}
        onEditClick={() => setEditQuestionSets(true)}
        addDialogExists={true}
        dialogOpen={addDialogOpen}
        setDialogOpen={setAddDialogOpen}
        addButtonTitle={"Add Question Set"}
        addDialogTitle={"Add a New Question Set"}
        form={<AddQuestionSet handleFormSubmit={handleCreateQuestionSet} />}
      >
        {courseQuestionSets?.length > 0 &&
          courseQuestionSets.map((questionSet) => (
            <SortableItem
              key={questionSet._id}
              id={questionSet._id}
              link={`/admin/courses/${courseData._id}/tests/${questionSet._id}`}
              title={questionSet.title}
              description={`${questionSet.setType === "mock" ? "Mock Test" : "Past Question"} | ${questionSet.number} | ${questionSet.link} 
              `}
              enableEdit={editQuestionSets}
              handleDelete={handleDeleteQuestionSet}
              editDialog={
                <EditQuestionSet
                  questionSet={questionSet}
                  handleEditItem={handleEditSubject}
                />
              }
            />
          ))}
      </SortableListContainer>
    </div>
  );
}
