// Backend
import formidable from "formidable"
import { NextApiRequest, NextApiResponse } from "next"
import FormData from "form-data"
import * as fs from "fs"
import { v2 as cloudinary } from "cloudinary"

export const config = {
    api: {
        bodyParser: false,
    },
}

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        console.log("START CARROT")
        console.log(req)
        const form = new formidable.IncomingForm()
        const submitForm = new FormData()

        form.parse(req, async (err, fields, files) => {
            const file = Array.isArray(files.file) ? files.file[0] : files.file
            console.log('🔥 hegre')
            console.log(fields)
            console.log(fields["public_id"])
            console.log(process.env.CLOUDINARY_KEY)

            submitForm.append("public_id", fields["public_id"])
            submitForm.append("api_key", process.env.CLOUDINARY_KEY)

            console.log("file: ", file)
            console.log("file: ", file.path)
            console.log("file: ", file.filepath)

            // @ts-ignore
            // submitForm.append("file", fs.createReadStream(file.path))
            submitForm.append("file", fs.createReadStream(file.filepath))

            const timestamp = Math.round(new Date().getTime() / 1000)

            const opts = {
                public_id: fields["public_id"],
                timestamp: timestamp,
            }

            const signature = cloudinary.utils.api_sign_request(
                opts,
                process.env.CLOUDINARY_SECRET!
            )
            submitForm.append("signature", signature)
            submitForm.append("timestamp", timestamp)
            console.log("Form")
            console.log(submitForm)

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/innercircle/upload`,
                {
                    method: "post",
                    // @ts-ignore
                    body: submitForm,
                }
            )

            console.log("Response")
            console.log(response)

            res.status(200).json(response)
        })
    } catch (error) {
        res.status(200).json({
            message: `Profile picture failed to update.: ${error}`,
        })
    }
}