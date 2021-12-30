const sgMail = require('@sendgrid/mail')
const sendgidAPIKey = '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'
sgMail.setApiKey(sendgidAPIKey)
sgMail.send({
    to:'bassantnasser31@gmail.com',
    from:'bassantnasser31@gmail.com',
    subject:'THIS MY TEST SENGRID MAIL',
    text:'WELCOME WELCOME YA A5oYAAAA'
})