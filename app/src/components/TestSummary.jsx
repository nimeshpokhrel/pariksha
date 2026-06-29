"use client";

import FullPageAd from "./FullPageAd";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  BarChart,
  BookOpen,
  BookText,
  ChevronRight,
  RotateCcw,
  Trophy,
  FileText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/utils/AuthContext";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function TestSummary({
  data,
  review,
  courseName,
  questionSet,
  userSubmissionData,
}) {
  const { user } = useAuth();
  const totalQuestions = questionSet.subjects.reduce((acc, subject) => {
    return acc + (subject.questions?.length || 0);
  }, 0);

  return (
    <>
      {/* <FullPageAd /> */}
      <div className="mx-auto max-w-4xl px-3">
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
            <Button size="lg" className="px-12" onClick={review}>
              Review Your Answers <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
          <Card className="border-none bg-white shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Your Score
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">
                {data.userScore} / {data.totalMarks}
              </span>
            </CardContent>
          </Card>

          <Card className="border-none bg-white shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Average Score
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">
                {Math.round(data.avgScore || 0)} / {data.totalMarks}
              </span>
            </CardContent>
          </Card>
          <Card className="border-none bg-white shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Your Rank
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-2">
              <Trophy FileTextclassName="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{data.userRank}</span>
            </CardContent>
          </Card>
          <Card className="border-none bg-white shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Your Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-2">
              <CircularProgressbar
                value={data.percentile}
                className="max-w-9"
              />
              <span className="text-sm font-semibold">
                {data.percentile.toFixed(0)}th Percentile
              </span>
            </CardContent>
          </Card>
        </div>

        <div className="my-12">
          <div className="mb-4 flex items-center gap-2">
            <BookText className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">Test Summary</h2>
          </div>

          <Card className="border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {data.userSummary.map((item, index) => {
                  const percentage =
                    (item.score / item.subjectTotalMarks) * 100;
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">
                          {item.subject}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {item.subjectMarks}/{item.subjectTotalMarks}
                        </span>
                      </div>
                      <Progress value={percentage} className="h-1.5" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mx-auto mb-10 max-w-4xl">
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
                    {data.topRanks?.length > 0 &&
                      data.topRanks.map((entry, index) => (
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
                                  <Trophy FileTextclassName="h-4 w-4" />
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

                    {!data.topRanks ||
                      (data.topRanks.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center">
                            <p className="text-md w-full text-center text-gray-600">
                              No user has completed this test yet.
                            </p>
                          </TableCell>
                        </TableRow>
                      ))}

                    {data.topRanks.filter(
                      (entry) => entry.user._id === user?._id
                    ).length === 0 &&
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

        <div className="flex w-full flex-col items-center justify-center">
          <Button
            size="lg"
            className="rounded-lg px-8 py-6"
            onClick={() => window.location.reload()}
          >
            <RotateCcw className="h-4 w-4" />
            Retake The Test
          </Button>
        </div>
      </div>
    </>
  );
}
