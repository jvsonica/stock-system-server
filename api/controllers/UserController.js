/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var wns = require('wns');

module.exports = {
  create: function(req,res){
    console.log(req.allParams());
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
    sails.models.user
      .findOne(req.allParams())
      .populate("stocks")
      .then(function(result){
        if(result){
          return res.ok(result)
        }
        else{
          sails.models.user
            .create(req.allParams())
            .then(function(result){
              return res.ok(result);
            })
            .catch(function(err){
              return res.badRequest(err);
            });
        }
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
        console.error(error);
        return res.ok(error);
      }
      else{
        console.log(result);
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

