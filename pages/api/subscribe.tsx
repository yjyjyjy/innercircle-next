// const mailchimp = require('@mailchimp/mailchimp_marketing');
const mailchimpFactory = require("@mailchimp/mailchimp_transactional/src/index.js")
const mailchimp = mailchimpFactory(process.env.MANDRILL_API_KEY)

export default async function handler(req, res) {

    if (req.method !== 'POST') {
        res.status(400).send({ message: 'Only POST requests allowed' })
        return
    }

    if (!req.body.email) {
        res.status(400).send({ message: 'request body should contain email field' })
        return
    }

    const email = req.body.email

    console.log("🐵")


    const response = await mailchimp.users.ping2();
    console.log(response);
    // mailchimp.setConfig({
    //     apiKey: process.env.MAILCHIMP_API_KEY,
    //     server: 'us14'
    // });

    // const response = await fetch(process.env.MAILCHIMP_API_ENDPOINT + '/users/ping')
    // console.log(response)

    res.status(200).json({ email: email })
}



