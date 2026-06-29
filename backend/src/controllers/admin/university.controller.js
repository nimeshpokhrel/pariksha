import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { University } from "../../models/university.model.js";

const createUniversity = asyncHandler(async (req, res) => {
  const {
    link,
    name,
    description,
    logo,
    coverImage,
    websiteLink,
    establishments,
    location,
    foundedYear,
    students,
    ownership,
    faqs,
  } = req.body;

  if (
    [
      link,
      name,
      description,
      logo,
      coverImage,
      websiteLink,
      establishments,
      location,
      foundedYear,
      students,
      ownership,
    ].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required.");
  }

  const university = await University.create({
    link: link.trim(),
    name,
    description,
    logo,
    coverImage,
    websiteLink,
    establishments,
    location,
    foundedYear,
    students,
    ownership,
    faqs,
  });

  const createdUniversity = await University.findById(university._id);
  if (!createdUniversity) {
    throw new ApiError(
      500,
      "Something went wrong while creating the university"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createdUniversity, "University Created"));
});

const deleteUniversity = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  await University.findByIdAndDelete(_id);
  return res.status(200).json(new ApiResponse(200, {}, "University deleted"));
});

const updateUniversity = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  const {
    name,
    description,
    link,
    websiteLink,
    establishments,
    location,
    foundedYear,
    students,
    ownership,
    faqs,
  } = req.body;

  const university = await University.findById(_id);
  if (!university) {
    throw new ApiError(404, "University not found");
  }

  if (
    [
      name,
      description,
      link,
      websiteLink,
      establishments,
      location,
      foundedYear,
      students,
      ownership,
    ].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required.");
  }

  await University.findByIdAndUpdate(_id, {
    name,
    description,
    link: link.trim(),
    websiteLink,
    establishments,
    location,
    foundedYear,
    students,
    ownership,
    faqs,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, university, "University updated"));
});

export { createUniversity, deleteUniversity, updateUniversity };
