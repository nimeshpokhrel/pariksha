"use client";

import { API_URL } from "./constant.js";
import axiosInstance from "./axiosInstance.js";

export const getAds = async () => {
  const { data: response } = await axiosInstance.get(`${API_URL}/ad/getAllAds`);

  return response.data;
};
