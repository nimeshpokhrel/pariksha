import { Course } from "../models/course.model.js";
import { Question } from "../models/question.model.js";
import { QuestionsOfTheDay } from "../models/questionsOfTheDay.model.js";

const startDate = new Date("2025-04-01T00:00:00.000+00:00");
const endDate = new Date("2025-04-10T00:00:00.000+00:00");

async function main() {
  const courses = await Course.find({});
  console.log(`🎓 Found ${courses.length} courses`);

  const days = getDatesInRange(startDate, endDate);

  for (const course of courses) {
    console.log(`\n📚 Processing course: ${course.title}`);

    if (!course.subjects || course.subjects.length === 0) {
      console.warn(`⚠️ Skipping course ${course.title} — no subjects`);
      continue;
    }

    for (const date of days) {
      const existing = await QuestionsOfTheDay.findOne({
        course: course._id,
        date,
      });

      if (existing) {
        console.log(
          `📅 Already exists for ${date.toISOString().split("T")[0]}`
        );
        continue;
      }

      const dailyQuestions = [];

      for (const subjectId of course.subjects) {
        const question = await Question.aggregate([
          { $match: { subjectId } },
          { $sample: { size: 1 } }, // randomly select one
        ]);

        if (question.length > 0) {
          dailyQuestions.push(question[0]._id);
        } else {
          console.warn(`⚠️ No question found for subject ${subjectId}`);
        }
      }

      if (dailyQuestions.length === course.subjects.length) {
        await QuestionsOfTheDay.create({
          course: course._id,
          date,
          questions: dailyQuestions,
        });

        console.log(
          `✅ Created QOTD for ${course.title} on ${date.toISOString().split("T")[0]}`
        );
      } else {
        console.warn(
          `⚠️ Incomplete QOTD for ${course.title} on ${date.toISOString().split("T")[0]}, skipping.`
        );
      }
    }
  }

  console.log("🏁 Done and disconnected");
}

function getDatesInRange(start, end) {
  const dates = [];
  const current = new Date(start);
  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

const qotdGenerator = () => {
  main().catch(console.error);
};

export { qotdGenerator };
