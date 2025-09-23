import nodemailer from 'nodemailer';

/*

we are using brevo
brevo is an email service provider that gives us smtp credentials (host, port, username, password) so thata we can plug into node mailer. 
*/

const transporter= nodemailer.createTransport({
   
    host: "smtp-relay.brevo.com",
    port:587,
    auth:{
        user: process.env.smtp_user,
        pass: process.env.smtp_password,
    }

});

export default transporter;

