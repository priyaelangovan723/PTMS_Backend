const responseModel = require("../../../models/ResponseModel");

const fetchResponses = async (req, res) => {
  try {
    const { trainingId } = req.params;
    console.log(`📦 Fetching data for training ID: ${trainingId}`);

    const responses = await responseModel.getResponsesByTrainingId(trainingId);

    res.json({
      message: "Responses fetched successfully",
      data: responses.length > 0 ? responses : "No responses found",
    });
  } catch (error) {
    console.error("❌ Error fetching responses:", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { fetchResponses };
