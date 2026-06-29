import axiosInstance from "../axiosInstance.js";
import { API_URL } from "../constant.js";

export const createVideo = async (data) => {
  const { data: response } = await axiosInstance.post(
    `${API_URL}/admin/createVideo`,
    data
  );
  return response;
};

export const editVideoArray = async ({ data, id }) => {
  const { data: response } = await axiosInstance.put(
    `${API_URL}/admin/updateVideosArray/${id}`,
    data
  );
  return response;
};

export const deleteVideo = async ({ subjectId, sectionId, id }) => {
  const { data: response } = await axiosInstance.delete(
    `${API_URL}/admin/deleteVideo/${subjectId}/${sectionId}/${id}`
  );
  return response;
};

export const editVideo = async ({ data, id }) => {
  const { data: response } = await axiosInstance.put(
    `${API_URL}/admin/updateVideo/${id}`,
    data
  );
  return response;
};
