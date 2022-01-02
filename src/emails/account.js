const sgMail = require('@sendgrid/mail')
//const sendgidAPIKey = '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'
sgMail.setApiKey(process.env.SEND_GRIDE_KEY)
/*
sgMail.send({
    to: 'bassantnasser31@gmail.com',
    from:'bassantnasser31@gmail.com',
    subject:'Thanks for joining in!',
    text:`Welcome to the app Let me know how you get along with the app`

})*/

//process.env.SEND_GRIDE_KEY
const sendWelcomeEmail = (email,name)=>{
    sgMail.send({
    to: email,
    from:'bassantnasser31@gmail.com',
    subject:'Thanks for joining in!',
    text:`Welcome to the app ${name}Let me know how you get along with the app`

})
}

const sendCancelEmail = (email,name)=>{
    sgMail.send({
    to: email,
    from:'bassantnasser31@gmail.com',
    subject:'Thanks for joining in!',
    text:`Hi ${name}Let me know why you canceled your account`

})}
module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}