import { API_URL } from "../constant.js";
import axiosInstance from "../axiosInstance.js";

export const getQuestionSetData = async (id) => {
  const { data: response } = await axiosInstance.get(
    `${API_URL}/admin/getQuestionSet/${id}`
  );
  return response.data;
};

export const createQuestionSet = async (data) => {
  const { data: response } = await axiosInstance.post(
    `${API_URL}/admin/createQuestionSet`,
    data
  );
  return response;
};

export const editQuestionSetArray = async ({ data, id }) => {
  const { data: response } = await axiosInstance.put(
    `${API_URL}/admin/updateQuestionSetsArray/${id}`,
    data
  );
  return response;
};

export const deleteQuestionSet = async ({ id, courseId }) => {
  const { data: response } = await axiosInstance.delete(
    `${API_URL}/admin/deleteQuestionSet/${courseId}/${id}`
  );
  return response;
};

export const editQuestionSet = async ({ data, id }) => {
  const { data: response } = await axiosInstance.put(
    `${API_URL}/admin/updateQuestionSet/${id}`,
    data
  );
  return response;
};
