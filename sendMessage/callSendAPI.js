var request = require('request');
var config = require('config');
// Generate a page access token for your page from the App Dashboard
const PAGE_ACCESS_TOKEN = (process.env.MESSENGER_PAGE_ACCESS_TOKEN) ? (process.env.MESSENGER_PAGE_ACCESS_TOKEN) : config.get('pageAccessToken');


 /*
  * Call the Send API. The message data goes in the body. If successful, we'll
  * get the message id in a response
  *
  */
function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      if (messageId) {
        console.log("\nSuccessfully sent message with id %s to recipient %s",
          messageId, recipientId);
      } else {
        console.log("\nSuccessfully called Send API for recipient %s",
        recipientId);
      }
    } else {
      console.error("\nFailed calling Send API", response.statusCode, response.statusMessage, body.error);
    }
  });
}

module.exports = callSendAPI;
