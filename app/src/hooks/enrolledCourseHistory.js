import axiosInstance from "./axiosInstance";
import { API_URL } from "./constant";

export const addEnrolledCourses = async (id) => {
  const { data } = await axiosInstance.post(
    `${API_URL}/course/enrollCourse/${id}`
  );
  return data;
};
