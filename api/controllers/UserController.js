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

    list : function(req,res){
      sails.models.user.find().then(function(result){
          return res.ok(result);
      }).catch(function(err){
          return res.badRequest(err);
      })
    }

};

