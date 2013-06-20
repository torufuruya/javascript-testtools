var nativeCall = function(apiName, params, callback) {
    var sessionId = 'nnn'; //todo: sessionIdの生成・管理
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

    return result;

};

nativeCall.prototype.template = function(url, params) {
    var result = '';
    result = url.replace(/%(\w+)%/g, function(str, p1) {
        return params[p1] ? params[p1] : '';
    });
    return result;
};

window.addEventListener('DOMContentLoaded', function(){
    new nativeCall('apiName', {"param_key":"param_value"},'callback');
});
