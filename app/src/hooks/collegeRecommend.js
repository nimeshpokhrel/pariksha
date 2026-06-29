import axios from "axios";

import { API_URL } from "./constant.js";

export const addCollegeRecommend = async (formData) => {
  const { data: response } = await axios.post(
    `${API_URL}/collegeRecommend/addCollegeRecommend`,
    formData,
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  return response;
};
