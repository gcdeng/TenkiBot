var sendTextMessage = require('../sendMessage/sendTextMessage');
/*
* Postback Event
*
* This event is called when a postback is tapped on a Structured Message.
* https://developers.facebook.com/docs/messenger-platform/webhook-reference/postback-received
*
*/
function receivedPostback(event) {
  console.log(event);
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfPostback = event.timestamp;

  // The 'payload' param is a developer-defined field which is set in a postback
  // button for Structured Messages.
  var payload = event.postback.payload;

  console.log("Received postback for user %d and page %d with payload '%s' " +
    "at %d", senderID, recipientID, payload, timeOfPostback);

  // When a postback is called, we'll send a message back to the sender to
  // let them know it was successful
  switch (payload) {
    case "How_to_use":
    var intro = "嗨!我是TenkiBot☀☁☔\n\n查詢今明預報:\n?縣市名稱\n\n查詢一週預報:\n!縣市名稱\n\n訂閱(自動定時推播天氣資訊):\n@縣市名稱\n\n移除訂閱:\n#縣市名稱\n\n將城市加入最愛(方便查詢):\n+縣市名稱\n\n移除最愛:\n-縣市名稱";
    sendTextMessage(senderID, intro);
    break;

    case "Subscription":
    var intro = "請設定自動推播時間(ex:7:00, 22:10):"
    sendTextMessage(senderID, intro);
    break;

    case "Favorite":
    sendTextMessage(senderID, "Favorite");
    break;

    default:
    
  }
}

module.exports = receivedPostback;
