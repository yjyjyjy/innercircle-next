import prisma from '../../lib/prisma';

export default async function handler(req, res) {

    try {
        const response = await prisma.circle.findFirst()
        res.status(200).json({ response })
    } catch (error) {
        console.log("🚨")
    }
}



