var expect = chai.expect;
var assert = chai.assert;

describe('nativeCall', function () {

    describe('DOMContentLoaded', function() {
        it('addEventListerが呼ばれること', function () {
            expect(window_stub.called).to.eql(true);
        });
        it('addEventListerの第2引数が関数であること', function () {
            expect(window_stub.args[0][1]).to.be.a('function');
        });
    });

    describe('nativeCallの初期化', function() {
        var spy;
        before(function() {
            spy = sinon.spy(window, 'nativeCall');
            window_stub.args[0][1]();
        });
        after(function() {
            spy.restore();
        });

        it('引数の型が正しいこと', function() {
            expect(spy.args[0][0]).to.be.a('string');
            expect(spy.args[0][1]).to.be.a('object');
            expect(spy.args[0][2]).to.be.a('function');
        });
    });

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
            expect(spy.returnValues[0])
            .to.eql('cobit-sdk:call/apiName?param={"param_key":"param_value"}&sessionId=nnn&callback=callback');
        });
        it('pattern2', function() {
            var data = getData('CALLBACK', {"param_key":"SCHEME"},'callback');
            spy(data);
            expect(spy.returnValues[1])
            .to.eql('cobit-sdk:call/CALLBACK?param={"param_key":"SCHEME"}&sessionId=nnn&callback=callback');
        });
        it('pattern3', function() {
            var data = getData('%CALLBACK%', {"param_key":"%SCHEME%"},'callback');
            spy(data);
            expect(spy.returnValues[2])
            .to.eql('cobit-sdk:call/%CALLBACK%?param={"param_key":"%SCHEME%"}&sessionId=nnn&callback=callback');
        });
        it('pattern4', function() {
            var data = getData('', {"":""},'');
            spy(data);
            expect(spy.returnValues[3])
            .to.eql('cobit-sdk:call/?param={"":""}&sessionId=nnn&callback=');
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