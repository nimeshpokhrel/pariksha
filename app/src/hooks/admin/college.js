import { API_URL } from "../constant.js";
import axiosInstance from "../axiosInstance.js";

export const getColleges = async () => {
  const { data: response } = await axiosInstance.get(
    `${API_URL}/college/getAllColleges`
  );
  return response.data;
};

export const createCollege = async (data) => {
  const { data: response } = await axiosInstance.post(
    `${API_URL}/admin/createCollege`,
    data
  );
  return response;
};

export const deleteCollege = async (id) => {
  const { data: response } = await axiosInstance.delete(
    `${API_URL}/admin/deleteCollege/${id}`
  );
  return response;
};

export const editCollege = async ({ data, id }) => {
  const { data: response } = await axiosInstance.put(
    `${API_URL}/admin/updateCollege/${id}`,
    data
  );
  return response;
};
