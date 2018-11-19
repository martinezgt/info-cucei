/**
 * @Author: schwarze_falke
 * @Date:   2018-10-26T21:22:38-05:00
 * @Last modified by:   schwarze_falke
 * @Last modified time: 2018-10-26T21:38:37-05:00
 */
const nodemailer = require('nodemailer');

class MailSender {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    this.mailOptions = {
      from: '"Cucei Ayuda" <cuceiayuda@gmail.com>',
    };
  }

  sendMail(options) {
    const mailOptions = {
      ...this.mailOptions,
      ...options,
    };
    this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      return true;
    });
  }
}

module.exports = new MailSender();
