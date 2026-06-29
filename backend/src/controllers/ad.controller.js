import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Ad } from "../models/ad.model.js";

const getAds = asyncHandler(async (req, res) => {
  // const user = await User.findById(req.user._id);

  // const location =
  //   user.studyLocation === "Eastern_Region" ? "East" : "Kathmandu";

  const ads = await Ad.find({}).select("value probability location");

  // const modifiedAds = ads.map((ad) => {
  //   if (location === "East" && ad.location === "East") {
  //     return {
  //       value: ad.value,
  //       probability: 4,
  //     };
  //   }
  //   return { value: ad.value, probability: ad.probability };
  // });

  return res
    .status(200)
    .json(new ApiResponse(200, ads, "Video fetched successfully."));
});

export { getAds };
