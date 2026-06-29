"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";

import { SortableListContainer } from "../SortableList";

import useToast from "@/utils/useToast";
import convertDate from "@/utils/convertDate";

import BreadCrumbContainer from "../BreadCrumbContainer";
import { SortableItemNoLink } from "../SortableItemNoLink";

import {
  createQuestionOfTheDayQuestion,
  createTopic,
  deleteQuestion,
  editQuestionsOfTheDayArray,
} from "@/hooks/admin/question";
import { getQuestionsOfTheDayData } from "@/hooks/questionsOfTheDay";
import QuestionForm from "./QuestionForm";
import { getCourseData } from "@/hooks/admin/course";
import { getTopics } from "@/hooks/topic";
import EditQuestionForm from "./EditQuestionForm";
import Spinner from "@/utils/Spinner";

export default function AdminQuestionOfTheDay({
  courseId,
  questionsOfTheDayId,
}) {
  const [questions, setQuestions] = useState([]);
  const [editQuestions, setEditQuestions] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { showToastSuccess, showToastError } = useToast();

  const { data: questionsOfTheDayData } = useQuery({
    queryKey: ["questionsOfTheDay", questionsOfTheDayId],
    queryFn: (context) => {
      const [, questionsOfTheDayId] = context.queryKey;
      if (!questionsOfTheDayId) return {};
      return getQuestionsOfTheDayData(questionsOfTheDayId);
    },
  });

  useEffect(() => {
    if (questionsOfTheDayData) {
      setQuestions(questionsOfTheDayData.questions);
    }
  }, [questionsOfTheDayData]);

  const { data: courseData } = useQuery({
    queryKey: ["course-details", courseId],
    queryFn: (context) => {
      const [, courseId] = context.queryKey;
      return getCourseData(courseId);
    },
  });

  const { data: topics } = useQuery({
    queryKey: ["topics"],
    queryFn: () => getTopics(),
  });

  const createQuestionMutation = useMutation({
    mutationFn: (formData) => createQuestionOfTheDayQuestion(formData),
    onSuccess: () => {
      queryClient.invalidateQueries(["questionsOfTheDay", questionsOfTheDayId]);
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
      queryClient.invalidateQueries(["topics"]);
      showToastSuccess({ title: "Topic Created Successfully" });
    },
    onError: (error) => {
      showToastError({ error });
    },
  });

  const updateQuestionArrayMutation = useMutation({
    mutationFn: (data) => editQuestionsOfTheDayArray(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["questionsOfTheDay", questionsOfTheDayId]);
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
      queryClient.invalidateQueries(["questionsOfTheDay", questionsOfTheDayId]);
      showToastSuccess({ title: "Question Deleted Successfully" });
    },
    onError: (error) => {
      showToastError({ error });
    },
  });

  const saveEditedQuestions = () => {
    const listArray = questions.map((question) => question._id);
    updateQuestionArrayMutation.mutate({
      data: listArray,
      id: questionsOfTheDayId,
    });
  };

  const handleCreateQuestion = (data) => {
    console.log(data);
    createQuestionMutation.mutate({
      ...data,
      questionsOfTheDay: questionsOfTheDayId,
    });
  };

  const cancelSectionEdit = () => {
    setQuestions(questionsOfTheDayData.questions);
    setEditQuestions(false);
  };

  const handleDeleteQuestion = (id) => () => {
    deleteQuestionMutation.mutate(id);
  };

  const handleCreateTopic = (inputValue, subjectId) => {
    topicCreateMutation.mutate({
      name: inputValue,
      subjectId: subjectId,
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
        questionsOfTheDayId={questionsOfTheDayId}
      />
      {questionsOfTheDayData && questions && (
        <div className="w-full">
          <SortableListContainer
            listItems={questions}
            changeListItems={setQuestions}
            title={`${questionsOfTheDayData?.date ? convertDate(questionsOfTheDayData?.date) : ""}`}
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
              <QuestionForm
                handleFormSubmit={handleCreateQuestion}
                topics={topics}
                subjects={courseData?.subjects}
                handleCreateTopic={handleCreateTopic}
              />
            }
            fullScreenDialog={true}
          >
            {courseData &&
              questions.length > 0 &&
              questions.map((question) => (
                <SortableItemNoLink
                  key={question._id}
                  id={question._id}
                  title={question.questionText}
                  description={``}
                  enableEdit={editQuestions}
                  handleDelete={handleDeleteQuestion}
                  editDialog={
                    <EditQuestionForm
                      question={question}
                      handleFormSubmit={handleCreateQuestion}
                      topics={topics}
                      subjects={courseData?.subjects}
                      handleCreateTopic={handleCreateTopic}
                    />
                  }
                />
              ))}
          </SortableListContainer>
        </div>
      )}
    </div>
  );
}
