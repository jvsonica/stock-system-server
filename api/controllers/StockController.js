/**
 * StockController
 *
 * @description :: Server-side logic for managing Stocks
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
'use strict';
var yahoo = require("yahoo-finance");

module.exports = {
    add : function(req,res){
        var stock;
        sails.models.stock
            .create(req.allParams())
            .then(function(stk){
                stock = stk;
                return sails.models.user
                    .findOne(req.allParams()['user'])
            })
            .then(function(usr){
                usr.stocks.add(stock);
                return usr.save();
            })
            .then(function(result){
                return yahoo.snapshot({
                    symbol: req.allParams()['name'],
                    fields: ['s', 'n', 'd1', 'l1', 'y', 'r']
                });
            })
            .then(function(result){
                res.ok(result);
            })
            .catch(function(err){
                res.badRequest(err)
            });
    },
    index : function(req,res){
        return sails.models.stock.find().then(function(result){
            res.send(result);
        });
        /*yahoo.snapshot({
            symbol: 'IBM',
            fields: ['a','b','b2','b3']
        }).then(function(snapshot){
            return res.send({
                result : snapshot
            });

        }).catch(function(err){
            return res.send({
                error: err
            });
        });*/
    }


};

