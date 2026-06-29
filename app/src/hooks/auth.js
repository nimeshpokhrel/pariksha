"use client";

import axios from "axios";
import { API_URL } from "./constant.js";
import axiosInstance from "./axiosInstance.js";

export const loginUser = async (formData) => {
  const { data } = await axios.post(`${API_URL}/users/login`, formData, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
  return data.data;
};

export const logoutUser = async () => {
  const { data } = await axios.post(
    `${API_URL}/users/logout`,
    {},
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }
  );
  return data;
};

export const registerUser = async (formData) => {
  const { data } = await axios.post(`${API_URL}/users/register`, formData, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
  return data.data;
};

export const getCurrentUser = async () => {
  const { data } = await axiosInstance.get(`/users/current-user`, {
    headers: { "Content-Type": "application/json" },
  });
  return data.data;
};

export const resetPassword = async (formData) => {
  const { data } = await axios.patch(
    `${API_URL}/users/reset-password`,
    formData,
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }
  );
  return data.data;
};

export const refreshToken = async () => {
  const { data } = await axios.post(
    `${API_URL}/users/refresh-token`,
    {},
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );
  return data;
};

export const sendOtp = async (identifier) => {
  const { data } = await axios.post(`${API_URL}/users/sendOtp`, {
    identifier: identifier,
  });
  return data;
};

export const verifyOtp = async (identifier, otp) => {
  const { data } = await axios.post(
    `${API_URL}/users/verifyOtp`,
    {
      identifier: identifier,
      otp: otp,
    },
    { headers: { "Content-Type": "application/json" } }
  );
  return data;
};

export const getUserDetails = async (identifier) => {
  const { data } = await axios.post(`${API_URL}/users/details`, {
    identifier: identifier,
  });
  return data;
};

export const checkUserDetails = async (formData) => {
  const { data } = await axios.post(`${API_URL}/users/check`, formData, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
  return data;
};
