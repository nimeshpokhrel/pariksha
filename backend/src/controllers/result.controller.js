import { Result } from "../models/result.model.js";

export const getResultMocktests = async (req, res) => {
  try {
    const results = await Result.find({}, "mocktest").lean();
    const mocktests = results.map((result) => result.mocktest);
    res.status(200).json({
      message: "Mock tests fetched successfully",
      mocktests: mocktests,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getResult = async (req, res) => {
  try {
    const { mocktest, symbolNo } = req.body;

    const result = await Result.findOne(
      {
        mocktest: mocktest,
        "results.symbolNo": symbolNo,
      },
      {
        mocktest: 1,
        results: { $elemMatch: { symbolNo } },
      }
    );

    if (!result) {
      return res.status(404).json({
        message: "Result not found for the given mock test and symbol number",
      });
    }

    return res.status(200).json({
      message: "Result fetched successfully",
      result: result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
