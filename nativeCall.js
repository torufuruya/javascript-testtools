var nc;

function nativeCall(apiName, params, callback) {
    this.sessionId = this.counter();
    this.fromCallback.register(this.sessionId, callback);
    var param = JSON.stringify(params);
    var url = '%SCHEME%/%APINAME%?param=%PARAM%&sessionId=%SESSIONID%&callback=%CALLBACK%';

    var data = {
        'SCHEME' : 'cobit-sdk:call',
        'APINAME' : apiName,
        'PARAM' : param,
        'SESSIONID' : this.sessionId,
        'CALLBACK' : callback
    };

    var result = this.template(url, data);
    nc = this;
    //window.location.href = result;

    //this.fromCallback.execute(this.sessionId);
};

nativeCall.prototype.counter = (function() {
    var count = 0;
    return function() {return ++count};
})();

nativeCall.prototype.template = function(url, params) {
    var result = '';
    result = url.replace(/%(\w+)%/g, function(str, p1) {
        return params[p1] ? params[p1] : '';
    });
    return result;
};

nativeCall.prototype.fromCallback = (function() {
    var callbacks = {};
    return {
        register : function(sessionId, callback) {
            callbacks[sessionId] = callback;
        },
        execute : function(sessionId, params) {
            var params = JSON.stringify(params);
            return callbacks[sessionId](params);
        }
    }
})();

window.addEventListener('DOMContentLoaded', function(){
    new nativeCall('apiName', {"param_key":"param_value"}, function(){return 'callback';});
});
