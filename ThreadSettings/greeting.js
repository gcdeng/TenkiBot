var request = require('request');
var config = require('config');
// Generate a page access token for your page from the App Dashboard
const PAGE_ACCESS_TOKEN = (process.env.MESSENGER_PAGE_ACCESS_TOKEN) ? (process.env.MESSENGER_PAGE_ACCESS_TOKEN) : config.get('pageAccessToken');

function setGreeting(){
  var message = {
    "setting_type":"greeting",
    "greeting":{
      "text":"TenkiBot是一個天氣小幫手，可以提供您天氣預報查詢以及定時推播最新天氣狀況!"
    }
  }

  request({
    uri: 'https://graph.facebook.com/v2.6/me/thread_settings',
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: message
  }, (err, res)=>{
    if (err) {
      console.log('\nset greeting text error: ' + JSON.stringify(err));
    } else {
      console.log('\n successfully set greeting text: ' + JSON.stringify(res));
    }
  });
}

setGreeting();
