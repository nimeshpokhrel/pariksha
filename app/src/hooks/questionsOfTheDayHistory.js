import axiosInstance from "./axiosInstance";

export const addQuestionsOfTheDayHistory = async (id) => {
  const { data } = await axiosInstance.post(
    `/questionOfTheDayHistory/addToQuestionsOfTheDayHistory/${id}`
  );
  return data.data;
};
