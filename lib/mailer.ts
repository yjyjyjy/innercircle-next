const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

type Email =
    {
        to: string,
        from: string,
        subject: string,
        html: string
    }


export const mailer = (msg: Email) => {

    msg.from = msg.from || 'no-reply@innercircle.ooo'

    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
        })
        .catch((error) => {
            console.error(error)
        })
}



