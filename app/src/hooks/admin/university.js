import { API_URL } from "../constant.js";
import axiosInstance from "../axiosInstance.js";

export const getUniversities = async (id) => {
  const { data: response } = await axiosInstance.get(
    `${API_URL}/university/getAllUniversities`
  );
  return response.data;
};

export const createUniversity = async (data) => {
  const { data: response } = await axiosInstance.post(
    `${API_URL}/admin/createUniversity`,
    data
  );
  return response;
};

export const deleteUniversity = async (id) => {
  const { data: response } = await axiosInstance.delete(
    `${API_URL}/admin/deleteUniversity/${id}`
  );
  return response;
};

export const editUniversity = async ({ data, id }) => {
  const { data: response } = await axiosInstance.put(
    `${API_URL}/admin/updateUniversity/${id}`,
    data
  );
  return response;
};
