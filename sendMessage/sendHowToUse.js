var callSendAPI = require('./callSendAPI');

function sendHowToUse(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "TenkiBot提供最新天氣資訊☀☁☔",
            subtitle: "查詢今明預報:\n?縣市名稱\n\n查詢一週預報:\n!縣市名稱\n\n訂閱(自動定時推播天氣資訊):\n+縣市名稱\n\n將城市加入最愛(最多五項):\n*縣市名稱",
            // item_url: "https://www.oculus.com/en-us/rift/",
            image_url: '',
          }]
        }
      }
    }
  };

  callSendAPI(messageData);
}

module.exports = sendHowToUse;
