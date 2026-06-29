import { API_URL } from "../constant.js";
import axiosInstance from "../axiosInstance.js";

export const createQuestion = async (data) => {
  const { data: response } = await axiosInstance.post(
    `${API_URL}/admin/createQuestion`,
    data
  );
  return response;
};

export const createQuestionOfTheDayQuestion = async (data) => {
  const { data: response } = await axiosInstance.post(
    `${API_URL}/admin/createQuestionOfTheDayQuestion`,
    data
  );
  return response;
};

export const editQuestionArray = async ({ data, id }) => {
  const { data: response } = await axiosInstance.put(
    `${API_URL}/admin/updateQuestionsArray/${id}`,
    data
  );
  return response;
};

export const editQuestionsOfTheDayArray = async ({ data, id }) => {
  const { data: response } = await axiosInstance.put(
    `${API_URL}/admin/updateQuestionsOfTheDayArray/${id}`,
    data
  );
  return response;
};

export const deleteQuestion = async ({ id }) => {
  const { data: response } = await axiosInstance.delete(
    `${API_URL}/admin/deleteQuestion/${id}`
  );
  return response;
};

export const editQuestion = async ({ questionId, data }) => {
  const { data: response } = await axiosInstance.put(
    `${API_URL}/admin/updateQuestion/${questionId}`,
    data
  );
  return response;
};

export const editAnswer = async ({ questionId, answer }) => {
  const { data: response } = await axiosInstance.put(
    `${API_URL}/admin/updateQuestionAnswer/${questionId}`,
    answer
  );
  return response;
};

export const createTopic = async (data) => {
  const { data: response } = await axiosInstance.post(
    `${API_URL}/admin/createQuestionTopic`,
    data
  );
  return response;
};

export const editTopic = async (id, data) => {
  const { data: response } = await axiosInstance.put(
    `${API_URL}/admin/updateQuestionTopic/${id}`,
    data
  );
  return response;
};

export const deleteTopic = async (id) => {
  const { data: response } = await axiosInstance.delete(
    `${API_URL}/admin/deleteQuestionTopic/${id}`
  );
  return response;
};
