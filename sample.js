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
    while (url.match(/%\w+%/)) {
        // 'hoge%huga%foo%huga%';
        var match = url.match(/^([\s\S]*?)%(\w+)%([\s\S]*)/);
        // hoge
        result += match[1];
        // %huga%
        var key = match[2];
        // foo%huga%
        var url = match[3];

        if (key in params) {
            result += params[key];
        }
    }
    return result;
};

window.addEventListener('DOMContentLoaded', function(){
    new nativeCall('apiName', {"param_key":"param_value"},'callback');
});
