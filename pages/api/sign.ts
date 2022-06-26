import { v2 as cloudinary } from "cloudinary"

export default function signature(req, res) {
    // Get the timestamp in seconds
    const timestamp = Math.round(new Date().getTime() / 1000)

    console.log("BODY")
    console.log(req.body)

    const opts = {
        public_id: req.body,
        timestamp: timestamp,
    }
    console.log(opts)

    // Get the signature using the Node.js SDK method api_sign_request
    const signature = cloudinary.utils.api_sign_request(
        opts,
        process.env.CLOUDINARY_SECRET!
    )

    console.log("sign: ", signature)
    console.log("timestamp: ", timestamp)

    res.statusCode = 200
    res.json({ signature, timestamp })
}
