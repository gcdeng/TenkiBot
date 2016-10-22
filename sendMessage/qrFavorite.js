var callSendAPI = require('./callSendAPI');

function qrFavorite(recipientId, faCitys){
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: '想要查詢哪個城市的天氣呢?',
      quick_replies: faCitys
    }
  }
  callSendAPI(messageData);
}

module.exports = qrFavorite;
