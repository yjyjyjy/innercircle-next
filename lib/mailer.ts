// this is the e-post office of the app
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export type Email = {
   to: string
   from?: string
   subject: string
   html: string
}

export const mailer = async (msg: Email) => {
   msg.from = msg.from || 'notification@innercircle.ooo'

   // To protect the customer's email list from accidental emails by developers, all emails will be sent to the test inbox if not in production environment.
   if (!process.env.CURRENT_ENV || process.env.CURRENT_ENV !== 'production') {
      //'localhost', 'preview', 'development'
      console.log(
         '📪 📨 Dev environment email re-routing. Original destination 📪 📨: ',
         msg.to
      )
      msg.to = 'innerCircleEmailTest@gmail.com'
   }

   const response = await sgMail.send(msg)
   console.log('-----------------------------')
   console.log(typeof response[0])
   console.log(response[0].statusCode)
   return response[0]
}
