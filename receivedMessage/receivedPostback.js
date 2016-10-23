var sendTextMessage = require('../sendMessage/sendTextMessage');
var qrFavorite = require('../sendMessage/qrFavorite');
var subscriptionList = require('../sendMessage/subscriptionList');
var schedule = require('node-schedule');
/*
* Postback Event
*
* This event is called when a postback is tapped on a Structured Message.
* https://developers.facebook.com/docs/messenger-platform/webhook-reference/postback-received
*
*/
function receivedPostback(event, db, callback) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfPostback = event.timestamp;

  // The 'payload' param is a developer-defined field which is set in a postback
  // button for Structured Messages.
  var payload = event.postback.payload;

  console.log("\nReceived postback for user %d and page %d with payload '%s'\n" +
    "at %d", senderID, recipientID, payload, timeOfPostback);

  // When a postback is called, we'll send a message back to the sender to
  // let them know it was successful
  switch (payload) {
    case "How_to_use":
    var intro = '嗨! =D 我是TenkiBot☀☁☔\n依照以下格式輸入訊息我可以幫您\n查詢今明天氣預報:\n?縣市名稱\n\n查詢一週天氣預報:\n!縣市名稱\n\n訂閱(定時自動推播天氣資訊):\n#縣市名稱 幾點幾分\n(ex: #台北 700 \nor #新竹 2330)\n\n移除所有訂閱請輸入"x"或按選單中的"取消訂閱"\n\n將城市加入最愛(方便查詢):\n+縣市名稱\n\n移除最愛:\n-縣市名稱\n(或按選單中的"移除最愛")';
    sendTextMessage(senderID, intro);
    break;

    case "Subscription":
    // var intro = "請設定自動推播時間(ex:7:00, 22:10):"
    var intro = 'p.s.訂閱方法說明: 輸入 #縣市名稱 幾點幾分\n(例如#台北 700 訂閱每天7點傳送台北天氣\nor #新竹 2330 每天23點30分傳送新竹天氣)';
    db.collection('subscription').find({'senderID': senderID}).toArray((err, res)=>{
      if(err) return console.log('\subscription find db error: %s\n'+err);
      if (res.length==0) {
        sendTextMessage(senderID, '您尚未開始訂閱\n'+intro);
        return;
      }
      var subCitys = [{
        "title": '您目前已訂閱:',
        "subtitle": '',
        "buttons": []
      }];
      for (var i = 0; i < res.length; i++) {
        subCitys[0]["buttons"].push({
          "type":"postback",
          "title": i+1+'. '+res[i].cityName+' '+(res[i].hour<10? '0':'')+res[i].hour+':'+(res[i].minute<10? '0':'')+res[i].minute,
          "payload":"remove_single_sub"
        })
      }
      subCitys[0]["buttons"].push({
        "type":"postback",
        "title":"取消全部訂閱",
        "payload":"remove_subscription"
      });
      subscriptionList(senderID, subCitys);
    });
    callback();
    break;

    case "Favorite":
    db.collection('favorite').find({'senderID': senderID}).toArray((err, res)=>{
      if(err) return console.log('\nfavorite find db error: %s\n'+err);
      if (res.length==0) {
        sendTextMessage(senderID, '還沒有城市被加入喔\n(使用"+縣市名稱"將常用的城市加入最愛可以更方便查詢!)');
        return;
      }
      var faCitys = [];
      for (var i = 0; i < res.length; i++) {
        faCitys[i] = {
          content_type: 'text',
          title: res[i].cityName,
          payload: 'favorite_quick_reply'
        }
      }
      var messageText = '想要查詢哪個城市的天氣呢?'
      qrFavorite(senderID, faCitys, messageText);
    });
    callback();
    break;

    case 'remove_favorite':
    db.collection('favorite').find({'senderID': senderID}).toArray((err, res)=>{
      if(err) return console.log('favorite find db error: %s\n'+err);
      if (res.length==0) {
        sendTextMessage(senderID, '還沒有城市被加入喔\n(使用"+縣市名稱"將常用的城市加入最愛可以更方便查詢!)');
        return;
      }
      var faCitys = [];
      for (var i = 0; i < res.length; i++) {
        faCitys[i] = {
          content_type: 'text',
          title: res[i].cityName,
          payload: 'remove_favorite'
        }
      }
      var messageText = '想要移除哪個呢?'
      qrFavorite(senderID, faCitys, messageText);
    });
    callback();
    break;

    case 'remove_subscription':
    var remove_scheduleJob = schedule.scheduledJobs[senderID];
    try {
      remove_scheduleJob.cancel();
    } catch (e) {
      console.log('\n***schedule have canceled');
    }
    db.collection('subscription').find({senderID: senderID}).toArray((err, res)=>{
      if(res.length>0){
        db.collection('subscription').deleteMany({senderID: senderID}, (err, res)=>{
          if(err) return console.log('\nremove subscription error');
          console.log('\nremoved subscription '+res);
          sendTextMessage(senderID, '已幫您取消訂閱');
          return;
        });
      } else {
        sendTextMessage(senderID, '您尚未開始訂閱');
        return;
      }
    });

    case 'remove_single_sub':
    break;

    default:
    // sendTextMessage(senderID, payload);
  }
}

module.exports = receivedPostback;
