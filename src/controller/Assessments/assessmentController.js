const AssessmentModel = require('../../../models/assessmentModels');

exports.getAssessments = async (req, res) => {
    const assessments = await AssessmentModel.getAllAssessments();
    res.json(assessments);
}

