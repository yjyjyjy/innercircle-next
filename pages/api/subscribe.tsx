// const mailchimp = require('@mailchimp/mailchimp_marketing');
const mailchimpFactory = require("@mailchimp/mailchimp_transactional/src/index.js")
const mailchimp = mailchimpFactory(process.env.MANDRILL_API_KEY)
import prisma from '../../lib/prisma';


export default async function handler(req, res) {

    if (req.method !== 'POST') {
        res.status(400).send({ error: 'Only POST requests allowed' })
        return
    }

    if (!req.body.email) {
        res.status(400).send({ error: 'request body should contain email field' })
        return
    }

    const email = String(req.body.email).toLocaleLowerCase()

    if (!email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        res.status(400).send({ error: 'Please type in a valid email address' })
        return
    }

    try {
        const response = await prisma.subscriber.create({
            data: { email }
        })
        console.log("🐵")
        console.log(response)
        res.status(200).json({ email: response.email })
    } catch (error) {
        console.log("🚨")
        console.log(error)
        if (!!error.code && error.code === 'P2002') {
            // violated unique restriction
            res.status(409).json({ error: 'The email has already been subscribed.' })
        }
        // catch all for all other errors
        res.status(400).json({
            error: 'Something went wrong.'
        })
    }
}



