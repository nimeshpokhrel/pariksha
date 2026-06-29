"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

import { SortableListContainer } from "../SortableList";
import { SortableItem } from "../SortableItem";
import AddSection from "../AdminForms/AddSection";

import useToast from "@/utils/useToast";
import Spinner from "@/utils/Spinner";
import EditSection from "../AdminForms/EditSection";

import { getSubjectData } from "@/hooks/admin/subject";
import {
  createSection,
  deleteSection,
  editSection,
  editSectionArray,
} from "@/hooks/admin/section";
import BreadCrumbContainer from "../BreadCrumbContainer";

export default function AdminSubjectInfo({ courseId, subjectId }) {
  const [subjectSections, setSubjectSections] = useState([]);
  const [editSections, setEditSections] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const { showToastSuccess, showToastError } = useToast();
  const queryClient = useQueryClient();

  const { data: subjectData } = useQuery({
    queryKey: ["subject", subjectId],
    queryFn: (context) => {
      const [, subjectId] = context.queryKey;
      return getSubjectData(subjectId);
    },
  });

  useEffect(() => {
    if (subjectData) {
      setSubjectSections(subjectData.sections);
    }
  }, [subjectData]);

  const createSectionMutation = useMutation({
    mutationFn: (formData) => createSection(formData),
    onSuccess: () => {
      queryClient.invalidateQueries(["subject", subjectId]);
      setAddDialogOpen(false);
      showToastSuccess({ title: "Section Added Successfully" });
    },
    onError: (error) => {
      showToastError({ error });
    },
  });

  const updateSectionArrayMutation = useMutation({
    mutationFn: (data) => editSectionArray(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["subject", subjectId]);
      setEditSections(false);
      showToastSuccess({ title: "Sections Edited Successfully" });
    },
    onError: (error) => {
      showToastError({ error });
    },
  });

  const deleteSectionMutation = useMutation({
    mutationFn: (id) => deleteSection({ subjectId, id }),
    onSuccess: () => {
      queryClient.invalidateQueries(["subject", subjectId]);
      showToastSuccess({ title: "Section Deleted Successfully" });
    },
    onError: (error) => {
      showToastError({ error });
    },
  });
  const updateSectionMutation = useMutation({
    mutationFn: (data) => editSection(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["subject", subjectId]);
      showToastSuccess({ title: "Section Edited Successfully" });
    },
    onError: (error) => {
      showToastError({ error });
    },
  });

  const saveEditedSections = () => {
    const listArray = subjectSections.map((section) => section._id);
    updateSectionArrayMutation.mutate({
      data: listArray,
      id: subjectData._id,
    });
  };

  const handleCreateSection = (data) => {
    createSectionMutation.mutate({ ...data, subjectId, courseId });
  };

  const cancelSectionEdit = () => {
    setSubjectSections(subjectData.sections);
    setEditSections(false);
  };

  const handleDeleteSection = (id) => () => {
    deleteSectionMutation.mutate(id);
  };

  const handleEditSection = (data, id) => {
    updateSectionMutation.mutate({ id, data });
  };

  return (
    <div className="content-container">
      {(createSectionMutation.isPending ||
        updateSectionArrayMutation.isPending ||
        deleteSectionMutation.isPending ||
        updateSectionMutation.isPending) && <Spinner />}
      {subjectData && (
        <div className="w-full">
          <BreadCrumbContainer courseId={courseId} subjectId={subjectId} />

          <SortableListContainer
            listItems={subjectSections}
            changeListItems={setSubjectSections}
            title={`${subjectData?.title}`}
            enableEdit={editSections}
            saveEdit={saveEditedSections}
            cancelEdit={cancelSectionEdit}
            onEditClick={() => setEditSections(true)}
            addDialogExists={true}
            dialogOpen={addDialogOpen}
            setDialogOpen={setAddDialogOpen}
            addButtonTitle={"Add Section"}
            addDialogTitle={"Add a New Section"}
            form={<AddSection handleFormSubmit={handleCreateSection} />}
          >
            {subjectSections.length > 0 &&
              subjectSections.map((section) => (
                <SortableItem
                  key={section._id}
                  id={section._id}
                  title={section.title}
                  link={`/admin/courses/${courseId}/videos/${subjectId}/${section._id}`}
                  description={``}
                  enableEdit={editSections}
                  handleDelete={handleDeleteSection}
                  editDialog={
                    <EditSection
                      section={section}
                      handleEditItem={handleEditSection}
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
