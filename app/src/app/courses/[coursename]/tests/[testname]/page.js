"use client";

import React, { useEffect, useState } from "react";
import { getTestInfo, submitTestAnswers } from "@/hooks/tests";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@chakra-ui/react";

import TestQuestions from "@/components/TestQuestions";
import TestDetails from "@/components/TestDetails";
import TestSummary from "@/components/TestSummary";

import TestNav from "@/components/TestNav";
import Spinner from "@/utils/Spinner";
import BannerAd from "@/components/BannerAd";
import { useAuth } from "@/utils/AuthContext";
import { LoginModal } from "@/components/LoginModal/LoginModal";
import TestReview from "@/components/TestReview";
import RouteChangeWarning from "@/components/RouteChangeWarning";
import FullPageAd from "@/components/FullPageAd";

function Page({ params }) {
  const { user, userPending, addToEnrolledCourses } = useAuth();
  const courseName = params.coursename;
  const testName = params.testname;
  const [testStatus, setTestStatus] = useState("not_started");
  const [countdownDate, setCountdownDate] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [reviewed, setReviewed] = useState(false);

  const [userSelectedAnswers, setUserSelectedAnswers] = useState({});
  const [testSummary, setTestSummary] = useState({});
  const toast = useToast();

  const { data: testData, isPending } = useQuery({
    queryKey: ["test", testName, courseName],
    queryFn: () => getTestInfo(testName, courseName),
  });

  const { mutate: submitAnswer, isPending: isSubmitting } = useMutation({
    mutationFn: () =>
      submitTestAnswers(testData?.questionSet._id, {
        answers: userSelectedAnswers,
      }),
    onSuccess: (data) => {
      setTestStatus("summary");
      setTestSummary(data);
    },
  });

  const handleSubmit = () => {
    submitAnswer();
  };
  const pageChanged = (page) => {
    setCurrentPage(page);
  };

  const startTest = () => {
    if (user) {
      setTestStatus("running");
      setCountdownDate(Date.now() + 7200 * 1000);
      addToEnrolledCourses(testData.questionSet.course);
    } else {
      setTestStatus("started");
    }
  };

  useEffect(() => {
    if (user && testStatus == "started" && countdownDate == 0) {
      setTestStatus("running");
      setCountdownDate(Date.now() + 7200 * 1000);
      addToEnrolledCourses(testData.questionSet.course);
    }
  }, [user, testStatus]);

  return (
    <div>
      {isPending && <Spinner />}
      {isSubmitting && <Spinner />}
      {testData && (
        <>
          {(testStatus === "not_started" || testStatus === "started") && (
            <>
              <FullPageAd />
              <TestDetails
                start={startTest}
                questionSet={testData.questionSet}
                userSubmissionData={testData.userSubmissionData}
                topRanks={testData.topRanks}
                courseName={courseName}
              />
              {testStatus == "started" && !user && !userPending && (
                <div className="fixed inset-0 z-[20] flex flex-col items-center justify-center bg-black/50 p-6 text-center backdrop-blur-sm">
                  <div className="w-full max-w-md rounded-xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-md">
                    <h3 className="mb-2 text-2xl font-bold text-white">
                      Login Required
                    </h3>
                    <p className="mb-6 text-white/80">
                      Please log in to solve this question set.
                    </p>
                    <LoginModal
                      redirect={`/courses/${courseName}/tests/${testName}`}
                    />
                  </div>
                </div>
              )}
            </>
          )}
          {testStatus === "running" && (
            <RouteChangeWarning
              message={
                "Exiting this page will result in progress being reset. Are you sure you want to continue?"
              }
            >
              <div className="relative">
                <div className="flex w-full flex-col items-center">
                  <BannerAd
                    currentPage={currentPage}
                    className="border-b-2 border-b-gray-200 py-4"
                  />
                </div>
                <div className="m-auto w-full max-w-[1200px]">
                  <TestNav
                    count={Object.keys(userSelectedAnswers).length}
                    title={testData.questionSet?.title}
                    countdownDate={countdownDate}
                    handleSubmit={handleSubmit}
                    onTimerEnd={() => {
                      toast({
                        title: "Time's up.",
                        description:
                          "Your time is up. Please view your results",
                        status: "info",
                        duration: 9000,
                        isClosable: true,
                      });

                      handleSubmit();
                    }}
                  />

                  <TestQuestions
                    subjects={testData.questionSet.subjects}
                    setUserSelectedAnswers={setUserSelectedAnswers}
                    pageChanged={pageChanged}
                  />
                </div>
                <div className="m-auto mt-4 flex w-full max-w-[1200px] flex-col items-center border-t-2 border-t-gray-200">
                  <BannerAd currentPage={currentPage} className="pt-4" />
                </div>
              </div>
            </RouteChangeWarning>
          )}
          {testSummary && testStatus === "summary" && (
            <RouteChangeWarning
              message={
                "You will not be able to review your answers again if you exit this page. Are you sure you want to continue?"
              }
              isEnabled={!reviewed}
            >
              <TestSummary
                title={testData?.questionSet?.title}
                data={testSummary}
                review={() => {
                  setTestStatus("review");
                  setReviewed(true);
                }}
                courseName={courseName}
                questionSet={testData.questionSet}
                userSubmissionData={testData.userSubmissionData}
              />
            </RouteChangeWarning>
          )}

          {testSummary && testStatus === "review" && (
            <RouteChangeWarning
              message={
                "You will not be able to review your answers again if you exit this page. Are you sure you want to continue?"
              }
              isEnabled={!reviewed}
            >
              <FullPageAd />
              <TestReview
                title={testData?.questionSet?.title}
                testData={testSummary.userSummary}
                setTestStatus={setTestStatus}
                score={`${testSummary.userScore} / ${testSummary.totalMarks}`}
              />
            </RouteChangeWarning>
          )}
        </>
      )}
    </div>
  );
}

export default Page;
