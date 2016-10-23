var request = require('request');

function setGreeting(){
  var message = {
    "setting_type":"greeting",
    "greeting":{
      "text":"TenkiBot是一個天氣小幫手，可以提供您天氣預報查詢以及定時推播最新天氣狀況!"
    }
  }

  request({
    uri: 'https://graph.facebook.com/v2.6/me/thread_settings',
    qs: { access_token: 'EAAYAMXGDQX0BAHlFyCF9hJSzV2UyFPcvfKC85cZA9p2RxIlHH82QOpvd1iXKldUyfbPHLc8DEIYVZA9chygA3iqmNZCGuCu822ZBF8pbo4dZCSZCVHRW2xp1GW6ITGT1o9w8ZBtbUvOWp74lU7O2sJqMZB1iqxDEKWxk9UllJcQXNwZDZD' },
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
