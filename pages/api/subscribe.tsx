import prisma from '../../lib/prisma';

export default async function handler(req, res) {

    if (req.method !== 'POST') {
        res.status(400).send({ error: 'Only POST requests allowed' })
        return
    }

    if (!req.body.email) {
        res.status(400).send({ error: 'Type in your email please' })
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
        res.status(200).json({ email: response.email })
        return

    } catch (error) {
        console.log("🚨")
        console.log(error)
        if (!!error.code && error.code === 'P2002') {
            // violated unique restriction
            res.status(409).json({ error: 'The email has already been subscribed.' })
            return
        }
        else {
            // catch all for all other errors
            res.status(400).json({ error: 'Something went wrong.' })
            return
        }
    }
}



