"use client";

import axiosInstance from "./axiosInstance";

const getVideo = async (videoId) => {
  const { data } = await axiosInstance.get(`/video/getVideo/${videoId}`);
  return data.data;
};

const getVideoFullData = async (videoId) => {
  const { data } = await axiosInstance.get(
    `/video/getVideoFullData/${videoId}`
  );
  return data.data;
};

const getWatchHistory = async (count) => {
  const { data } = await axiosInstance.get(`/video/getWatchHistory/${count}`);

  return data.data;
};

const addToWatchHistory = async (videoData) => {
  const { data } = await axiosInstance.post(
    `/video/addToWatchHistory`,
    videoData
  );
  return data.data;
};

const getCompletedVideos = async () => {
  const { data } = await axiosInstance.get(`/video/getCompletedVideos`);
  return data.data;
};

const updateUserWatchedVideos = async (userData) => {
  const { data } = await axiosInstance.post(
    `/video/updateUserWatchedVideos`,
    userData
  );
  return data.data;
};

export {
  getVideo,
  updateUserWatchedVideos,
  addToWatchHistory,
  getCompletedVideos,
  getWatchHistory,
  getVideoFullData,
};
