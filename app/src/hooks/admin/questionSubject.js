import { API_URL } from "../constant.js";
import axiosInstance from "../axiosInstance.js";

export const getQuestionSubjectData = async (id) => {
  const { data: response } = await axiosInstance.get(
    `${API_URL}/admin/getQuestionSubject/${id}`
  );
  return response.data;
};

export const editQuestionSubjectArray = async ({ data, id }) => {
  const { data: response } = await axiosInstance.put(
    `${API_URL}/admin/updateQuestionSubjectsArray/${id}`,
    data
  );
  return response;
};

export const deleteQuestionSubject = async (id) => {
  const { data: response } = await axiosInstance.delete(
    `${API_URL}/admin/deleteQuestionSubject/${id}`
  );
  return response;
};
