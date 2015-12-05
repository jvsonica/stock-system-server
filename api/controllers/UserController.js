/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

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

