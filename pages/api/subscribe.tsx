export default function handler(req, res) {

    if (req.method !== 'POST') {
        res.status(400).send({ message: 'Only POST requests allowed' })
        return
    }

    // const mailchimp = require('@mailchimp/mailchimp_marketing');

    // mailchimp.setConfig({
    //     apiKey: 'YOUR_API_KEY',
    //     server: 'us14'
    // });

    // const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY
    // res.status(200).json({ name: MAILCHIMP_API_KEY })
    res.status(200).json({ name: "MAILCHIMP_API_KEY" })
}