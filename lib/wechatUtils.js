var https = require('https');
var mongoose = require('mongoose');
var TokenModel = mongoose.model('WeChatToken');
var sha1 = require('sha1');
//存放到mongodb里面，如果过期，则重新获取
//var exports = {};

var getAccessToken = function (callback) {
    https.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxb14e210fe0f465ec&secret=69d25a9d2acdeb8b1a094a477c8d9b37', function (res) {
      var str="";
      res.on('data', function(chunk) {
        str += chunk;
      });
      res.on('end', function() {
        console.log("access_token:"+str);
        callback(eval("("+str+")"))
      });
    });
}

var getTicket = function (callback) {
    getAccessToken(function(resObj){
      https.get('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token='+resObj.access_token+'&type=jsapi', function (res) {
        var str="";
        res.on('data', function(chunk) {
          str += chunk;
        });
        res.on('end', function() {
          console.log("ticket:"+str);
          callback(eval("("+str+")"))
        });
      });
    });
}

exports.getSignature = function(callback, url,timestr){
  getTicket(function(resObj){
    var string = "jsapi_ticket="+resObj.ticket+"&noncestr=Wm3WZYTPz0wzccnWasdf&timestamp="+timestr+"&url="+url;
    callback(resObj);
  });
}

exports.getSignatureIfNotExist = function(callback, url, timestr){
  TokenModel.find({},function(err, tokens){
      /*if(tokens && tokens.length>0){
        console.log(tokens[0])
        callback(tokens[0]);
      }else{*/
        getTicket(function(resObj){
          //生成sha1签名
          var str = "jsapi_ticket="+resObj.ticket+"&noncestr=Wm3WZYTPz0wzccnWasdf&timestamp="+timestr+"&url="+url;
          var signature = sha1(str);
          //保存到数据库
          var token = new TokenModel(resObj);
          
          token.save(function(err, obj){
            console.log("保存成功")
          });
          callback(resObj, signature);
        });
      /*}*/
    })

  
}

/*exports.getSignature(function(obj){
  console.log(obj)
}, 'http://mp.weixin.qq.com?params=value');
*/