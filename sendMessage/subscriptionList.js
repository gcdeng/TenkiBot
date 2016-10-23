var callSendAPI = require('./callSendAPI');

function subscriptionList(recipientId, subCitys) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: subCitys
        }
      }
    }
  };

  callSendAPI(messageData);
}

module.exports = subscriptionList;
