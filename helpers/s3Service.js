const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

exports.s3Uploads = async (body) => {
    const s3client = new S3Client({ region: process.env.AWS_REGION }); // Specify the AWS region

    try {
        
        // for (const file of body.files) {
        //     console.log(file)
        // }
        const uploadPromises = body.files.map((file) => {
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `uploads/${Date.now()}_${file.originalname}`,
                Body: file.buffer,
                ContentType: file.mimetype, // This ensures the correct content type is set in S3
            };
            return s3client.send(new PutObjectCommand(params));
        });

        // Await all upload promises to resolve
        const results = await Promise.all(uploadPromises);
        return results; // Return the results of the upload
    } catch (error) {
        console.error("Error uploading files: ", error);
        throw error; // Rethrow the error to be handled by the caller
    }
};
