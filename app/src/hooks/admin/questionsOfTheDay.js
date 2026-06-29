import { API_URL } from "../constant.js";
import axiosInstance from "../axiosInstance.js";

export const createQuestionsOfTheDay = async (data) => {
  const { data: response } = await axiosInstance.post(
    `${API_URL}/admin/createQuestionsOfTheDay`,
    data
  );
  return response;
};

export const deleteQuestionsOfTheDay = async (id) => {
  const { data: response } = await axiosInstance.delete(
    `${API_URL}/admin/deleteQuestionsOfTheDay/${id}`
  );
  return response;
};

export const editQuestionsOfTheDay = async ({ data, id }) => {
  const { data: response } = await axiosInstance.put(
    `${API_URL}/admin/updateQuestionsOfTheDay/${id}`,
    data
  );
  return response;
};
