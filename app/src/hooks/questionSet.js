"use client";

import axiosInstance from "./axiosInstance.js";

export const getAllQuestionSets = async () => {
  const { data } = await axiosInstance.get(`/questionset/getAllQuestionSets`);
  return data;
};

export const getQuestionSetData = async (link) => {
  const { data } = await axiosInstance.get(
    `/questionset/getQuestionSetData/${link}`
  );
  return data;
};
