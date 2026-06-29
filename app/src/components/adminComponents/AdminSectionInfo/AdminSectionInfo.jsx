"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

import { SortableListContainer } from "../SortableList";
import { SortableItem } from "../SortableItem";

import useToast from "@/utils/useToast";
import Spinner from "@/utils/Spinner";

import { getSectionData } from "@/hooks/admin/section";
import AddVideo from "../AdminForms/AddVideo";
import EditVideo from "../AdminForms/EditVideo";
import {
  createVideo,
  deleteVideo,
  editVideo,
  editVideoArray,
} from "@/hooks/admin/video";
import BreadCrumbContainer from "../BreadCrumbContainer";

export default function AdminSectionInfo({ courseId, subjectId, sectionId }) {
  const [subjectVideos, setSubjectVideos] = useState([]);
  const [editVideos, setEditVideos] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const { showToastSuccess, showToastError } = useToast();
  const queryClient = useQueryClient();

  const { data: sectionData } = useQuery({
    queryKey: ["section", sectionId],
    queryFn: (context) => {
      const [, sectionId] = context.queryKey;
      return getSectionData(sectionId);
    },
  });

  useEffect(() => {
    if (sectionData) {
      setSubjectVideos(sectionData.videos);
    }
  }, [sectionData]);

  const createVideoMutation = useMutation({
    mutationFn: (formData) => createVideo(formData),
    onSuccess: () => {
      queryClient.invalidateQueries(["section", sectionId]);
      showToastSuccess({ title: "Video Added Successfully" });
    },
    onError: (error) => {
      showToastError({ error });
    },
  });

  const updateVideoArrayMutation = useMutation({
    mutationFn: (data) => editVideoArray(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["section", sectionId]);
      setEditVideos(false);
      showToastSuccess({ title: "Videos Edited Successfully" });
    },
    onError: (error) => {
      showToastError({ error });
    },
  });

  const deleteVideoMutation = useMutation({
    mutationFn: (id) => deleteVideo({ subjectId, sectionId, id }),
    onSuccess: () => {
      queryClient.invalidateQueries(["subject", sectionId]);
      showToastSuccess({ title: "Video Deleted Successfully" });
    },
    onError: (error) => {
      showToastError({ error });
    },
  });
  const updateVideoMutation = useMutation({
    mutationFn: (data) => editVideo(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["subject", sectionId]);
      showToastSuccess({ title: "Video Edited Successfully" });
    },
    onError: (error) => {
      showToastError({ error });
    },
  });

  const saveEditedVideos = () => {
    const listArray = subjectVideos.map((video) => video._id);
    updateVideoArrayMutation.mutate({
      data: listArray,
      id: sectionData._id,
    });
  };

  const handleCreateVideo = (data) => {
    createVideoMutation.mutate({ ...data, sectionId, subjectId, courseId });
  };

  const cancelSectionEdit = () => {
    setSubjectVideos(sectionData.videos);
    setEditVideos(false);
  };

  const handleDeleteVideo = (id) => () => {
    deleteVideoMutation.mutate(id);
  };

  const handleEditVideo = (data, id) => {
    updateVideoMutation.mutate({ id, data });
  };

  return (
    <div className="content-container">
      {(createVideoMutation.isPending ||
        updateVideoArrayMutation.isPending ||
        deleteVideoMutation.isPending ||
        updateVideoMutation.isPending) && <Spinner />}

      {sectionData && (
        <div className="w-full">
          <BreadCrumbContainer
            courseId={courseId}
            subjectId={subjectId}
            sectionId={sectionId}
          />
          <SortableListContainer
            listItems={subjectVideos}
            changeListItems={setSubjectVideos}
            title={`${sectionData?.title}`}
            enableEdit={editVideos}
            saveEdit={saveEditedVideos}
            cancelEdit={cancelSectionEdit}
            onEditClick={() => setEditVideos(true)}
            addDialogExists={true}
            dialogOpen={addDialogOpen}
            setDialogOpen={setAddDialogOpen}
            addButtonTitle={"Add Video"}
            addDialogTitle={"Add a New Video"}
            form={<AddVideo handleFormSubmit={handleCreateVideo} />}
          >
            {subjectVideos.length > 0 &&
              subjectVideos.map((video) => (
                <SortableItem
                  key={video._id}
                  id={video._id}
                  title={video.title}
                  description={`Video Id: ${video.videoFile} || Duration: ${video.duration}`}
                  link={`https://www.youtube.com/watch?v=${video.videoFile}`}
                  blankTarget={true}
                  enableEdit={editVideos}
                  handleDelete={handleDeleteVideo}
                  editDialog={
                    <EditVideo video={video} handleEditItem={handleEditVideo} />
                  }
                />
              ))}
          </SortableListContainer>
        </div>
      )}
    </div>
  );
}
