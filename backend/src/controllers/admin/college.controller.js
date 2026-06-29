import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { College } from "../../models/college.model.js";
import { University } from "../../models/university.model.js";
import { Degree } from "../../models/degree.model.js";

const createCollege = asyncHandler(async (req, res) => {
  const {
    link,
    name,
    logo,
    university,
    degrees,
    coverImage,
    location,
    facebookLink,
    instagramLink,
    websiteLink,
    emailLink,
    phoneNumber,
    heading,
    description,
    foundedYear,
    salientFeatures,
    gallery = [],
    faqs,
    priority,
  } = req.body;

  if (
    [
      link,
      name,
      logo,
      university,
      degrees,
      coverImage,
      location,
      phoneNumber,
      heading,
      description,
      foundedYear,
    ].some((f) => f == null || (typeof f === "string" && f.trim() === ""))
  ) {
    throw new ApiError(400, "All required fields must be provided");
  }
  if (!Array.isArray(degrees) || degrees.length === 0) {
    throw new ApiError(400, "At least one degree ID must be provided");
  }

  const uniDoc = await University.findById(university).select("_id");
  if (!uniDoc) throw new ApiError(404, "University not found");

  const degreeDocs = await Degree.find({ _id: { $in: degrees } }).select("_id");
  if (degreeDocs.length !== degrees.length) {
    throw new ApiError(404, "One or more degrees not found");
  }

  const college = await College.create({
    link: link.trim(),
    name: name.trim(),
    logo,
    university: uniDoc._id,
    degrees: degreeDocs.map((d) => d._id),
    coverImage,
    location,
    facebookLink,
    instagramLink,
    websiteLink,
    emailLink,
    phoneNumber,
    heading,
    description,
    foundedYear,
    salientFeatures,
    gallery,
    faqs,
    priority,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, college, "College created successfully"));
});

const deleteCollege = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  const college = await College.findById(_id);
  if (!college) {
    throw new ApiError(404, "College not found");
  }

  await College.findByIdAndDelete(_id);
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "College deleted successfully"));
});

const updateCollege = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  const {
    link,
    name,
    logo,
    university,
    degrees,
    coverImage,
    location,
    facebookLink,
    instagramLink,
    websiteLink,
    emailLink,
    phoneNumber,
    heading,
    description,
    foundedYear,
    salientFeatures,
    gallery,
    faqs,
    priority,
  } = req.body;

  const college = await College.findById(_id);
  if (!college) throw new ApiError(404, "College not found");

  if (
    [
      link,
      name,
      logo,
      university,
      degrees,
      coverImage,
      location,
      phoneNumber,
      heading,
      description,
      foundedYear,
    ].some((f) => f == null || (typeof f === "string" && f.trim() === ""))
  ) {
    throw new ApiError(400, "All required fields must be provided");
  }
  if (!Array.isArray(degrees) || degrees.length === 0) {
    throw new ApiError(400, "At least one degree ID must be provided");
  }

  const [uniDoc, degreeDocs] = await Promise.all([
    University.findById(university).select("_id"),
    Degree.find({ _id: { $in: degrees } }).select("_id"),
  ]);
  if (!uniDoc) throw new ApiError(404, "University not found");
  if (degreeDocs.length !== degrees.length) {
    throw new ApiError(404, "One or more degrees not found");
  }

  const updated = await College.findByIdAndUpdate(
    _id,
    {
      link: link.trim(),
      name: name.trim(),
      logo,
      university: uniDoc._id,
      degrees: degreeDocs.map((d) => d._id),
      coverImage,
      location,
      facebookLink,
      instagramLink,
      websiteLink,
      emailLink,
      phoneNumber,
      heading,
      description,
      foundedYear,
      salientFeatures,
      gallery,
      faqs,
      priority,
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updated, "College updated successfully"));
});

export { createCollege, deleteCollege, updateCollege };
