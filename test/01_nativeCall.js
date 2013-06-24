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

    describe('templateメソッドの結果', function() {
        var spy;
        var url = '%SCHEME%/%APINAME%?param=%PARAM%&sessionId=%SESSIONID%&callback=%CALLBACK%';
        function getData(apiName, params, callback) {
            var data = {
                'SCHEME' : 'cobit-sdk:call',
                'APINAME' : apiName,
                'PARAM' : JSON.stringify(params),
                'SESSIONID' : 'nnn',
                'CALLBACK' : callback
            };
            return data;
        }

        before(function() {
            spy = sinon.spy(nativeCall.prototype, 'template');
        });

        after(function() {
            spy.restore();
        });

        it('test1', function() {
            var data = getData('apiName', {"param_key":"param_value"},'callback');
            spy(url, data);
            expect(spy.returnValues[0])
            .to.eql('cobit-sdk:call/apiName?param={"param_key":"param_value"}&sessionId=nnn&callback=callback');
        });
        it('test2', function() {
            var data = getData('CALLBACK', {"param_key":"SCHEME"},'callback');
            spy(url, data);
            expect(spy.returnValues[1])
            .to.eql('cobit-sdk:call/CALLBACK?param={"param_key":"SCHEME"}&sessionId=nnn&callback=callback');
        });
        it('test3', function() {
            var data = getData('%CALLBACK%', {"param_key":"%SCHEME%"},'callback');
            spy(url, data);
            expect(spy.returnValues[2])
            .to.eql('cobit-sdk:call/%CALLBACK%?param={"param_key":"%SCHEME%"}&sessionId=nnn&callback=callback');
        });
        it('test4', function() {
            var data = getData('', {"":""},'');
            spy(url, data);
            expect(spy.returnValues[3])
            .to.eql('cobit-sdk:call/?param={"":""}&sessionId=nnn&callback=');
        });
    });

    describe('sessionId', function() {
        it("nativeCallが初期化されるたびsessionIdがカウントアップする", function() {
            var nc1 = new nativeCall('', {"":""}, function(){});
            var nc2 = new nativeCall('', {"":""}, function(){});
            var nc3 = new nativeCall('', {"":""}, function(){});
            assert(nc2._sessionId > nc1._sessionId);
            assert(nc3._sessionId > nc2._sessionId);
        });
    });

    describe('fromCallbackメソッド', function() {
        var spy;
        before(function() {
            spy = sinon.spy(nativeCall, 'fromCallback');
        });
        after(function() {
            spy.restore();
        });

        it("引数で指定したコールバックが登録、実行できる", function() {
            var nc1 = new nativeCall('', {"":""}, function(){return 'test1';});
            var nc2 = new nativeCall('', {"":""}, function(){return 'test2';});
            var nc3 = new nativeCall('', {"":""}, function(){return 'test3';});
            nativeCall.fromCallback(nc1._sessionId, {"test1":"test1"});
            expect(spy.returnValues[0], 'test1').to.eql('test1');

            nativeCall.fromCallback(nc2._sessionId, {"test2":"test2"});
            expect(spy.returnValues[1], 'test2').to.eql('test2');

            nativeCall.fromCallback(nc3._sessionId, {"test3":"test3"});
            expect(spy.returnValues[2], 'test3').to.eql('test3');
        });
    });

});