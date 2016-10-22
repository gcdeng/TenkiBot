var request = require('request');

function setGreeting(){
  var message = {
    "setting_type":"greeting",
    "greeting":{
      "text":"TenkiBot是一個天氣小幫手，可以提供您即時天氣查詢以及定時推播最新天氣狀況!"
    }
  }

  request({
    uri: 'https://graph.facebook.com/v2.6/me/thread_settings',
    qs: { access_token: 'EAAYAMXGDQX0BAF64ZAa5ZACaQ64XVJ6O4PsS9oeL1h8XFYi6KXM30FyZBz2qhYKYTMxlNi4ipCuTZCdWWf5PBrNkWbqOKvlZAbnUcMHv2srhz1EycJmOyNE5XeXSAAAPP9DWnOEsJE8TQlDD46TbC0pxLMcmrthevJfFYUS46ZBgZDZD' },
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
