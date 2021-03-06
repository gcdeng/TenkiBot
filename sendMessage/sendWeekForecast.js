var callSendAPI = require('./callSendAPI');

function sendTwoDayMessage(recipientId, cityName, wfDay, cwbUrl) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            // 1
            {
              title: cityName+' '+wfDay[0].wfDate+' '+wfDay[0].wfDoW,
              subtitle: wfDay[0].wfTemp+'℃\n'+wfDay[0].wfCondition,
              image_url: wfDay[0].wfImgUrl
            },
            // 2
            {
              title: cityName+' '+wfDay[1].wfDate+' '+wfDay[1].wfDoW,
              subtitle: wfDay[1].wfTemp+'℃\n'+wfDay[1].wfCondition,
              image_url: wfDay[1].wfImgUrl
            },
            // 3
            {
              title: cityName+' '+wfDay[2].wfDate+' '+wfDay[2].wfDoW,
              subtitle: wfDay[2].wfTemp+'℃\n'+wfDay[2].wfCondition,
              image_url: wfDay[2].wfImgUrl
            },
            // 4
            {
              title: cityName+' '+wfDay[3].wfDate+' '+wfDay[3].wfDoW,
              subtitle: wfDay[3].wfTemp+'℃\n'+wfDay[3].wfCondition,
              image_url: wfDay[3].wfImgUrl
            },
            // 5
            {
              title: cityName+' '+wfDay[4].wfDate+' '+wfDay[4].wfDoW,
              subtitle: wfDay[4].wfTemp+'℃\n'+wfDay[4].wfCondition,
              image_url: wfDay[4].wfImgUrl
            },
            // 6
            {
              title: cityName+' '+wfDay[5].wfDate+' '+wfDay[5].wfDoW,
              subtitle: wfDay[5].wfTemp+'℃\n'+wfDay[5].wfCondition,
              image_url: wfDay[5].wfImgUrl
            },
            // 7
            {
              title: cityName+' '+wfDay[6].wfDate+' '+wfDay[6].wfDoW,
              subtitle: wfDay[6].wfTemp+'℃\n'+wfDay[6].wfCondition,
              image_url: wfDay[6].wfImgUrl,
              buttons: [{
                type: "web_url",
                url: cwbUrl,
                title: "連結至中央氣象局"
              }],
            }
          ]
        }
      }
    }
  };

  callSendAPI(messageData);
}

module.exports = sendTwoDayMessage;
