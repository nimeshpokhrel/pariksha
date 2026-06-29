import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getQuestionSetData } from "@/hooks/admin/questionSet";

import { useEffect, useState } from "react";
import { SortableListContainer } from "../SortableList";
import { SortableItem } from "../SortableItem";

import useToast from "@/utils/useToast";
import Spinner from "@/utils/Spinner";

import {
  deleteQuestionSubject,
  editQuestionSubjectArray,
} from "@/hooks/admin/questionSubject";
import BreadCrumbContainer from "../BreadCrumbContainer";

export default function AdminQuestionSetInfo({ courseId, questionSetId }) {
  const [questionSetSubjects, setQuestionSetSubjects] = useState([]);
  const [editSubjects, setEditSubjects] = useState(false);

  const { showToastSuccess, showToastError } = useToast();
  const queryClient = useQueryClient();

  const { data: questionSetData } = useQuery({
    queryKey: ["questionSetData", questionSetId],
    queryFn: (context) => {
      const [, questionSetId] = context.queryKey;
      return getQuestionSetData(questionSetId);
    },
  });

  useEffect(() => {
    if (questionSetData) {
      setQuestionSetSubjects(questionSetData.subjects);
    }
  }, [questionSetData]);

  const updateSubjectsArrayMutation = useMutation({
    mutationFn: (data) => editQuestionSubjectArray(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["questionSetData", questionSetId]);
      setEditSubjects(false);
      showToastSuccess({ title: "Subjects Edited Successfully" });
    },
    onError: (error) => {
      showToastError({ error });
    },
  });
  const deleteSubjectMutation = useMutation({
    mutationFn: (id) => deleteQuestionSubject(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["questionSetData", questionSetId]);
      showToastSuccess({ title: "Subject Deleted Successfully" });
    },
    onError: (error) => {
      showToastError({ error });
    },
  });

  const saveEditedSubjects = () => {
    const listArray = questionSetSubjects.map((subject) => subject._id);
    updateSubjectsArrayMutation.mutate({
      data: listArray,
      id: questionSetId,
    });
  };
  const cancelSubjectEdit = () => {
    setQuestionSetSubjects(questionSetData.subjects);
    setEditSubjects(false);
  };

  const handleDeleteSubject = (id) => () => {
    deleteSubjectMutation.mutate(id);
  };

  return (
    <div className="content-container">
      {(updateSubjectsArrayMutation.isPending ||
        deleteSubjectMutation.isPending) && <Spinner />}
      {questionSetData && (
        <>
          <BreadCrumbContainer
            courseId={courseId}
            questionSetId={questionSetId}
          />
          <SortableListContainer
            listItems={questionSetSubjects}
            changeListItems={setQuestionSetSubjects}
            title={questionSetData.title}
            enableEdit={editSubjects}
            saveEdit={saveEditedSubjects}
            cancelEdit={cancelSubjectEdit}
            onEditClick={() => setEditSubjects(true)}
            addDialogExists={false}
          >
            {questionSetSubjects?.length > 0 &&
              questionSetSubjects.map((subject) => (
                <SortableItem
                  key={subject._id}
                  id={subject._id}
                  link={`/admin/courses/${courseId}/tests/${questionSetId}/${subject._id}`}
                  title={subject.name}
                  description={`${subject.questions.length} questions`}
                  enableEdit={editSubjects}
                  handleDelete={handleDeleteSubject}
                  deleteTitle={`Are you sure you want to delete this subject ? This will delete all the questions related to this subject.`}
                />
              ))}
          </SortableListContainer>
        </>
      )}
    </div>
  );
}
