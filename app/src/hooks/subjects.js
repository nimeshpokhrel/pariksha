"use client";

import axiosInstance from "./axiosInstance.js";

export const getSubjectInfo = async (subjectLink) => {
  const { data } = await axiosInstance.get(
    `/subject/getSubjectInfo/${subjectLink}`
  );
  return data.data;
};

export const updateUserSubjectWatching = async (userData) => {
  const { data } = await axiosInstance.post(
    `/subject/updateUserSubjectVideo`,
    userData
  );
  return data.data;
};
