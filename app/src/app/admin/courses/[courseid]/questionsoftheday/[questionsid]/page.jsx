import AdminQuestionOfTheDay from "@/components/adminComponents/AdminQuestionOfTheDay/AdminQuestionOfTheDay";

export default function page({ params }) {
  return (
    <div className="content-container">
      <AdminQuestionOfTheDay
        courseId={params.courseid}
        questionsOfTheDayId={params.questionsid}
      />
    </div>
  );
}
