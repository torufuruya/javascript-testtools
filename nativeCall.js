var nativeCall = (function () {
    var _count = 0;
    var _callbacks = {};

    function nativeCall (apiName, params, callback) {
        this.sessionId = ++_count;
        _callbacks[this.sessionId] = callback;

        var _params = JSON.stringify(params);
        var _data = {
            'SCHEME' : 'hoge-sdk:call',
            'APINAME' : apiName,
            'PARAM' : _params,
            'SESSIONID' : this.sessionId,
            'CALLBACK' : callback
        };
        var _result = encodeURI(this.template(_data));

        this.getUrl = function () { return _result; };
        this.locate = function (url) { window.location.href = url; }
    }

    nativeCall.prototype.template = function(params) {
        var _url = '%SCHEME%/%APINAME%?param=%PARAM%&sessionId=%SESSIONID%&callback=%CALLBACK%';
        var _result = '';
        _result = _url.replace(/%(\w+)%/g, function(str, p1) {
            return params[p1] ? params[p1] : '';
        });
        return _result;
    };

    nativeCall.fromCallback = function(sessionId, params) {
        var _params = JSON.parse(decodeURI(params));
        return _callbacks[sessionId](_params);
    };

    return nativeCall;
})();

window.addEventListener('DOMContentLoaded', function(){
    new nativeCall('apiName', {"param_key":"param_value"}, function(){return 'callback';});
});
