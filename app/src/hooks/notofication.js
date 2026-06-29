"use client";

import axios from "axios";
import { API_URL } from "./constant.js";

export const subscribeNotification = async (subscription) => {
  const { data } = await axios.post(
    `${API_URL}/notification/subscribe`,
    subscription,
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return data;
};
