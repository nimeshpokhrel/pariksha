"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, ChevronRight, Filter } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function PracticeQuestionPageSelector({
  courseLink,
  courseId,
  subjects,
  topics,
}) {
  const searchParams = useSearchParams();
  const subject = searchParams.get("subject");
  const topic = searchParams.get("topic");
  const unsolved = searchParams.get("unsolved");

  const router = useRouter();
  const [selectedSubject, setSelectedSubject] = useState(subject || "all");
  const [selectedTopic, setSelectedTopic] = useState(topic || "");
  const [onlyUnsolved, setOnlyUnsolved] = useState(unsolved === "true");
  const [open, setOpen] = useState(false);

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
      `/courses/${courseLink}/practice-questions?course=${courseId}&${params.toString()}`
    );

    // Close the popover if it's open
    setOpen(false);
  };

  const selectorContent = (
    <div className="grid grid-cols-1 items-center gap-6 p-0 md:grid-cols-4">
      <div className="space-y-3">
        <Label htmlFor="subject" className="text-sm font-medium text-slate-700">
          Subject
        </Label>
        <Select value={selectedSubject} onValueChange={handleSubjectChange}>
          <SelectTrigger id="subject" className="h-11 bg-white">
            <SelectValue placeholder="Select a subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {subjects?.length > 0 &&
              subjects.map((subject) => (
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
            {topics?.length > 0 &&
              topics
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

      <Button
        onClick={handleStartPractice}
        className="bg-primary text-white hover:bg-primary/95 md:mt-8"
      >
        <BookOpen className="mr-2 h-5 w-5" />
        Start
        <ChevronRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );

  return (
    <>
      {/* For medium and larger screens - show the full component */}
      <Card className="hidden w-full overflow-hidden rounded-none border-0 p-0 shadow-none md:block">
        <CardContent className="px-0 py-4">{selectorContent}</CardContent>
      </Card>

      <div className="py-4 md:hidden">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                Filter Questions
              </span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[calc(100vw-2rem)] p-4" align="center">
            <div className="grid gap-6">{selectorContent}</div>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
