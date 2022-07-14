const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class EmailContact {
  constructor(data) {
    this.to = 'trabichetreparaciones@gmail.com';
    this.phone = data.phone;
    this.fullname = data.fullname;
    this.message = data.message;
    this.from = `Nova Technology <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Sendgrid
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    } else {
      return nodemailer.createTransport({
        // host: process.env.EMAIL_HOST,
        // port: process.env.EMAIL_PORT,
        // auth: {
        //   user: process.env.EMAIL_USERNAME,
        //   pass: process.env.EMAIL_PASSWORD,
        // },
        host: 'smtp.mailtrap.io',
        port: 2525,
        auth: {
          user: '5bd15bd76859d7',
          pass: '27fa67a062f87b',
        },
      });
    }
  }

  // Send the actual email
  async send(template, subject) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      fullname: this.fullname,
      phone: this.phone,
      subject,
    });

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendContact() {
    await this.send('contact', this.message);
  }
};
