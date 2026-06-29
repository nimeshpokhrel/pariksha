import { useAuth } from "@/utils/AuthContext";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  Trophy,
  BookOpen,
  Users,
  BarChart,
  ChevronRight,
  Award,
  History,
  BookText,
  ArrowLeft,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

export default function TestDetails({
  questionSet,
  userSubmissionData,
  topRanks,
  start,
  courseName,
}) {
  const { testHistory, user } = useAuth();

  const totalQuestions = questionSet.subjects.reduce((acc, subject) => {
    return acc + (subject.questions?.length || 0);
  }, 0);

  return (
    <div className="content-container">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 mt-4 rounded-xl bg-background">
          <Link
            href={`/courses/${courseName}`}
            className="mb-4 inline-flex items-center text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Course
          </Link>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {questionSet.title}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge variant={"outline"} className="text-sm">
                  {totalQuestions} Questions
                </Badge>
                <Badge variant={"outline"} className="text-sm">
                  120 Minutes
                </Badge>
              </div>
            </div>
            <Button size="lg" className="px-16" onClick={start}>
              Start Test <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Card className="border-none bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{totalQuestions}</span>
            </CardContent>
          </Card>

          <Card className="border-none bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Average Score
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">
                {Math.round(questionSet.avgScore || 0)}/100
              </span>
            </CardContent>
          </Card>

          <Card className="border-none bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Your Best Score
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">
                {userSubmissionData.score || 0}/100
              </span>
            </CardContent>
          </Card>

          <Card className="border-none bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Your Rank
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">
                {userSubmissionData.rank || 0}/{questionSet.submissionCount}
              </span>
            </CardContent>
          </Card>
        </div>

        {/* Test Structure - Horizontal but more neutral */}
        <div className="my-12">
          <div className="mb-4 flex items-center gap-2">
            <BookText className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">Test Structure</h2>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
            {questionSet.subjects.map((subject, index) => (
              <Card
                key={index}
                className="rounded-lg border border-none bg-gray-50 shadow-sm"
              >
                <CardContent className="flex flex-col items-center justify-center p-3">
                  <p className="text-lg font-bold text-primary">
                    {subject.questions.length}
                  </p>
                  <p className="text-center text-sm text-gray-600">
                    {subject.name}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="mx-auto mb-16 max-w-4xl">
          <Card className="overflow-hidden border-none bg-white shadow">
            <CardContent className="p-0">
              <div className="bg-primary p-4 text-white">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-white" />
                  <h2 className="text-lg font-bold">Top Performers</h2>
                </div>
                <p className="text-sm text-indigo-100">
                  Students with the highest scores on this test
                </p>
              </div>

              <div className="p-0">
                <Table>
                  <TableBody>
                    {topRanks &&
                      topRanks.length > 0 &&
                      topRanks.map((entry, index) => (
                        <TableRow
                          key={entry._id}
                          className={` ${
                            index < 3
                              ? index === 0
                                ? "bg-yellow-50 hover:bg-yellow-50"
                                : index === 1
                                  ? "bg-gray-50 hover:bg-gray-50"
                                  : "bg-orange-50 hover:bg-orange-50"
                              : "text-gray-500 hover:bg-gray-100"
                          } transition-colors duration-200 hover:text-gray-900`}
                        >
                          <TableCell className="w-16 font-medium">
                            {index === 0 ? (
                              <div className="flex items-center">
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-500 text-white">
                                  <Trophy className="h-4 w-4" />
                                </div>
                              </div>
                            ) : index === 1 ? (
                              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-400 text-white">
                                2
                              </div>
                            ) : index === 2 ? (
                              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#cd7f32] text-white">
                                3
                              </div>
                            ) : (
                              <div className="pl-2">{index + 1}</div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {entry.user.fullName}
                              {user && user?._id === entry.user._id && (
                                <Badge className="h-max rounded-xl bg-primary/20 px-3 py-0 text-[9px] text-primary">
                                  You
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className={index < 3 ? "font-semibold" : ""}>
                              {entry.score}/{totalQuestions}
                            </div>
                          </TableCell>
                          <TableCell className="hidden text-right text-sm sm:block">
                            {formatDistanceToNow(new Date(entry.createdAt), {
                              addSuffix: true,
                            }).replace(/^about\s/, "")}
                          </TableCell>
                        </TableRow>
                      ))}

                    {topRanks.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center">
                          <p className="text-md w-full text-center text-gray-600">
                            No user has completed this test yet.
                          </p>
                        </TableCell>
                      </TableRow>
                    )}

                    {topRanks.filter((entry) => entry.user._id === user?._id)
                      .length === 0 &&
                      userSubmissionData?.userSubmitted &&
                      Object.keys(userSubmissionData).length > 0 && (
                        <TableRow className="bg-primary/10 text-gray-500 hover:bg-primary/10 hover:text-black">
                          <TableCell className="font-medium">
                            <div className="pl-2">
                              {userSubmissionData.rank}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge className="h-max rounded-xl bg-primary/20 px-3 py-0 text-[9px] text-primary">
                                You
                              </Badge>
                              {user?.fullName}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span>{userSubmissionData.score}/100</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right text-sm"></TableCell>
                        </TableRow>
                      )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Test History */}
        <div className="mx-auto max-w-4xl">
          <Card className="overflow-hidden border-none bg-white shadow">
            <CardContent className="p-0">
              <div className="bg-primary p-4 text-white">
                <div className="flex items-center gap-2">
                  <History className="h-5 w-5 text-white" />
                  <h2 className="text-lg font-bold">Your Test History</h2>
                </div>
                <p className="text-sm text-indigo-100">
                  Your history for this question set.
                </p>
              </div>

              <Table>
                <TableBody>
                  {testHistory
                    .filter((test) => test.questionSetId === questionSet._id)
                    .map((entry, index) => (
                      <TableRow key={entry._id}>
                        <TableCell className="pl-4 font-medium">
                          {index + 1}
                        </TableCell>
                        <TableCell className="text-center">
                          <span>
                            {entry.score}/{totalQuestions}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {formatDistanceToNow(new Date(entry.createdAt), {
                            addSuffix: true,
                          }).replace(/^about\s/, "")}
                        </TableCell>
                      </TableRow>
                    ))}
                  {(!testHistory ||
                    testHistory.filter(
                      (test) => test.questionSetId === questionSet._id
                    ).length === 0) && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center">
                        <p className="text-md w-full text-center text-gray-600">
                          {user
                            ? `You have not completed this test yet.`
                            : `Please login to view your test history.`}
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
