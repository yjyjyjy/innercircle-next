import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'
import { getSession } from 'next-auth/react'
import { mailer } from '../../lib/mailer'
export default async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req })
    if (!session || !session.userID || !session.user?.email) {
        res.status(500).json({ message: 'Please log in first' })
        return
    }

    if (req.method === 'POST') {
        const res = await mailer({
            to: 'prowessyang@gmail.com', // Change to your recipient
            from: 'no-reply@innerCircle.ooo', // Change to your verified sender
            subject: 'Sending with SendGrid is Fun',
            html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        });
        console.log(res)
        console.log(res.statusCode)
    }
}


