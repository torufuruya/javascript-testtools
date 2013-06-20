var nativeCall = function(apiName, params, callback) {
    this.counter.increment();
    var sessionId = this.counter.value();
    var param = JSON.stringify(params);
    var url = '%SCHEME%/%APINAME%?param=%PARAM%&sessionId=%SESSIONID%&callback=%CALLBACK%';

    var data = {
        'SCHEME' : 'cobit-sdk:call',
        'APINAME' : apiName,
        'PARAM' : param,
        'SESSIONID' : sessionId,
        'CALLBACK' : callback
    };

    var result = this.template(url, data);
    window.location.href = result;

};

nativeCall.prototype.template = function(url, params) {
    var result = '';
    result = url.replace(/%(\w+)%/g, function(str, p1) {
        return params[p1] ? params[p1] : '';
    });
    return result;
};

nativeCall.prototype.counter = (function() {
  var privateCounter = 0;

  return {
    increment: function() {
      privateCounter++;
    },
    value: function() {
      return privateCounter;
    }
  }
})();

window.addEventListener('DOMContentLoaded', function(){
    new nativeCall('apiName', {"param_key":"param_value"},'callback');
});
