var callSendAPI = require('./callSendAPI');

function sendTwoDayMessage(recipientId, twoDay, cwbUrl) {
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
            title: twoDay[0].fTime,
            subtitle: twoDay[0].fTemp + '℃\n' + twoDay[0].fCondition + '\n' + twoDay[0].fFeel + '\n降雨機率: ' + twoDay[0].fRain + '\n',
            // item_url: "https://www.oculus.com/en-us/rift/",
            image_url: twoDay[0].fImgUrl,
          }, {
            title: twoDay[1].fTime,
            subtitle: twoDay[1].fTemp + '℃\n' + twoDay[1].fCondition + '\n' + twoDay[1].fFeel + '\n降雨機率: ' + twoDay[1].fRain + '\n',
            // item_url: "https://www.oculus.com/en-us/rift/",
            image_url: twoDay[1].fImgUrl,
          }, {
            title: twoDay[2].fTime,
            subtitle: twoDay[2].fTemp + '℃\n' + twoDay[2].fCondition + '\n' + twoDay[2].fFeel + '\n降雨機率: ' + twoDay[2].fRain + '\n',
            // item_url: "https://www.oculus.com/en-us/rift/",
            image_url: twoDay[2].fImgUrl,
            buttons: [{
              type: "web_url",
              url: cwbUrl,
              title: "連結至中央氣象局"
            }],
          }]
        }
      }
    }
  };

  callSendAPI(messageData);
}

module.exports = sendTwoDayMessage;
