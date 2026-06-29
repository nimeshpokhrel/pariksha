"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

import { SortableListContainer } from "../SortableList";

import useToast from "@/utils/useToast";
import Spinner from "@/utils/Spinner";

import BreadCrumbContainer from "../BreadCrumbContainer";
import { getQuestionSubjectData } from "@/hooks/admin/questionSubject";
import { SortableItemNoLink } from "../SortableItemNoLink";

import AddQuestion from "../AdminForms/AddQuestion";
import {
  createQuestion,
  createTopic,
  deleteQuestion,
  editQuestionArray,
} from "@/hooks/admin/question";
import EditQuestion from "../AdminForms/EditQuestion";
import AdminQuestionTopicsInfo from "../AdminQuestionTopicsInfo";

export default function AdminQuestionSubjectInfo({
  courseId,
  questionSubjectId,
  questionSetId,
}) {
  const [subjectQuestions, setSubjectQuestions] = useState([]);
  const [editQuestions, setEditQuestions] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { showToastSuccess, showToastError } = useToast();

  const { data: questionSubjectData } = useQuery({
    queryKey: ["questionSubjectData", questionSubjectId],
    queryFn: (context) => {
      const [, questionSubjectId] = context.queryKey;
      if (!questionSubjectId) return {};
      return getQuestionSubjectData(questionSubjectId);
    },
  });

  useEffect(() => {
    if (questionSubjectData) {
      setSubjectQuestions(questionSubjectData.questions);
    }
  }, [questionSubjectData]);

  const createQuestionMutation = useMutation({
    mutationFn: (formData) => createQuestion(formData),
    onSuccess: () => {
      queryClient.invalidateQueries(["questionSubjectData", questionSubjectId]);
      setAddDialogOpen(false);
      showToastSuccess({ title: "Section Added Successfully" });
    },
    onError: (error) => {
      showToastError({ error });
    },
  });

  const topicCreateMutation = useMutation({
    mutationFn: (data) => createTopic(data),
    onSuccess: () => {
      queryClient.invalidateQueries([
        "questionSubjectData",
        questionSubjectData._id,
      ]);
      showToastSuccess({ title: "Topic Created Successfully" });
    },
    onError: (error) => {
      showToastError({ error });
    },
  });

  const updateQuestionArrayMutation = useMutation({
    mutationFn: (data) => editQuestionArray(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["questionSubjectData", questionSubjectId]);
      setEditQuestions(false);
      showToastSuccess({ title: "Questions Edited Successfully" });
    },
    onError: (error) => {
      showToastError({ error });
    },
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: (id) => deleteQuestion({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries(["questionSubjectData", questionSubjectId]);
      showToastSuccess({ title: "Question Deleted Successfully" });
    },
    onError: (error) => {
      showToastError({ error });
    },
  });

  const saveEditedQuestions = () => {
    const listArray = subjectQuestions.map((question) => question._id);

    updateQuestionArrayMutation.mutate({
      data: listArray,
      id: questionSubjectId,
    });
  };

  const handleCreateQuestion = (data) => {
    createQuestionMutation.mutate({
      ...data,
      questionSubjectId,
      subjectId: questionSubjectData.subject,
    });
  };

  const cancelSectionEdit = () => {
    setSubjectQuestions(questionSubjectData.questions);
    setEditQuestions(false);
  };

  const handleDeleteQuestion = (id) => () => {
    deleteQuestionMutation.mutate(id);
  };

  const handleCreateTopic = (inputValue) => {
    topicCreateMutation.mutate({
      name: inputValue,
      subjectId: questionSubjectData.subject,
    });
  };

  return (
    <div className="content-container">
      {(createQuestionMutation.isPending ||
        updateQuestionArrayMutation.isPending ||
        deleteQuestionMutation.isPending ||
        topicCreateMutation.isPending) && <Spinner />}
      <BreadCrumbContainer
        courseId={courseId}
        questionSubjectId={questionSubjectId}
        questionSetId={questionSetId}
      />
      {questionSubjectData && (
        <div className="w-full">
          <SortableListContainer
            listItems={subjectQuestions}
            changeListItems={setSubjectQuestions}
            title={`${questionSubjectData?.name}`}
            enableEdit={editQuestions}
            saveEdit={saveEditedQuestions}
            cancelEdit={cancelSectionEdit}
            onEditClick={() => setEditQuestions(true)}
            addDialogExists={true}
            dialogOpen={addDialogOpen}
            setDialogOpen={setAddDialogOpen}
            addButtonTitle={"Add Question"}
            addDialogTitle={"Add a New Question"}
            form={
              <AddQuestion
                handleFormSubmit={handleCreateQuestion}
                topics={questionSubjectData.topics}
                handleCreateTopic={handleCreateTopic}
              />
            }
            fullScreenDialog={true}
          >
            {subjectQuestions.length > 0 &&
              subjectQuestions.map((question) => (
                <SortableItemNoLink
                  key={question._id}
                  id={question._id}
                  title={question.questionText}
                  description={``}
                  enableEdit={editQuestions}
                  handleDelete={handleDeleteQuestion}
                  editDialog={
                    <EditQuestion
                      question={question}
                      questionSubjectId={questionSubjectId}
                      topics={questionSubjectData.topics}
                      handleCreateTopic={handleCreateTopic}
                    />
                  }
                />
              ))}
          </SortableListContainer>
          <AdminQuestionTopicsInfo
            topics={questionSubjectData.topics}
            questionSubject={questionSubjectData._id}
            subjectId={questionSubjectData.subject}
          />
        </div>
      )}
    </div>
  );
}
