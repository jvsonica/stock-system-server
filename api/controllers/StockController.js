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
        var yStock;
        // Fetch stock first to get stock name from symbol
        yahoo.snapshot({
            symbol: req.allParams()['symbol'],
            fields: ['s', 'n', 'd1', 'l1', 'y', 'r']
        })
            .then(function(result){
                yStock = result;
                var params = req.allParams();
                params.name = result.name;
                return sails.models.stock.create(params)
            })
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
                stock.price = yStock.lastTradePriceOnly;
                res.ok(stock);
            })
            .catch(function(err){
                res.badRequest(err)
            });
    },
    index : function(req,res){
        return sails.models.stock.find().then(function(result){
            res.send(result);
        });
    },
    patch: function(req,res){
        var result;
        sails.models.stock
            .findOne({id:req.allParams().id})
            .then(function(stock){
                var nStock = _.assign(stock, req.allParams());
                result = nStock;
            })
            .then(function(){
                return yahoo.snapshot({
                    symbol: result.symbol,
                    fields: ['s', 'n', 'd1', 'l1', 'y', 'r']
                })
            })
            .then(function(stk){
                result.name = stk.name;
                result.save();
            })
            .then(function(){
                return sails.models.stock.findOne({id:req.allParams().id})
            })
            .then(function(stock){
                console.log("HERE");
                console.log()
                return res.ok(stock);
            })
            .catch(function(err){
                return res.badRequest(err);
            });
    },

    run : function(req,res){
        require('cron/fetchStocks.js')().then(function(){
            res.ok("OK");
        })
    },

    currentPrice: function(req,res){
        yahoo.snapshot({
            symbol: req.allParams().symbol,
            fields: ['s', 'n', 'd1', 'l1', 'y', 'r']
        })
        .then(function(result){
            res.send(result);
        })
        .catch(function(err){
            res.badRequest(err);
        })
    }

};

