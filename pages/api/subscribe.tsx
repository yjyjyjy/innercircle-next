// const mailchimp = require('@mailchimp/mailchimp_marketing');
const mailchimpFactory = require("@mailchimp/mailchimp_transactional/src/index.js")
const mailchimp = mailchimpFactory(process.env.MANDRILL_API_KEY)
import prisma from '../../lib/prisma';


export default async function handler(req, res) {

    if (req.method !== 'POST') {
        res.status(400).send({ message: 'Only POST requests allowed' })
        return
    }

    if (!req.body.email) {
        res.status(400).send({ message: 'request body should contain email field' })
        return
    }
    try {
        const response = await prisma.subscriber.create({
            data: {
                email: req.body.email
            },
        })
        console.log("🐵")
        console.log(response)
        res.status(200).json({ email: response.email })
    } catch (error) {
        console.log("🚨")
        console.log(error)
        res.status(500).json({ error })
    }
}



