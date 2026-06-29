"use client";

import { useState, useMemo, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  FileQuestion,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  isAfter,
} from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/utils/AuthContext";

export default function QuestionsOfTheDayCalendar({
  questionSets = [],
  courseLink,
}) {
  const { questionsOfTheDayHistory } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [completedQuestionSetIds, setCompletedQuestionSetIds] = useState([]);

  useEffect(() => {
    setCompletedQuestionSetIds(questionsOfTheDayHistory);
  }, [questionsOfTheDayHistory]);

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const processedQuestionSets = useMemo(() => {
    return questionSets.map((set) => ({
      ...set,
      dateObj: new Date(set.date),
      completed: completedQuestionSetIds.includes(set._id),
    }));
  }, [questionSets, completedQuestionSetIds]);

  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const startDay = startOfMonth(currentMonth).getDay();

  const selectedQuestionSet = processedQuestionSets.find((set) =>
    isSameDay(new Date(set.date), selectedDate)
  );

  const hasQuestionSet = (date) => {
    return processedQuestionSets.some((set) =>
      isSameDay(new Date(set.date), date)
    );
  };

  const isQuestionSetCompleted = (date) => {
    const set = processedQuestionSets.find((set) =>
      isSameDay(new Date(set.date), date)
    );
    return set?.completed || false;
  };

  const isFutureDate = (date) => {
    return isAfter(date, today);
  };

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3">
        {/* Calendar Section */}
        <div className="border-b border-slate-200 p-4 md:border-b-0 md:border-r md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">
              {format(currentMonth, "MMMM yyyy")}
            </h3>
            <div className="flex space-x-1">
              <Button
                variant="outline"
                size="icon"
                onClick={previousMonth}
                disabled={
                  currentMonth.getFullYear() === 2025 &&
                  currentMonth.getMonth() === 3
                }
                className={"disabled:opacity-30"}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextMonth}
                disabled={isSameMonth(currentMonth, new Date())}
                className={"disabled:opacity-30"}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Day names */}
          <div className="mb-2 grid grid-cols-7">
            {dayNames.map((day) => (
              <div
                key={day}
                className="py-1 text-center text-xs font-medium text-slate-500"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: startDay }).map((_, index) => (
              <div key={`empty-${index}`} className="h-9 rounded-md"></div>
            ))}

            {days.map((day) => {
              const hasSet = hasQuestionSet(day);
              const isCompleted = isQuestionSetCompleted(day);
              const isFuture = isFutureDate(day);

              const isDisabled = isFuture || !hasSet;

              return (
                <button
                  key={day.toString()}
                  onClick={() => !isDisabled && setSelectedDate(day)}
                  disabled={isDisabled}
                  className={`relative flex h-9 items-center justify-center rounded-md text-sm ${!isSameMonth(day, currentMonth) ? "text-slate-300" : ""} ${isToday(day) ? "bg-emerald-50 font-semibold text-emerald-600" : ""} ${isSameDay(day, selectedDate) ? "bg-primary text-white" : ""} ${hasSet && !isFuture && !isSameDay(day, selectedDate) ? "hover:bg-slate-100" : ""} ${isDisabled ? "cursor-not-allowed text-slate-300 opacity-50" : ""} `}
                >
                  {format(day, "d")}
                  {hasSet && !isFuture && isCompleted && (
                    <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-emerald-500"></div>
                  )}
                  {hasSet && !isFuture && !isCompleted && (
                    <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-slate-300"></div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Color Indicators */}
          <div className="mt-4 flex items-center justify-center space-x-6 text-xs text-slate-500">
            <div className="flex items-center">
              <div className="mr-1 h-3 w-3 rounded-full bg-emerald-500"></div>
              <span>Completed</span>
            </div>
            <div className="flex items-center">
              <div className="mr-1 h-3 w-3 rounded-full bg-slate-300"></div>
              <span>Available</span>
            </div>
          </div>
        </div>

        <div className="p-4 md:col-span-2 md:p-6">
          {selectedQuestionSet ? (
            <div className="flex h-full flex-col">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-primary" />
                    <h3 className="text-xl font-semibold">
                      {isToday(selectedDate)
                        ? "Today"
                        : format(selectedDate, "MMMM d, yyyy")}
                    </h3>
                  </div>
                  <p className="mt-1 text-slate-500">Daily Question Set</p>
                </div>
                <Badge
                  className={
                    selectedQuestionSet.completed
                      ? "bg-emerald-500"
                      : "bg-slate-500"
                  }
                >
                  {selectedQuestionSet.completed
                    ? "Completed"
                    : "Not Completed"}
                </Badge>
              </div>

              <Card className="flex-grow">
                <CardContent className="space-y-4 p-4">
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileQuestion className="mr-2 h-5 w-5 text-slate-400" />
                        <span className="font-medium">Total Questions</span>
                      </div>
                      <span>{selectedQuestionSet.questions.length}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Clock className="mr-2 h-5 w-5 text-slate-400" />
                        <span className="font-medium">Estimated Time</span>
                      </div>
                      <span>
                        {selectedQuestionSet.questions.length * 2} mins
                      </span>
                    </div>
                  </div>

                  {selectedQuestionSet.completed ? (
                    <div className="flex items-center py-2 text-primary/90">
                      <CheckCircle className="mr-2 h-5 w-5" />
                      <span className="font-medium">
                        Question set completed
                      </span>
                    </div>
                  ) : (
                    <div className="py-2 text-slate-600">
                      This question set has not been completed yet.
                    </div>
                  )}

                  <div>
                    <h4 className="mb-2 font-medium">Subjects Covered</h4>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(
                        new Set(
                          selectedQuestionSet.questions.map(
                            (q) => q.subjectId.title
                          )
                        )
                      ).map((subject) => (
                        <Badge
                          key={subject}
                          variant="outline"
                          className="bg-slate-50"
                        >
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-slate-50 px-4 py-3">
                  <Link
                    href={`/courses/${courseLink}/questions-of-the-day/${selectedQuestionSet._id}`}
                    className="w-full"
                  >
                    <Button className="w-full">
                      {selectedQuestionSet.completed
                        ? "Retake The Test"
                        : "Start The Test"}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center py-12">
              <Calendar className="mb-4 h-12 w-12 text-slate-300" />
              <h3 className="mb-2 text-xl font-semibold text-slate-700">
                No Question Set Available
              </h3>
              <p className="max-w-md text-center text-slate-500">
                There are no questions available for this date. Please select a
                date with an available question set.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
