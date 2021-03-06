var Rx =require('rx');
var request = require('../request');

module.exports ={
  json: Rx.Observable.fromNodeCallback(function(options, cb) {
    request.json(options, function(err, json) {
      cb(err, json);
    });
  }),
  dom: Rx.Observable.fromNodeCallback(function(options, cb) {
    request.dom(options, function(err, $) {
      cb(err, $);
    });
  }),
  contentlength: Rx.Observable.fromNodeCallback(function(options, cb) {
    request.contentlength(options, function(err, contentLength) {
      cb(err, contentLength);
    });
  })
};
