var async = require('async');
var httpreq = require('httpreq');
var ntlm = require('./lib/ntlm');
var HttpsAgent = require('agentkeepalive').HttpsAgent;
var keepaliveAgent = new HttpsAgent();
var _ = require('lodash');

var makeRequest = function(method, options, params, callback) {
  if (!options.workstation) options.workstation = '';
  if (!options.domain) options.domain = '';

  function startAuth($) {
    var type1msg = ntlm.createType1Message(options);
    httpreq[method](options.url, {
      headers: {
        'Connection': 'keep-alive',
        'Authorization': type1msg
      },
      agent: keepaliveAgent
    }, $);
  }

  function requestComplete(res, $) {
    if (!res.headers['www-authenticate'])
      return $(new Error('www-authenticate not found on response of second request'));

    var type2msg = ntlm.parseType2Message(res.headers['www-authenticate']);
    var type3msg = ntlm.createType3Message(type2msg, options);
    var req = {
      headers: {
        'Connection': 'Close',
        'Authorization': type3msg
      },
      allowRedirects: false,
      agent: keepaliveAgent,
      json: params
    };
    httpreq[method](options.url, req, $);
  }

  async.waterfall([startAuth, requestComplete], callback);
};

exports.get = _.partial(makeRequest, 'get');
exports.create = _.partial(makeRequest, 'post');
exports.update = _.partial(makeRequest, 'put');
exports.remove = _.partial(makeRequest, 'delete');
