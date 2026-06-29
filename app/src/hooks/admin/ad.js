import { API_URL } from "../constant.js";
import axiosInstance from "../axiosInstance.js";

export const createAd = async (data) => {
  const { data: response } = await axiosInstance.post(
    `${API_URL}/admin/createAd`,
    data
  );
  return response;
};

export const deleteAd = async (id) => {
  const { data: response } = await axiosInstance.delete(
    `${API_URL}/admin/deleteAd/${id}`
  );
  return response;
};

export const editAd = async ({ data, id }) => {
  const { data: response } = await axiosInstance.put(
    `${API_URL}/admin/updateAd/${id}`,
    data
  );
  return response;
};
