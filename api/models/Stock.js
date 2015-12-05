/**
* Stock.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
'use strict';
module.exports = {

  attributes: {
    notification : {type:'boolean',defaultsTo:false},
    name : {type : 'string', required: true},
    symbol : {type : 'string', required: true},
    upper: {type : 'float' , required: true},
    lower: {type : 'float' , required: true},
    user : {model: 'user', required: true}
  }
};

