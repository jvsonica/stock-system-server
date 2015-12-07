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
  return sails.models.stock
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

      return sails.models.stock.find({
        symbol : results.map(function(val){return val.symbol;})
      }).populate("user");
    })
    .then(function(stocks){
      return Promise.all(_.map(stocks,function(stock){
        for(var i in results){
          if(results[i].symbol == stock.symbol && !!stock.notification){
            // Verificar Bounds
            if(results[i].lastTradePriceOnly > stock.upper){
              // Toast de Acima do Máximo
              log.info("Over Upper Bound Warning for stock "+ results[i].symbol + " for user " + stock.user.id + " who had upper bound set on " +  stock.upper);
              sails.services.wns.sendToast(stock.user.uri,
                "Limite superior excedido!",
                "Valor de "+ stock.symbol+" é agora " + results[i].lastTradePriceOnly,
                function(err,result){}
              );
            }
            else if(results[i].lastTradePriceOnly < stock.lower) {
              // Toast de Abaixo do Mínimo
              log.info("Below Lower Bound Warning for stock "+ results[i].symbol + " for user " + stock.user.id + " who had lower bound set on " +  stock.lower);
              sails.services.wns.sendToast(stock.user.uri,
                "Limite inferior excedido!",
                "Valor de "+ stock.symbol+" é agora " + results[i].lastTradePriceOnly,
                function(err,result){}
              );
            }
            // Issue de tile
            log.info("Tile warning "+ results[i].symbol + " for user " + stock.user.id);
            sails.services.wns.sendTile(stock.user.uri,
              results[i].symbol,
              ""+results[i].lastTradePriceOnly,
              function(err,result){}
            );
          }
        }
      }));
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
