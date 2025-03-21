const Training = require('../../../models/Training');
const {uploadApex, uploadStudentList} = require('../../../services/Backblaze/backblazeService');
const db = require ('../../../config/db')
exports.getAllTrainings = async (req, res) => {
    const trainings = await Training.getAll();
    res.json(trainings);
};
exports.getTrainingById = async (req, res) => {
    const training = await Training.getById(req.params.id);
    training ? res.json(training) : res.status(404).json({ message: 'Training not found' });
};
exports.createTraining = async (req, res) => {
    try {
        const { 
            Title, Resource, Domain, Technical, Year, StartDate, EndDate, Description, TrainingStatus, 
            TrainerID, Duration, Assessments, VenueDetails, SubmittedOn, RequestStatus, Remarks, 
            View, VendorName,AdminMail
        } = req.body;

        let fileUrl = null, fileName = null;
        let studentListUrl = null, studentListName = null;

        if (req.files) {
            if (req.files.ApexDetails && req.files.ApexDetails.length > 0) {
                const { path, originalname, mimetype } = req.files.ApexDetails[0];
                ({ fileUrl, fileName } = await uploadApex(path, originalname, mimetype));
            }

            if (req.files.studentListFile && req.files.studentListFile.length > 0) {
                const { path, originalname, mimetype } = req.files.studentListFile[0];
                ({ fileUrl: studentListUrl, fileName: studentListName } = await uploadStudentList(path, originalname, mimetype));
            }
        }

        const trainingId = await Training.create({
            Title, Resource, Domain, Technical, Year, StartDate, EndDate, Description, TrainingStatus, TrainerID, 
            Duration, Assessments, ApexDetails: fileUrl, VenueDetails, SubmittedOn, RequestStatus, Remarks, View, 
            VendorName, Filename: fileName, StudentsList: studentListUrl, StudentsListFilename: studentListName,AdminMail
        });

        res.status(201).json({ message: 'Training created', trainingId, downloadUrl: fileUrl, studentListUrl });
    } catch (error) {
        console.error("Error creating training:", error);
        res.status(500).json({ message: "Error creating training", error: error.message });
    }
};



exports.updateTrainingStatus = async (req, res) => {
    const { status } = req.body;
    const result = await Training.updateTrainingStatus(req.params.id, status);
    res.json(result);
};

exports.updateRequestStatus = async (req, res) => {
    const { status, remarks } = req.body;
    try {
        const result = await Training.updateRequestStatus(req.params.id, status, remarks);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.updateVenueDetails = async (req, res) => {
    const { venueDetails } = req.body;
    const result = await Training.updateVenueDetails(req.params.id, venueDetails);
    res.json(result);
};

exports.getTrainings = async (req, res) => {
    try {
        const rollNo = req.params.rollNo;
        const trainings = await Training.getTrainingsByRollNo(rollNo);
        res.status(200).json(trainings);
    } catch (error) {
        res.status(500).json({ error: "Database error" });
    }
};

exports.getAllStudents = async (req, res) => {
    const trainings = await Training.getAllstudents();
    res.json(trainings);
};

exports.getAdminEmails = async (req, res) => {
    const query = "SELECT AdminMail FROM trainings WHERE AdminMail REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'";

    try {
        const [results] = await db.query(query);
        if (results.length === 0) {
            return res.status(404).json({ message: "No valid admin emails found" });
        }
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: 'Database query failed', details: err });
    }
};

exports.getTrainingsByAdmin = async (req, res) => {
    const { adminMail } = req.params;

    if (!adminMail) {
        return res.status(400).json({ error: "AdminMail is required" });
    }

    try {
        const query = "SELECT * FROM trainings WHERE AdminMail = ?";
        const [results] = await db.query(query, [adminMail]);

        if (results.length === 0) {
            return res.status(404).json({ message: "No trainings found for this admin" });
        }

        res.json(results);
    } catch (error) {
        console.error("Error fetching trainings:", error);
        res.status(500).json({ error: "Database query failed", details: error });
    }
};

