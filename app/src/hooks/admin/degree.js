import { API_URL } from "../constant.js";
import axiosInstance from "../axiosInstance.js";

export const getDegrees = async () => {
  const { data: response } = await axiosInstance.get(
    `${API_URL}/degree/getAllDegrees`
  );
  return response.data;
};

export const createDegree = async (data) => {
  const { data: response } = await axiosInstance.post(
    `${API_URL}/admin/createDegree`,
    data
  );
  return response;
};

export const deleteDegree = async (id) => {
  const { data: response } = await axiosInstance.delete(
    `${API_URL}/admin/deleteDegree/${id}`
  );
  return response;
};

export const editDegree = async ({ data, id }) => {
  const { data: response } = await axiosInstance.put(
    `${API_URL}/admin/updateDegree/${id}`,
    data
  );
  return response;
};
