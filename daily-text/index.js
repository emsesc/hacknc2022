module.exports = async function (context, myTimer, inputDocument) {
    var timeStamp = new Date().toISOString();

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);

    client.messages
        .create({
            body: 'Hi! This is a test text message.',
            from: '+15094368747',
            to: '+19842898942'
        })
        .then(message => console.log(message.sid));
    
    context.log('JavaScript timer trigger function ran!', timeStamp);
};