import { API_URL } from "../constant.js";
import axiosInstance from "../axiosInstance.js";

export const getCounsellings = async () => {
  const { data: response } = await axiosInstance.get(
    `${API_URL}/admin/getCounsellings`
  );
  return response.data;
};
