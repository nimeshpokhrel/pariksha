import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Sector } from "../../models/sector.model.js";

const createSector = asyncHandler(async (req, res) => {
  const {
    link,
    name,
    coverImage,
    description,
    areasOfStudy,
    careerProspect,
    faqs,
  } = req.body;

  if (
    [link, name, coverImage, description].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required.");
  }

  const sector = await Sector.create({
    link: link.trim(),
    name,
    coverImage,
    description,
    areasOfStudy,
    careerProspect,
    faqs,
  });

  const createdSector = await Sector.findById(sector._id);
  if (!createdSector) {
    throw new ApiError(500, "Something went wrong while creating the sector");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createdSector, "Sector Created"));
});

const deleteSector = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  await Sector.findByIdAndDelete(_id);
  return res.status(200).json(new ApiResponse(200, {}, "Sector deleted"));
});

const updateSector = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  const {
    name,
    description,
    coverImage,
    link,
    areasOfStudy,
    careerProspect,
    faqs,
  } = req.body;

  const sector = await Sector.findById(_id);
  if (!sector) {
    throw new ApiError(404, "Sector not found");
  }

  if (
    [link, name, coverImage, description].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required.");
  }

  await Sector.findByIdAndUpdate(_id, {
    link: link.trim(),
    name,
    coverImage,
    description,
    areasOfStudy,
    careerProspect,
    faqs,
  });
  return res.status(200).json(new ApiResponse(200, sector, "Sector updated"));
});

export { createSector, deleteSector, updateSector };
