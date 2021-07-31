
// Twilio Account SID and Auth Token 
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
     body: 'Testing messages working',
     from: '+18727136450',
     to: '+13476343039'
   })
  .then(message => console.log(message.sid));