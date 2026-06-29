import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";

import { Section } from "../../models/section.model.js";
import { Subject } from "../../models/subject.model.js";

import { ApiResponse } from "../../utils/ApiResponse.js";
import convertToMongoId from "../../utils/convertToMongoId.js";
import { deleteSectionFunc } from "../../functions/deleteFunctions.js";

const createSection = asyncHandler(async (req, res) => {
  const { title, subjectId, courseId } = req.body;

  if ([title, subjectId].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required.");
  }

  const section = await Section.create({
    title,
    course: courseId,
    subject: subjectId,
  });
  const createdSection = await Section.findById(section._id);
  if (!createdSection) {
    throw new ApiError(500, "Something went wrong while creating the section.");
  }

  const updatedSubject = await Subject.findByIdAndUpdate(
    subjectId,
    { $push: { sections: createdSection._id } },
    { new: true }
  );

  if (!updatedSubject) {
    throw new ApiError(500, "Something went wrong while updating the subject.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createdSection, "Section Created"));
});

const updateSectionsArray = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  const newArray = req.body;

  const convertedArray = newArray.map((section) => {
    return convertToMongoId(section);
  });

  const subject = await Subject.findById(_id);
  if (!subject) {
    throw new ApiError(404, "Subject not found");
  }
  if (newArray.length === 0) {
    throw new ApiError(400, "Something Went Wrong");
  }

  await Subject.findByIdAndUpdate(_id, {
    sections: convertedArray,
  });
  return res.status(200).json(new ApiResponse(200, subject, "Subject updated"));
});

const updateSection = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  const { title } = req.body;

  const section = await Section.findById(_id);
  if (!section) {
    throw new ApiError(404, "Section not found");
  }

  if ([title].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required.");
  }

  await Section.findByIdAndUpdate(_id, {
    title,
  });
  return res.status(200).json(new ApiResponse(200, section, "Section updated"));
});

const deleteSection = asyncHandler(async (req, res) => {
  const { subjectId, _id } = req.params;

  const section = await Section.findById(_id);
  await Subject.findByIdAndUpdate(
    subjectId,
    {
      $pull: { sections: section._id },
      $inc: { videoCount: -1 * section.videoCount },
    },
    { new: true }
  );
  await deleteSectionFunc(section._id);

  return res.status(200).json(new ApiResponse(200, {}, "Section deleted"));
});

const getSection = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  const section = await Section.findById(_id).populate({ path: "videos" });
  if (!section) {
    throw new ApiError(404, "Section not found");
  }
  return res.status(200).json(new ApiResponse(200, section, "Section fetched"));
});

export {
  createSection,
  updateSectionsArray,
  updateSection,
  deleteSection,
  getSection,
};
