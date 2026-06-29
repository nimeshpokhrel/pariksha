import { API_URL } from "../constant.js";
import axiosInstance from "../axiosInstance.js";

export const getSectors = async () => {
  const { data: response } = await axiosInstance.get(
    `${API_URL}/sector/getAllSectors`
  );
  return response.data;
};

export const createSector = async (data) => {
  const { data: response } = await axiosInstance.post(
    `${API_URL}/admin/createSector`,
    data
  );
  return response;
};

export const deleteSector = async (id) => {
  const { data: response } = await axiosInstance.delete(
    `${API_URL}/admin/deleteSector/${id}`
  );
  return response;
};

export const editSector = async ({ data, id }) => {
  const { data: response } = await axiosInstance.put(
    `${API_URL}/admin/updateSector/${id}`,
    data
  );
  return response;
};
