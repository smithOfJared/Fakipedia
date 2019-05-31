const sgMail = require('@sendgrid/mail');

module.exports = {
  initialize(){
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  },
  userEmail(email) {
    const msg = {
      to: email,
      from: 'smithofjared@yahoo.com',
      subject: 'Blocipedia test email',
      text: 'You are signed up now',
      html: '<strong>Blocipedia test email</strong>',
    };
    sgMail.send(msg);
    }
  };
