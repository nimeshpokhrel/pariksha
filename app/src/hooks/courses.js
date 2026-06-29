"use client";

import axios from "axios";
import { API_URL } from "./constant.js";
import { useQuery } from "@tanstack/react-query";

export const fetchCourses = async () => {
  const { data } = await axios.get(`${API_URL}/course/getAllCourses`);
  return data.data;
};

export const useFetchCourses = () => {
  return useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const request = await fetch("/api/course/getAllCourses");

      const data = await request.json();

      if (!data.success) {
        throw new Error(data.message);
      }
      return data.data;
    },
  });
};

export const getCourseData = async (courseLink) => {
  const { data } = await axios.get(
    `${API_URL}/course/getCourseData/${courseLink}`
  );

  return data.data;
};

export const getCourseSubjectsAndTopics = async (courseLink) => {
  const { data } = await axios.get(
    `${API_URL}/course/getCourseSubjectsAndTopics/${courseLink}`
  );
  return data.data;
};
