"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, ChevronRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCourseSubjectsAndTopics } from "@/hooks/courses";
import { useQuery } from "@tanstack/react-query";

export default function PracticeQuestionsForm({ courseLink }) {
  const { data: courseSubjectsAndTopics } = useQuery({
    queryKey: ["courseSubjectsAndTopics", courseLink],
    queryFn: () => getCourseSubjectsAndTopics(courseLink),
  });

  const router = useRouter();
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [onlyUnsolved, setOnlyUnsolved] = useState(true);

  const handleSubjectChange = (value) => {
    setSelectedSubject(value);
    setSelectedTopic("");
  };

  const handleStartPractice = () => {
    const params = new URLSearchParams();

    if (selectedSubject !== "all") {
      params.append("subject", selectedSubject);

      if (selectedTopic !== "all") {
        params.append("topic", selectedTopic);
      }
    }

    if (onlyUnsolved) {
      params.append("unsolved", "true");
    }

    router.push(
      `/courses/${courseLink}/practice-questions?course=${courseSubjectsAndTopics.course._id}&${params.toString()}`
    );
  };

  return (
    <Card className="w-full overflow-hidden border-0 shadow-lg">
      <CardHeader className="space-y-1 pb-6 pt-8">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Practice Questions
          </h2>
        </div>
        <p className="text-sm text-slate-600">
          Prepare for exams with practice that fits your learning style.
        </p>
      </CardHeader>

      <CardContent className="pb-8">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-3">
            <Label
              htmlFor="subject"
              className="text-sm font-medium text-slate-700"
            >
              Subject
            </Label>
            <Select value={selectedSubject} onValueChange={handleSubjectChange}>
              <SelectTrigger id="subject" className="h-11 bg-white">
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {courseSubjectsAndTopics?.subjects?.length > 0 &&
                  courseSubjectsAndTopics.subjects.map((subject) => (
                    <SelectItem key={subject._id} value={subject._id}>
                      {subject.title}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label
              htmlFor="topic"
              className={`text-sm font-medium ${selectedSubject === "all" ? "text-slate-400" : "text-slate-700"}`}
            >
              Topic
            </Label>
            <Select
              value={selectedTopic}
              onValueChange={setSelectedTopic}
              disabled={selectedSubject === "all"}
            >
              <SelectTrigger
                id="topic"
                className={`h-11 ${selectedSubject === "all" ? "bg-slate-50 text-slate-400" : "bg-white"}`}
              >
                <SelectValue
                  placeholder={
                    selectedSubject === "all"
                      ? "Select a subject first"
                      : "Select a topic"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Topics</SelectItem>
                {courseSubjectsAndTopics?.topics?.length > 0 &&
                  courseSubjectsAndTopics.topics
                    .filter((topic) => topic.subjectId === selectedSubject)
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((topic) => (
                      <SelectItem key={topic._id} value={topic._id}>
                        {topic.name}
                      </SelectItem>
                    ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center md:mt-8">
            <Checkbox
              id="unsolved-only"
              checked={onlyUnsolved}
              onCheckedChange={(checked) => setOnlyUnsolved(checked)}
              className="h-5 w-5"
            />
            <Label
              htmlFor="unsolved-only"
              className="ml-2 cursor-pointer text-sm font-medium text-slate-700"
            >
              Only show unsolved questions
            </Label>
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-gradient-to-r px-6 pb-8 pt-4">
        <Button
          onClick={handleStartPractice}
          className="h-12 w-full max-w-md bg-primary text-white hover:bg-emerald-700 md:max-w-xs lg:max-w-sm"
          size="lg"
        >
          <BookOpen className="mr-2 h-5 w-5" />
          Start Practice
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </CardFooter>
    </Card>
  );
}
