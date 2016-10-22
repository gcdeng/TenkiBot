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
function receivedMessage(event, db, callback) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  console.log("\nReceived message for user %d and page %d at %d with message:",
  senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));

  var isEcho = message.is_echo;
  var messageId = message.mid;
  var appId = message.app_id;
  var metadata = message.metadata;

  // You may get a text or attachment but not both
  var messageText = message.text;
  var messageAttachments = message.attachments;
  var quickReply = message.quick_reply;

  if (isEcho) {
    // Just logging message echoes to console
    console.log("\nReceived echo for message %s and app %d with metadata %s",
      messageId, appId, metadata);
    return;
  } else if (quickReply) {
    var quickReplyPayload = quickReply.payload;
    console.log("\nQuick reply for message %s with payload %s",
      messageId, quickReplyPayload);

    if (quickReplyPayload==='favorite_quick_reply'){
      var cityName = regularCityName(messageText);
      var weather = new WeatherCrawler(senderID, cityName);
      weather.sendTwoDay();
    } else if (quickReplyPayload==='remove_favorite') {
      db.collection('favorite').deleteOne({'senderID': senderID, 'cityName': messageText}, (err, res)=>{
        if (err) {
          return console.log('\nremove favorite error');
        } else {
          console.log('\nsuccessfully removed favorite: '+ res);
          sendTextMessage(senderID, messageText+'已移除');
        }
      });
    }

    // sendTextMessage(senderID, "Quick reply tapped");
    return;
  }

  if (messageText) {
    //  handle message here
    switch (messageText[0]) {
      case '?':
      case '？':
      // search two day forecast
      var cityName = regularCityName(messageText.substr(1));
      if (cityName===undefined) {
        sendTextMessage(senderID, "縣市名稱打錯囉");
      } else {
        var weather = new WeatherCrawler(senderID, cityName);
        weather.sendTwoDay();
      }
      break;

      case '!':
      case '！':
      // search week forecast
      var cityName = regularCityName(messageText.substr(1));
      if (cityName===undefined) {
        sendTextMessage(senderID, "縣市名稱打錯囉");
      } else {
        var weather = new WeatherCrawler(senderID, cityName);
        weather.sendWeekly();
      }
      break;

      case '+':
      case '＋':
      // add favorite
      var city = messageText.substr(1);
      var cityName = regularCityName(city);
      if (cityName===undefined) {
        sendTextMessage(senderID, "縣市名稱打錯囉");
        return;
      }
      db.collection('favorite').save({'senderID': senderID, 'cityName': city}, (err, res)=>{
        if (err) {
          console.log('\nfavorite save to db error: '+err);
        } else {
          console.log('\nfavorite saved to db: '+res);
        }
      });
      sendTextMessage(senderID, '已將'+city+'加入最愛, 之後就可以從"我的最愛"選單中快速查詢囉');
      callback();
      break;

      case '-':
      case '－':
      // remove favorite
      var city = messageText.substr(1);
      var cityName = regularCityName(city);
      if (cityName===undefined) {
        sendTextMessage(senderID, "縣市名稱打錯囉");
        return;
      }
      db.collection('favorite').deleteOne({'senderID': senderID, 'cityName': city}, (err, res)=>{
        if (err) {
          return console.log('\nremove favorite error');
        } else {
          console.log('\nsuccessfully removed favorite: '+ res);
          sendTextMessage(senderID, city+'已移除');
        }
      });
      break;

      case '@':
      case '＠':
      // add subscribe
      break;

      case '#':
      case '＃':
      // remove subscribe
      break;

      default:
      sendTextMessage(senderID, '要先打上功能的關鍵字喔!');
    }
  }
}

module.exports = receivedMessage;
