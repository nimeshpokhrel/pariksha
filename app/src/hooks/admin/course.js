import { API_URL } from "../constant.js";
import axiosInstance from "../axiosInstance.js";

export const getCourseData = async (id) => {
  const { data: response } = await axiosInstance.get(
    `${API_URL}/admin/getCourseData/${id}`
  );
  return response.data;
};

export const createCourse = async (data) => {
  const { data: response } = await axiosInstance.post(
    `${API_URL}/admin/createCourse`,
    data
  );
  return response;
};

export const deleteCourse = async (id) => {
  const { data: response } = await axiosInstance.delete(
    `${API_URL}/admin/deleteCourse/${id}`
  );
  return response;
};

export const editCourse = async ({ data, id }) => {
  const { data: response } = await axiosInstance.put(
    `${API_URL}/admin/updateCourse/${id}`,
    data
  );
  return response;
};
