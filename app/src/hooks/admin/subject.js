import axiosInstance from "../axiosInstance.js";
import { API_URL } from "../constant.js";

export const createSubject = async (data) => {
  const { data: response } = await axiosInstance.post(
    `${API_URL}/admin/createSubject`,
    data
  );
  return response;
};

export const editSubjectArray = async ({ data, id }) => {
  const { data: response } = await axiosInstance.put(
    `${API_URL}/admin/updateSubjectsArray/${id}`,
    data
  );
  return response;
};

export const deleteSubject = async ({ id, courseId }) => {
  const { data: response } = await axiosInstance.delete(
    `${API_URL}/admin/deleteSubject/${courseId}/${id}`
  );
  return response;
};

export const editSubject = async ({ data, id }) => {
  const { data: response } = await axiosInstance.put(
    `${API_URL}/admin/updateSubject/${id}`,
    data
  );
  return response;
};

export const getSubjectData = async (subjectId) => {
  const { data: response } = await axiosInstance.get(
    `${API_URL}/admin/getSubject/${subjectId}`
  );

  return response.data;
};
