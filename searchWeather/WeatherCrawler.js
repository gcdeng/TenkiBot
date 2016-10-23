var request = require("request");
var cheerio = require("cheerio");
var sendTextMessage = require('../sendMessage/sendTextMessage');
var sendTwoDayMessage = require('../sendMessage/sendTwoDayMessage');
var sendWeekForecast = require('../sendMessage/sendWeekForecast');

var WeatherCrawler = function (senderID, city) {
  this.city = city;
  this.senderID = senderID;

  this.sendTwoDay = function(){
    var senderID = this.senderID;
    var cityName = this.city;
    var cwbUrl = 'http://www.cwb.gov.tw/V7/forecast/taiwan/'+cityName+'.htm';
    request({
      url: cwbUrl,
      method: "GET"
    }, function (e, r, b) {
      if (e || !b) return "cheerio error";
      var $ = cheerio.load(b);
      var twoDay = [];
      var twoDayforecastTh = $('table.FcstBoxTable01 thead th');
      var cityName = twoDayforecastTh[0].children[0].data;
      var twoDayforecastTr = $('table.FcstBoxTable01 tbody tr');
      for (var i = 0; i < twoDayforecastTr.length; i++) {
        fTime = twoDayforecastTr[i].children[1].children[0].data;
        fTemp = twoDayforecastTr[i].children[3].children[0].data;
        fCondition = twoDayforecastTr[i].children[5].children[1].attribs.title;
        fImg = twoDayforecastTr[i].children[5].children[1].attribs.src;
        fImgUrl = "http://www.cwb.gov.tw/V7"+fImg.substr(5);
        // console.log(fImgUrl);
        fFeel = twoDayforecastTr[i].children[7].children[0].data;
        fRain = twoDayforecastTr[i].children[9].children[0].data;
        twoDay[i] = {'fTime': fTime, 'fTemp': fTemp, 'fCondition': fCondition, 'fImgUrl': fImgUrl, 'fFeel': fFeel, 'fRain': fRain}
      }
      sendTwoDayMessage(senderID, cityName, twoDay, cwbUrl);
    });
  }

  this.sendWeekly = function(){
    var senderID = this.senderID;
    var cwbUrl = 'http://www.cwb.gov.tw/V7/forecast/taiwan/'+this.city+'.htm';
    var cwbWeekUrl = 'http://www.cwb.gov.tw/V7/forecast/taiwan/inc/city/'+this.city+'.htm';
    request({
      url: cwbWeekUrl,
      method: "GET"
    }, function(e, r, b){
      if (e || !b) return "cheerio error";
      var $ = cheerio.load(b);
      var wfDay = [];
      var wfNight = [];
      var weekForecastThead = $('table.FcstBoxTable01 thead tr th');
      // console.log(weekForecastThead[0].children[0].data);
      var cityName = weekForecastThead[0].children[0].data;
      var weekForecastTbody = $('table.FcstBoxTable01 tbody tr td');
      // var weekForecastTbody2 = $('table.FcstBoxTable01 tbody td');
      // console.log(weekForecastTbody2.children()[13]);
      for (var i = 0; i < 7; i++) {
        var j = i+1;
        wfDate = weekForecastThead[j].children[0].data;
        wfDoW = weekForecastThead[j].children[2].data;
        if (wfDoW === undefined) wfDoW = weekForecastThead[j].children[2].children[0].data;
        wfImg = weekForecastTbody[i].children[1].attribs.src;
        wfImgUrl = "http://www.cwb.gov.tw/V7"+wfImg.substr(5);
        wfCondition = weekForecastTbody[i].children[1].attribs.title;
        wfTemp = weekForecastTbody[i].children[3].data;
        wfTemp = wfTemp.trim();

        wfDay[i] = {'wfDate': wfDate, 'wfDoW': wfDoW, 'wfImgUrl': wfImgUrl, 'wfCondition': wfCondition, 'wfTemp': wfTemp}
      }
      // console.log(wfDay);
      sendWeekForecast(senderID, cityName, wfDay, cwbUrl);
    });
  }
}

// WeatherCrawler.prototype
// var weather = new WeatherCrawler(123, 'Taipei_City');
// weather.sendWeekly();

module.exports = WeatherCrawler;
