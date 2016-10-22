var callSendAPI = require('./callSendAPI');

function qrFavorite(recipientId, faCitys, messageText){
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText,
      quick_replies: faCitys
    }
  }
  callSendAPI(messageData);
}

module.exports = qrFavorite;
