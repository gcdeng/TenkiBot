var request = require("request");
var cheerio = require("cheerio");
var sendTextMessage = require('../sendMessage/sendTextMessage');
var sendTwoDayMessage = require('../sendMessage/sendTwoDayMessage');

var WeatherCrawler = function (senderID, city) {
  this.city = city;
  this.senderID = senderID;

  this.sendTwoDay = function(){
    var senderID = this.senderID;
    var cwbUrl = 'http://www.cwb.gov.tw/V7/forecast/taiwan/'+this.city+'.htm';
    request({
      url: cwbUrl,
      method: "GET"
    }, function (e, r, b) {
      if (e || !b) return "cheerio error";
      var $ = cheerio.load(b);
      var twoDay = [];
      var twoDayforecastTr = $('table.FcstBoxTable01 tbody tr');
      for (var i = 0; i < twoDayforecastTr.length; i++) {
        fTime = twoDayforecastTr[i].children[1].children[0].data;
        fTemp = twoDayforecastTr[i].children[3].children[0].data;
        fCondition = twoDayforecastTr[i].children[5].children[1].attribs.title;
        fImg = twoDayforecastTr[i].children[5].children[1].attribs.src;
        fImgUrl = "http://www.cwb.gov.tw/V7"+fImg.substr(5);
        console.log(fImgUrl);
        fFeel = twoDayforecastTr[i].children[7].children[0].data;
        fRain = twoDayforecastTr[i].children[9].children[0].data;
        twoDay[i] = {'fTime': fTime, 'fTemp': fTemp, 'fCondition': fCondition, 'fImgUrl': fImgUrl, 'fFeel': fFeel, 'fRain': fRain}
      }
      sendTwoDayMessage(senderID, twoDay, cwbUrl);

    });
  }
}

// WeatherCrawler.prototype
// var weather = new WeatherCrawler(123, 'Taipei_City');
// weather.sendTwoDay();

module.exports = WeatherCrawler;
