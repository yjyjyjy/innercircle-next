import { NextApiRequest, NextApiResponse } from "next"
import nextConnect from "next-connect"
import multer from "multer"
import { v2 as cloudinary } from "cloudinary"
import FormData from "form-data"

const apiRoute = nextConnect({
    onError(error, req, res: NextApiResponse) {
        res.status(501).json({
            error: `Sorry something Happened! ${error.message}`,
        })
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method "${req.method}" Not Allowed` })
    },
})

apiRoute.use(multer().any())

apiRoute.post(async (req: any, res) => {
    try {
        const url = `https://api.cloudinary.com/v1_1/innercircle/upload`

        console.log("Banana")
        // console.log(req.files[0]) // Your files here
        // console.log(req.body.public_id) // Your form data here

        const uploadedFile = req.files[0]
        const id = req.body.public_id

        // Get Signature
        const timestamp = Math.round(new Date().getTime() / 1000)

        const opts = {
            public_id: id,
            timestamp: timestamp,
        }

        const signature = cloudinary.utils.api_sign_request(
            opts,
            "KKkxKl0GexTmL8W1eJD5WWevxwo"
        )

        const formData = new FormData()

        formData.append("signature", signature)
        formData.append("timestamp", timestamp.toString())
        formData.append("api_key", process.env.CLOUDINARY_KEY!)
        formData.append("public_id", id)

        console.log("----------------------------------")
        console.log("KEY: ", process.env.CLOUDINARY_KEY)
        console.log("signature: ", signature)
        console.log("timestamp: ", timestamp)
        console.log("public_id: ", id)

        console.log(formData)

        // formData.append("file", uploadedFile)

        // console.log(formData)

        const response = await fetch(url, {
            method: "post",
            // @ts-ignore
            body: formData,
        })

        res.status(200).json({ data: "success" })
    } catch (error) {
        res.status(200).json({
            message: `Profile picture failed to update.: ${error}`,
        })
    }
})

export default apiRoute

// For preventing header corruption, specifically Content-Length header
export const config = {
    api: {
        bodyParser: false, // Disallow body parsing, consume as stream
    },
}

// const uploadDisplayPicture = async (
//     req: NextApiRequest,
//     res: NextApiResponse
// ) => {
//     console.log("BODY: ")
//     console.log(req.body)
// try {
//     let payloadData = {
//         ...JSON.parse(req.body),
//     }
//     const userID = payloadData.id
//     const formData = payloadData.id

//     const url = `https://api.cloudinary.com/v1_1/innercircle/upload`
//     //id: string, displayPicture: File
//     const sign = await fetch("/api/sign", {
//         method: "POST",
//         body: JSON.stringify(id),
//     })
//     const { signature, timestamp } = await sign.json()

//     // const formData = new FormData()
//     // formData.append("file", displayPicture)
//     formData.append("signature", signature)
//     formData.append("timestamp", timestamp)
//     formData.append("api_key", process.env.CLOUDINARY_KEY!)
//     formData.append("public_id", userID)

//     const response = await fetch(url, {
//         method: "post",
//         body: formData,
//     })

// res.status(200).json({
//     message: "Profile picture successfully updated!",
// })
// } catch (error) {
//     res.status(200).json({
//         message: "Profile picture failed to update.",
//     })
// }
// }

// export default uploadDisplayPicture
