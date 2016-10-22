var request = require('request');
var config = require('config');
// Generate a page access token for your page from the App Dashboard
const PAGE_ACCESS_TOKEN = (process.env.MESSENGER_PAGE_ACCESS_TOKEN) ? (process.env.MESSENGER_PAGE_ACCESS_TOKEN) : config.get('pageAccessToken');

function setPersistentMenu(){
  var message = {
    "setting_type" : "call_to_actions",
    "thread_state" : "existing_thread",
    "call_to_actions":[
      {
        "type":"postback",
        "title":"使用說明",
        "payload":"How_to_use"
      },
      {
        "type":"postback",
        "title":"訂閱",
        "payload":"Subscription"
      },
      {
        "type":"postback",
        "title":"我的最愛",
        "payload":"Favorite"
      },
      {
        "type":"postback",
        "title":"移除最愛",
        "payload":"remove_favorite"
      }
    ]
  }

  request({
    uri: 'https://graph.facebook.com/v2.6/me/thread_settings',
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: message
  }, (err, res, body)=>{
    if (!err && res.statusCode==200) {
      console.log(res);
    } else {
      console.log(err);
    }
  });
}

setPersistentMenu();
