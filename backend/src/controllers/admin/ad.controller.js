import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Ad } from "../../models/ad.model.js";

const createAd = asyncHandler(async (req, res) => {
  const {
    banner100,
    banner200,
    fullPageMobile,
    fullPageDesktop,
    video,
    link,
    probability,
  } = req.body;

  const ad = await Ad.create({
    value: {
      banner100,
      banner200,
      fullPageMobile,
      fullPageDesktop,
      video,
      link,
    },
    probability,
  });

  return res.status(200).json(new ApiResponse(200, ad, "Ad Created"));
});

const updateAd = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  const {
    banner100,
    banner200,
    fullPageMobile,
    fullPageDesktop,
    video,
    link,
    probability,
  } = req.body;

  const ad = await Ad.findByIdAndUpdate(_id, {
    value: {
      banner100,
      banner200,
      fullPageMobile,
      fullPageDesktop,
      video,
      link,
    },
    probability,
  });

  return res.status(200).json(new ApiResponse(200, ad, "Ad updated"));
});

const deleteAd = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  await Ad.findByIdAndDelete(_id);
  return res.status(200).json(new ApiResponse(200, "Ad deleted"));
});

export { createAd, deleteAd, updateAd };
