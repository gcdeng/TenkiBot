var sendTextMessage = require('../sendMessage/sendTextMessage');
var WeatherCrawler = require('../searchWeather/WeatherCrawler');
var regularCityName = require('../searchWeather/regularCityName');
var schedule = require('node-schedule');
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

    switch (quickReplyPayload) {
      case 'favorite_quick_reply':
      var cityName = regularCityName(messageText);
      var weather = new WeatherCrawler(senderID, cityName);
      weather.sendTwoDay();
      break;

      case 'remove_favorite':
      db.collection('favorite').deleteOne({'senderID': senderID, 'cityName': messageText}, (err, res)=>{
        if (err) {
          return console.log('\nremove favorite error');
        } else {
          console.log('\nsuccessfully removed favorite: '+ res);
          sendTextMessage(senderID, messageText+'已移除');
        }
      });
      break;

      default:

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
          return;
        } else {
          console.log('\nfavorite saved to db: '+res);
        }
      });
      sendTextMessage(senderID, '已將'+city+'加入最愛, 之後就可以從"我的最愛"選單中快速查詢囉!');
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
          return console.log('\nremove favorite from db error');
        } else {
          console.log('\nsuccessfully removed favorite: '+ res);
          sendTextMessage(senderID, city+'已移除');
        }
      });
      break;

      case '#':
      case '＃':
      // add subscribe
      // parse city name
      var indexOfSpace = messageText.indexOf(' ');
      var city = messageText.substr(1, indexOfSpace-1);
      // console.log(city);
      var cityName = regularCityName(city);
      if (cityName===undefined) {
        sendTextMessage(senderID, "縣市名稱打錯囉");
        return;
      }
      // parse subscription time
      var subTime = messageText.substr(indexOfSpace+1);
      var indexOfSemicolon = subTime.indexOf(':');
      // console.log(subTime.length);
      // console.log(indexOfSemicolon);
      if (indexOfSemicolon!=-1) {
        var hour = subTime.substr(0, indexOfSemicolon);
      }
      else if (subTime.length===3) {
        var hour = subTime.substr(0, 1);
      }
      else if (subTime.length===4){
        var hour = subTime.substr(0, 2);
      }
      var minute = subTime.substr(-2);
      if (hour.charAt(0)=='0') {
        hour = hour.substr(1);
      }
      if (minute.charAt(0)=='0') {
        minute = minute.substr(1);
      }
      console.log('scheduleJob: \nhour: '+hour+'\nminute: '+minute);
      // scheduleJob
      var subJob = schedule.scheduleJob(senderID, '0 '+minute+' '+hour+' * * *', ()=>{
        console.log('\n***scheduleJob***');
        var weather = new WeatherCrawler(senderID, cityName);
        weather.sendTwoDay();
      });

      db.collection('subscription').save({'senderID': senderID, 'cityName': city, 'hour': hour, 'minute': minute}, (err, res)=>{
        if(err){
          console.log('\n[db error]subscription save');
          return;
        } else {
          console.log('\nsuccessfully saved subscription to db');
          // console.log(res);
        }
      });

      sendTextMessage(senderID, '將會固定在每天'+hour+'點'+minute+'分傳送'+city+'的最新天氣資訊給您! =)');
      break;

      case '@':
      case '＠':
      // remove subscribe

      db.collection('subscription').deleteMany({senderID: senderID}, (err, res)=>{
        if(err) return console.log('\nremove subscription error');
        console.log('\nremoved subscription '+res);
      });
      var remove_scheduleJob = schedule.scheduledJobs[senderID];
      try {
        remove_scheduleJob.cancel();
      } catch (e) {
        console.log('schedule have canceled');
      }
      sendTextMessage(senderID, '已幫您取消訂閱');
      break;

      default:
      sendTextMessage(senderID, '記得開頭要先打上功能的關鍵字喔!');
    }
  }
}

module.exports = receivedMessage;
