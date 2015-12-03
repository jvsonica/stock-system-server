/**
 * Created by cteixeira on 03-12-2015.
 */
var yahoo = require('yahoo-finance');
var Promise = require('bluebird');
var Log = require('log');
var log = new Log('info');

module.exports = function(){
    console.log("------------------------------START-------------------------------");
    console.log("--------------"+(new Date).toString()+"-------------");
    console.log("------------------------------------------------------------------");
    sails.models.stock.find()
        .then(function(stcks){
            log.info("Fetching Stocks %s found ", stcks.length);
            var stocks =
                _.map(stcks,function(elem){
                    if (elem.name)
                        return elem.name;
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
               return val.name;
            });
            if(cleanedResults.length != result.length){
                log.critical("Invalid Symbols Found: %s", _.unique(_.map(_.where(result,{name : null}),'symbol')));
            }
            _.each(cleanedResults,function(val){
                log.info("Information for stock %s (%s) : Price: %s",val.name,val.symbol,val.lastTradePriceOnly)
            });
        }).catch(function(err){
            log.error("Error %s",err);
        }).finally(function(){
            console.log("------------------------------------------------------------------");
            console.log("--------------"+(new Date).toString()+"-------------");
            console.log("-------------------------------END--------------------------------\n\n");

        });
};