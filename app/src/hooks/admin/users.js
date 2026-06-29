import { API_URL } from "../constant.js";
import axiosInstance from "../axiosInstance.js";

export const getAllUsers = async ({ page, limit, search }) => {
  const { data: response } = await axiosInstance.get(
    `${API_URL}/admin/getAllUsers`,
    { params: { page, limit, search } }
  );
  return response.data;
};

export const changeUserAdsSettings = async ({ userId, value }) => {
  const { data: response } = await axiosInstance.put(
    `${API_URL}/admin/changeUserAdsSettings/${userId}`,
    { adsEnabled: value }
  );
  return response.data;
};
