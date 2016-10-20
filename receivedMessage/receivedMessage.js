var sendTextMessage = require('../sendMessage/sendTextMessage');
var WeatherCrawler = require('../searchWeather/WeatherCrawler');
var regularCityName = require('../searchWeather/regularCityName');
 /*
  * Message Event
  *
  * This event is called when a message is sent to your page. The 'message'
  * object format can vary depending on the kind of message that was received.
  * Read more at https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-received
  *
  * For this example, we're going to echo any text that we get. If we get some
  * special keywords ('button', 'generic', 'receipt'), then we'll send back
  * examples of those bubbles to illustrate the special message bubbles we've
  * created. If we receive a message with an attachment (image, video, audio),
  * then we'll simply confirm that we've received the attachment.
  *
  */
function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  console.log("Received message for user %d and page %d at %d with message:",
  senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));

  var messageId = message.mid;
  var messageText = message.text;

  if (messageText) {
   //  handle message here
    switch (messageText[0]) {
      case '?':
      case '？':
       var city = messageText.substr(1);
       var cityName = regularCityName(city);
       if (cityName=='undefined') {
         sendTextMessage(senderID, "縣市名稱錯誤");
       } else {
         var weather = new WeatherCrawler(senderID, cityName);
         weather.sendTwoDay();
       }

      break;

      case '+':
      break;

      default:
       sendTextMessage(senderID, messageText);
    }
  }
}

module.exports = receivedMessage;
