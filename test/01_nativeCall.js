var expect = chai.expect;
var assert = chai.assert;

describe('nativeCall', function () {

    describe('sessionIdの生成', function() {
        it("nativeCallが初期化されるたびsessionIdがカウントアップする", function() {
            var nc1 = new nativeCall('', {"":""}, function(){});
            var nc2 = new nativeCall('', {"":""}, function(){});
            var nc3 = new nativeCall('', {"":""}, function(){});
            assert(nc2.sessionId > nc1.sessionId);
            assert(nc3.sessionId > nc2.sessionId);
        });
    });

    describe('templateメソッドの結果', function() {
        var spy;
        before(function() {
            spy = sinon.spy(nativeCall.prototype, 'template');
        });
        after(function() {
            spy.restore();
        });

        it('pattern1', function() {
            var data = getData('apiName', {"param_key":"param_value"},'callback');
            spy(data);
            expect(spy.returnValues[0]).to.eql(expected[0]);
        });
        it('pattern2', function() {
            var data = getData('CALLBACK', {"param_key":"SCHEME"},'callback');
            spy(data);
            expect(spy.returnValues[1]).to.eql(expected[1]);
        });
        it('pattern3', function() {
            var data = getData('%CALLBACK%', {"param_key":"%SCHEME%"},'callback');
            spy(data);
            expect(spy.returnValues[2]).to.eql(expected[2]);
        });
        it('pattern4', function() {
            var data = getData('', {"":""},'');
            spy(data);
            expect(spy.returnValues[3]).to.eql(expected[3]);
        });

        function getData(apiName, params, callback) {
            return data = {
                'SCHEME' : 'cobit-sdk:call',
                'APINAME' : apiName,
                'PARAM' : JSON.stringify(params),
                'SESSIONID' : 'nnn',
                'CALLBACK' : callback
            };
        }

        var expected = [
            'cobit-sdk:call/apiName?param={"param_key":"param_value"}&sessionId=nnn&callback=callback',
            'cobit-sdk:call/CALLBACK?param={"param_key":"SCHEME"}&sessionId=nnn&callback=callback',
            'cobit-sdk:call/%CALLBACK%?param={"param_key":"%SCHEME%"}&sessionId=nnn&callback=callback',
            'cobit-sdk:call/?param={"":""}&sessionId=nnn&callback='
        ];
    });

    describe('fromCallbackメソッド', function() {
        var spy;
        before(function() {
            spy = sinon.spy(nativeCall, 'fromCallback');
        });
        after(function() {
            spy.restore();
        });

        it("初期化の時に引数で指定したコールバックが実行できる", function() {
            var nc1 = new nativeCall('', {"":""}, function (param) { return param; });
            nativeCall.fromCallback(nc1.sessionId, 'test1');
            expect(spy.returnValues[0], 'pattern1').to.eql(JSON.stringify('test1'));

            var nc2 = new nativeCall('', {"":""}, function (param) { return param; });
            nativeCall.fromCallback(nc2.sessionId, 'test2');
            expect(spy.returnValues[1], 'pattern2').to.eql(JSON.stringify('test2'));

            var nc3 = new nativeCall('', {"":""}, function (param) { return param; });
            nativeCall.fromCallback(nc3.sessionId, 'test3');
            expect(spy.returnValues[2], 'pattern3').to.eql(JSON.stringify('test3'));
        });
    });

});