import axiosInstance from "./axiosInstance";

export const getTopics = async () => {
  const { data } = await axiosInstance.get(`/topic/getAllTopics`);
  return data.data;
};
