const nodemailer = require('nodemailer');

const senEmail = async (options) => {
  // 1) create a transporter
  var transport = nodemailer.createTransport({
    // store them to .env
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '5bd15bd76859d7',
      pass: '27fa67a062f87b',
    },
  });

  //2) define the email options
  const mailOptions = {
    from: 'JHMesseroux <jhmesseroux@jhm.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html :
  };

  //3) actually send the email
  await transport.sendMail(mailOptions);
};

module.exports = senEmail;
