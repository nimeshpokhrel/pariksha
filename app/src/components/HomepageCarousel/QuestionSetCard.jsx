import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export default function QuestionSetCard({
  link,
  title,
  userScore,
  avgScore,
  duration,
  questionCount,
}) {
  return (
    <div className="h-full">
      <Link href={link}>
        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Questions</span>
                <Badge variant="outline">{questionCount} Questions</Badge>
              </div>
              <div className="flex justify-between">
                <span>Estimated Time</span>
                <Badge variant="outline">{duration / 60 || "2"} Hours</Badge>
              </div>
              <div className="flex justify-between">
                <span>Your Score</span>
                <Badge variant="outline">{userScore}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Average Score</span>
                <Badge variant="outline">{avgScore}</Badge>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Start Test</Button>
          </CardFooter>
        </Card>
      </Link>
    </div>
  );
}
