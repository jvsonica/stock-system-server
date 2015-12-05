/**
 * Created by cteixeira on 03-12-2015.
 */
var yahoo = require('yahoo-finance');
var Promise = require('bluebird');
var Log = require('log');
var colors = require('colors');
var log = new Log('info');
var running = false;
module.exports = function(){
    if(running) return;
    running = true;
    var results = [];
    console.log("------------------------------START-------------------------------".green);
    console.log("--------------".green+(new Date).toString().green+"-------------".green);
    console.log("------------------------------------------------------------------".green);
    sails.models.stock
        .find()
        .then(function(stcks){
            log.info("Fetching Stocks %s found ", stcks.length);
            var stocks =
                _.map(stcks,function(elem){
                    if (elem.symbol)
                        return elem.symbol;
                    return null;
                });
            stocks = _.filter(stocks,function(elem){
                return elem;
            });
            stocks = _.unique(stocks);
            log.info("Fetching Stocks. %s after cleaning",stocks.length);
            return Promise.all(_.map(stocks,function(value){
                log.info('Fetching Data for stock: %s',value);
                return yahoo.snapshot({
                    symbol: value,
                    fields: ['s', 'n', 'd1', 'l1', 'y', 'r']
                });
            }));

        })
        .then(function(result){
            var cleanedResults = _.filter(result,function(val){
               return val.symbol;
            });
            if(cleanedResults.length != result.length){
                log.critical("Invalid Symbols Found: %s".red, _.unique(_.map(_.where(result,{symbol : null}),'symbol')));
            }
            _.each(cleanedResults,function(val){
                log.info("Information for stock %s (%s) : Price: %s",val.symbol,val.symbol,val.lastTradePriceOnly)
            });
            results = cleanedResults;
            return sails.models.user.find();
        })
        .then(function(users){
            return Promise.all(_.map(users,function(){
               //make the calls to  the microsoft service if the stocks are ...
               //return the promise
            }));
        })
        .then(function(){
            // It's all done , if you want you can add functionality
        })
        .catch(function(err){
            log.error("Error %s",err);
        })
        .finally(function(){
            running = false;
            console.log("------------------------------------------------------------------".green);
            console.log("--------------".green+(new Date).toString().green+"-------------".green);
            console.log("-------------------------------END--------------------------------\n\n".green);
        });
};
