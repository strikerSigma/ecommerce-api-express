const nodemailer = require('nodemailer');
const {google} = require('googleapis')


const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID,process.env.CLIENT_SECRET,process.env.REDIRECT_URI);
oAuth2Client.setCredentials({refresh_token: process.env.REFRESH_TOKEN})



const sendMail = async(recipetent, subject, text)=>{

  try{
    const accessToken = await oAuth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'ibrahimkhudai03@gmail.com',
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken
      }
    })
    const mailOptions = {
      from: "ibrahimkhudai03@gmail.com",
      to: recipetent,
      subject,
      text
    }
    const result = await transport.sendMail(mailOptions);
    return result;
  }
  catch (e) { return e }

}
module.exports = sendMail;

