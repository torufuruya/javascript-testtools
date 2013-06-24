var nativeCall = (function () {
    //private static var
    var count = 0;
    var callbacks = {};
    //constructor
    function nativeCall (apiName, params, callback) {
        //private instance var
        this._sessionId = ++count;
        var _params = JSON.stringify(params);
        var _url = '%SCHEME%/%APINAME%?param=%PARAM%&sessionId=%SESSIONID%&callback=%CALLBACK%';

        //stack callback
        callbacks[this._sessionId] = callback;

        var _data = {
            'SCHEME' : 'cobit-sdk:call',
            'APINAME' : apiName,
            'PARAM' : _params,
            'SESSIONID' : this._sessionId,
            'CALLBACK' : callback
        };

        var result = this.template(_url, _data);
        //window.location.href = result;

    }

    //public prototype method
    nativeCall.prototype.template = function(url, params) {
        var result = '';
        result = url.replace(/%(\w+)%/g, function(str, p1) {
            return params[p1] ? params[p1] : '';
        });
        return result;
    };

    //public static method
    nativeCall.fromCallback = function(sessionId, params) {
        var params = JSON.stringify(params);
        return callbacks[sessionId](params);
    };

    return nativeCall;
})();

window.addEventListener('DOMContentLoaded', function(){
    new nativeCall('apiName', {"param_key":"param_value"}, function(){return 'callback';});
});
