/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var wns = require('wns');
var Promise = require('bluebird');
var yahoo = require('yahoo-finance');

module.exports = {
  create: function(req,res){
    sails.models.user
      .create(req.allParams())
      .then(function(result){
        return res.ok(result);
      })
      .catch(function(err){
        return res.badRequest(err);
      });
  },

  signIn: function(req,res){
    var user;
    sails.models.user
      .findOne( {uri : req.allParams().uri })
      .populate("stocks")
      .then(function(result){
        if(result){
          user = result;
          return result;
        }
        else{
          return sails.models.user
            .create(req.allParams())
        }
      })
      .then(function(result){
        return Promise.map(result.stocks,function(val){
          return yahoo.snapshot({
            symbol: val.symbol,
            fields: ['s', 'n', 'd1', 'l1', 'y', 'r']
          })
        }).then(function(stocks){
          return {
            user:result,
            stocks:stocks
          }
        });
      })
      .then(function(result){
          _.each(result.user.stocks,function(stock){
            stock.price = _.find(result.stocks,function(stk){
              return stk.symbol == stock.symbol;
            }).lastTradePriceOnly;
          });
          return res.ok(result.user);
      })
      .catch(function(err){
        return res.badRequest(err);
      });
  },

  pushTest: function(req,res){
    var channel = req.query.uri;

    var options = {
      client_id: 'ms-app://s-1-15-2-862795636-3197699687-3641335729-4195230973-2611241766-1869636758-2860474146',
      client_secret: 'hX1y67+ZuOxf/QLNO0z0rqLW4cA6q718'
    };

    wns.sendTileSquareBlock(channel, 'Yes!', 'It worked!', options, function (error, result) {
      if (error){
        return res.ok(error);
      }
      else{
        return res.ok(result);
      }
    });
  },

  list : function(req,res){
    sails.models.user.find()
      .populate("stocks")
      .then(function(result){
        return res.ok(result);
      }).catch(function(err){
        return res.badRequest(err);
      })
  }

};

