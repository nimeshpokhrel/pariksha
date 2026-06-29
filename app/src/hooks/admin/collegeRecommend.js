import { API_URL } from "../constant.js";
import axiosInstance from "../axiosInstance.js";

export const getCollegeRecommendations = async () => {
  const { data: response } = await axiosInstance.get(
    `${API_URL}/admin/getCollegeRecommendations`
  );
  return response.data;
};
