/**
 *  Service that handles push notifications
 */

module.exports = function(){
  var wns = require('wns');
  var WNS = function(){};

  var options = {
    client_id: 'ms-app://s-1-15-2-862795636-3197699687-3641335729-4195230973-2611241766-1869636758-2860474146',
    client_secret: 'hX1y67+ZuOxf/QLNO0z0rqLW4cA6q718',
    accessToken : ""
  };

  WNS.prototype.sendToast = function(uri, text1, text2, cb){
    wns.sendToastText02(uri, text1, text2, options,
      function(err, result) {
        if (err) return cb(err, null);
        else {
          if (result.newAccessToken) options.accessToken = result.newAccessToken;
          cb(null,result);
        }
      });
  };

  WNS.prototype.sendTile = function(uri, text1, text2, cb){
    wns.sendTileSquareText02(uri, text1, text2, options,
      function (err, result) {
        if (err) return cb(err, null);
        else {
          if (result.newAccessToken) options.accessToken = result.newAccessToken;
          cb(null, result);
        }
      })
  };

  return new WNS();

}();
