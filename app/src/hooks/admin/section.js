import axiosInstance from "../axiosInstance.js";
import { API_URL } from "../constant.js";

export const createSection = async (data) => {
  const { data: response } = await axiosInstance.post(
    `${API_URL}/admin/createSection`,
    data
  );
  return response;
};

export const editSectionArray = async ({ data, id }) => {
  const { data: response } = await axiosInstance.put(
    `${API_URL}/admin/updateSectionsArray/${id}`,
    data
  );
  return response;
};

export const deleteSection = async ({ subjectId, id }) => {
  const { data: response } = await axiosInstance.delete(
    `${API_URL}/admin/deleteSection/${subjectId}/${id}`
  );
  return response;
};

export const editSection = async ({ data, id }) => {
  const { data: response } = await axiosInstance.put(
    `${API_URL}/admin/updateSection/${id}`,
    data
  );
  return response;
};

export const getSectionData = async (SectionId) => {
  const { data: response } = await axiosInstance.get(
    `${API_URL}/admin/getSection/${SectionId}`
  );
  return response.data;
};
