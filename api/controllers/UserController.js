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

  pushTestToast: function(req,res){
    sails.models.user.findOne(req.params.id)
      .then(function(user){
        if(user){
          sails.services.wns.sendToast(user.uri,"Atenção","Notificação Stock",
            function(err,result){
              if(err) return res.badRequest(err);
              else return res.ok(result);
            });
        }
      })
      .catch(function(err){
        return res.badRequest(err);
      });
  },

  pushTestTile: function(req,res){
    sails.models.user.findOne(req.params.id)
      .then(function(user) {
        if (user) {
          sails.services.wns.sendTile(user.uri, "Nova Informação", "Stock com nova informação",
            function (err, result) {
              if(err) return res.badRequest(err);
              else return res.ok(result);
            });
        }
      })
      .catch(function(err){
        return res.badRequest(err);
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

