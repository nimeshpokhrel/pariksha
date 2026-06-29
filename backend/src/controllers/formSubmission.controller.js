import { FormSubmission } from "../models/formSubmissions.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getFormSubmissions = asyncHandler(async (req, res) => {
  const formSubmissions = await FormSubmission.find({});
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        formSubmissions,
        "Form submissions fetched successfully"
      )
    );
});

const addFormSubmission = asyncHandler(async (req, res) => {
  const { name, email, contactNumber, college, degree } = req.body;
  if (!name || !email || !contactNumber || !college || !degree) {
    throw new ApiError(400, "Missing required fields");
  }

  FormSubmission.create({
    name,
    email,
    contactNumber,
    college,
    degree,
  });
  res
    .status(200)
    .json(new ApiResponse(200, {}, "Form submission added successfully"));
});

const getFormSubmissionById = asyncHandler(async (req, res) => {
  const formSubmission = await FormSubmission.findById(req.params.id);
  res.status(200).json(formSubmission);
});

const updateFormSubmission = asyncHandler(async (req, res) => {
  const formSubmission = await FormSubmission.findById(req.params.id);
  formSubmission.update(req.body);
  await formSubmission.save();
  res.status(200).json(formSubmission);
});

const deleteFormSubmission = asyncHandler(async (req, res) => {
  const formSubmission = await FormSubmission.findById(req.params.id);
  await formSubmission.remove();
  res.status(204).send();
});

export {
  getFormSubmissions,
  addFormSubmission,
  getFormSubmissionById,
  updateFormSubmission,
  deleteFormSubmission,
};
