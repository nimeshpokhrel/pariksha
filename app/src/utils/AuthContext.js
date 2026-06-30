"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "@/hooks/auth";
import { getCompletedVideos, updateUserWatchedVideos } from "@/hooks/videos";
import { addQuestionsOfTheDayHistory } from "@/hooks/questionsOfTheDayHistory";
import { addEnrolledCourses } from "@/hooks/enrolledCourseHistory";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userAds, setUserAds] = useState(true);
  const [userCompletedVideos, setUserCompletedVideos] = useState([]);
  const [questionsOfTheDayHistory, setQuestionsOfTheDayHistory] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [testHistory, setTestHistory] = useState([]);
  const [testScores, setTestScores] = useState({});
  const queryClient = useQueryClient();

  const { data, isPending } = useQuery({
    queryKey: ["current-user"],
    queryFn: () => getCurrentUser(),
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const { data: completedVideos } = useQuery({
    queryKey: ["completedVideos", user?._id],
    queryFn: () => getCompletedVideos(),
  });

  const updateUserCompletedVideos = useMutation({
    mutationFn: (data) => updateUserWatchedVideos(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["completedVideos"], user._id);
    },
  });
  const updateQuestionsOfTheDayHistory = useMutation({
    mutationFn: (id) => addQuestionsOfTheDayHistory(id),
  });
  const updateEnrolledCourses = useMutation({
    mutationFn: (id) => addEnrolledCourses(id),
  });

  useEffect(() => {
    if (completedVideos && completedVideos.length > 0) {
      setUserCompletedVideos(completedVideos);
    }
  }, [completedVideos]);

  useEffect(() => {
    if (data) {
      setUser(data.user);
      setUserAds(data.adsEnabled);
      setQuestionsOfTheDayHistory(
        data?.questionsOfTheDayHistory?.map((el) => el.questionOfTheDay)
      );
      setEnrolledCourses(data?.enrolledCourses?.map((el) => el.course));

      const testHistory = data.testHistory.map((item) => {
        return {
          score: item.score,
          questionSetId: item.questionSetId._id,
          createdAt: item.createdAt,
          questionSetData: item.questionSetId,
          _id: item._id,
        };
      });
      setTestHistory(testHistory);
    }
  }, [data]);

  useEffect(() => {
    if (testHistory) {
      const result = testHistory.reduce((acc, current) => {
        const { questionSetId, score } = current;

        if (!acc[questionSetId] || acc[questionSetId] < score) {
          acc[questionSetId] = score;
        }

        return acc;
      }, {});
      setTestScores(result);
    }
  }, [testHistory]);

  const login = () => {
    // v5 syntax — must pass a filters object. With a higher staleTime this is
    // what forces an immediate re-fetch of the user right after login.
    queryClient.invalidateQueries({ queryKey: ["current-user"] });
  };

  const removeFromUserCompletedVideos = (videoId) => {
    if (userCompletedVideos.includes(videoId)) {
      setUserCompletedVideos((prevState) =>
        prevState.filter((id) => id !== videoId)
      );
      updateUserCompletedVideos.mutate({
        option: "remove",
        videoId: videoId,
      });
    }
  };

  const addToUserCompletedVideos = (videoId) => {
    if (!userCompletedVideos.includes(videoId)) {
      setUserCompletedVideos((prevState) => [...prevState, videoId]);
      updateUserCompletedVideos.mutate({
        option: "add",
        videoId: videoId,
      });
    }
  };

  const addToQuestionsOfTheDayHistory = (questionSetId) => {
    if (!questionsOfTheDayHistory.includes(questionSetId)) {
      setQuestionsOfTheDayHistory((prevState) => [...prevState, questionSetId]);
      updateQuestionsOfTheDayHistory.mutate(questionSetId);
    }
  };

  const addToEnrolledCourses = (courseId) => {
    if (!enrolledCourses.includes(courseId)) {
      setEnrolledCourses((prevState) => [...prevState, courseId]);
      updateEnrolledCourses.mutate(courseId);
    }
  };

  const logout = () => {
    setUser(null);
    // Drop the cached user so the now-longer staleTime can't keep serving a
    // logged-in user after logout.
    queryClient.removeQueries({ queryKey: ["current-user"] });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userPending: isPending,
        userAds,
        enrolledCourses,
        addToEnrolledCourses,
        userCompletedVideos,
        addToUserCompletedVideos,
        removeFromUserCompletedVideos,
        testHistory,
        login,
        logout,
        testScores,
        questionsOfTheDayHistory,
        addToQuestionsOfTheDayHistory,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
