var callSendAPI = require('./callSendAPI');
/*
 * Send a text message using the Send API.
 *
 */
function sendTextMessage(recipientId, messageText) {
 var messageData = {
   recipient: {
     id: recipientId
   },
   message: {
     text: messageText,
     metadata: "DEVELOPER_DEFINED_METADATA"
   }
 };

 callSendAPI(messageData);
}

module.exports = sendTextMessage;
