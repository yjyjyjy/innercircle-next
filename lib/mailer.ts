const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

type Email =
    {
        to: string,
        from: string,
        subject: string,
        html: string
    }


export const mailer = async (msg: Email) => {

    msg.from = msg.from || 'no-reply@innercircle.ooo'
    if (!process.env.CURRENT_ENV || process.env.CURRENT_ENV !== 'production') { //'localhost', 'preview', 'development'
        msg.to = 'innerCircleEmailTest@gmail.com'
    }

    const response = await sgMail.send(msg)
    console.log('🚀')
    // .then(() => {
    //     console.log('Email sent')
    // })
    // .catch((error) => {
    //     console.error(error)
    // })
    return response[0]
}



