import { API_URL } from "./constant.js";
import axiosInstance from "./axiosInstance.js";

export const getQuestionsOfTheDayData = async (id) => {
  const { data } = await axiosInstance.get(
    `${API_URL}/questionsOfTheDay/getQuestionsOfTheDayData/${id}`
  );
  return data.data;
};
