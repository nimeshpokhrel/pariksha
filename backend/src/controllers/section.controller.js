// import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiError } from "../utils/ApiError.js";

// import { Section } from "../models/section.model.js";
// import { Subject } from "../models/subject.model.js";

// import { ApiResponse } from "../utils/ApiResponse.js";

// const createSection = asyncHandler(async (req, res) => {
//   const { title, subjectId } = req.body;

//   if ([title, subjectId].some((field) => field?.trim() === "")) {
//     throw new ApiError(400, "All fields are required.");
//   }

//   const section = await Section.create({
//     title,
//   });
//   const createdSection = await Section.findById(section._id);
//   if (!createdSection) {
//     throw new ApiError(500, "Something went wrong while creating the section.");
//   }

//   const updatedSubject = await Subject.findByIdAndUpdate(
//     subjectId,
//     { $push: { sections: createdSection._id } },
//     { new: true }
//   );

//   if (!updatedSubject) {
//     throw new ApiError(500, "Something went wrong while updating the subject.");
//   }

//   return res
//     .status(200)
//     .json(new ApiResponse(200, createdSection, "Section Created"));
// });

// export { createSection };
