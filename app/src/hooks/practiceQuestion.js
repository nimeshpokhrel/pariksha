import axiosInstance from "./axiosInstance";

export const addSolvedQuestion = async ({ questionId }) => {
  const { data } = await axiosInstance.post(
    `/practiceQuestion/addSolvedQuestion/${questionId}`
  );
  return data;
};

export const getPracticeQuestions = async ({ queryKey }) => {
  const [_key, subject, course, topic, unsolved] = queryKey;
  const { data } = await axiosInstance.get(
    "/practiceQuestion/getPracticeQuestions",
    {
      params: { subject, course, topic, unsolved },
    }
  );
  return data.data;
};
