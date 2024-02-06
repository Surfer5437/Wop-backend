const express = require("express");
const router = new express.Router();
const multer = require('multer');
const { s3Uploads } = require("../helpers/s3Service");


const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        console.log(file)
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error("Only PDF files are allowed"), false);
        }
    },
    limits: { fileSize: 100000000 }, // Example limit
});
/** POST /  =>
 * 
 *  Returns { companies: [ { handle, name, description, numEmployees, logoUrl }, ...] }
 * 
 * Authorization required: admin
 */

router.post('/', upload.array('file'), async (req, res) => {
    try {
const results = await s3Uploads({ files: req.files });

        return res.json({ status: "success", results });
    } catch (error) {
        if (error instanceof multer.MulterError) {
            // Handle multer-specific errors here (e.g., file size limit)
            return res.status(400).send(`Multer error: ${error.message}`);
        } else {
            // Handle general errors here
            return res.status(500).send(`Error uploading files: ${error.message}`);
        }
    }
});


module.exports = router;