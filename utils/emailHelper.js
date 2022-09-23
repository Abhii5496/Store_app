const nodemailer = require('nodemailer');


const mailHelper = async(option) => {

    const transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        },
      });
    
      const message = {
        from: 'deadshot5496@gmail.com', // sender address
        to: option.email ,// list of receivers
        subject: option.subject, // Subject line
        text: option.message, // plain text body
      }
      // send mail with defined transport object
       await transporter.sendMail(message);
    
     
    
}

module.exports = mailHelper