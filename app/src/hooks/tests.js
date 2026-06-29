"use client";

import axiosInstance from "./axiosInstance";

export const getTestInfo = async (link, courseLink) => {
  const { data } = await axiosInstance.get(
    `/questionset/getQuestionSetData/${link}/${courseLink}`
  );
  return data.data;
};

export const submitTestAnswers = async (id, answers) => {
  const { data } = await axiosInstance.post(
    `/questionset/submitTestAnswers/${id}`,
    answers
  );
  return data.data;
};
