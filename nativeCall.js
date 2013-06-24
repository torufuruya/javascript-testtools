var nativeCall = (function () {
    //private static var
    var _count = 0;
    var _callbacks = {};
    //constructor
    function nativeCall (apiName, params, callback) {
        this.sessionId = ++_count;
        _callbacks[this.sessionId] = callback;

        //private instance var
        var _params = JSON.stringify(params);
        var _data = {
            'SCHEME' : 'cobit-sdk:call',
            'APINAME' : apiName,
            'PARAM' : _params,
            'SESSIONID' : this.sessionId,
            'CALLBACK' : callback
        };
        var _result = this.template(_data);

        this.getUrl = function () { return _result; };
        this.locate = function (url) { window.location.href = url; }
    }

    //public prototype method
    nativeCall.prototype.template = function(params) {
        var url = '%SCHEME%/%APINAME%?param=%PARAM%&sessionId=%SESSIONID%&callback=%CALLBACK%';
        var result = '';
        result = url.replace(/%(\w+)%/g, function(str, p1) {
            return params[p1] ? params[p1] : '';
        });
        return result;
    };

    //public static method
    nativeCall.fromCallback = function(sessionId, params) {
        var params = JSON.stringify(params);
        return _callbacks[sessionId](params);
    };

    return nativeCall;
})();

window.addEventListener('DOMContentLoaded', function(){
    new nativeCall('apiName', {"param_key":"param_value"}, function(){return 'callback';});
});
