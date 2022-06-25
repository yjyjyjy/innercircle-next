import { v2 as cloudinary } from "cloudinary"

export default function signature(req, res) {
    // Get the timestamp in seconds
    const timestamp = Math.round(new Date().getTime() / 1000)

    const opts = {
        public_id: req.body,
        timestamp: timestamp,
    }

    // Get the signature using the Node.js SDK method api_sign_request
    const signature = cloudinary.utils.api_sign_request(
        opts,
        "KKkxKl0GexTmL8W1eJD5WWevxwo"
    )

    res.statusCode = 200
    res.json({ signature, timestamp })
}
