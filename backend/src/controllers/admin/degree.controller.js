import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Degree } from "../../models/degree.model.js";
import { University } from "../../models/university.model.js";
import { Sector } from "../../models/sector.model.js";

const createDegree = asyncHandler(async (req, res) => {
  const {
    link,
    name,
    coverImage,
    shortName,
    duration,
    semesterCount,
    university,
    sector,
    description,
    entranceCourse,
    eligibilityCriteria,
    gradingTextUp,
    gradingSystem,
    gradingTextDown,
    courseStructure,
    priority,
    faqs,
  } = req.body;

  try {
    if (
      [link, name, university, sector, coverImage, description].some(
        (field) => field?.trim() === ""
      )
    ) {
      throw new ApiError(400, "All required fields must be provided");
    }
  } catch (error) {
    console.log(error);
  }

  const universityId = await University.findById(university).select("_id");
  const sectorId = await Sector.findById(sector).select("_id");

  const degree = await Degree.create({
    link: link.trim(),
    name,
    coverImage,
    shortName,
    duration,
    semesterCount,
    university: universityId,
    sector: sectorId,
    description,
    entranceCourse,
    eligibilityCriteria,
    gradingTextUp,
    gradingSystem,
    gradingTextDown,
    courseStructure,
    priority: priority || 20,
    faqs,
  });

  const createdDegree = await Degree.findById(degree._id);
  if (!createdDegree) {
    throw new ApiError(500, "Something went wrong while creating the degree");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createdDegree, "Degree Created"));
});

const deleteDegree = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  const degree = await Degree.findById(_id);
  if (!degree) {
    throw new ApiError(404, "Degree not found");
  }

  await Degree.findByIdAndDelete(_id);
  return res.status(200).json(new ApiResponse(200, {}, "Degree deleted"));
});

const updateDegree = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  const {
    link,
    name,
    coverImage,
    shortName,
    duration,
    semesterCount,
    university,
    sector,
    description,
    entranceCourse,
    eligibilityCriteria,
    gradingTextUp,
    gradingSystem,
    gradingTextDown,
    courseStructure,
    priority,
    faqs,
  } = req.body;

  const degree = await Degree.findById(_id);
  if (!degree) {
    throw new ApiError(404, "Degree not found");
  }

  if (
    [link, name, coverImage, description].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All required fields must be provided");
  }

  const universityId = await University.findById(university).select("_id");
  const sectorId = await Sector.findById(sector).select("_id");

  const updatedDegree = await Degree.findByIdAndUpdate(
    _id,
    {
      link: link.trim(),
      name,
      coverImage,
      shortName,
      duration,
      semesterCount,
      university: universityId,
      sector: sectorId,
      description,
      entranceCourse,
      eligibilityCriteria,
      gradingTextUp,
      gradingSystem,
      gradingTextDown,
      courseStructure,
      priority: priority || degree.priority,
      faqs,
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedDegree, "Degree updated"));
});

export { createDegree, deleteDegree, updateDegree };
