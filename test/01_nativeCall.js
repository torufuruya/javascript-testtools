var expect = chai.expect;

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
            spy = sinon.spy(nativeCall.prototype,'template');
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

    describe('counterメソッド', function() {
        var spy;
        before(function() {
            spy = sinon.spy(nativeCall.prototype, 'counter');
        });
        after(function() {
            spy.restore();
        });

        it("nativeCallが初期化されるたびカウントも増加する", function() {
            //todo nativeCallの初期化のテストで1度初期化しているため2からスタートしてしまってる？
            window_stub.args[0][1]();
            expect(spy.returnValues[0],'count1').to.eql(2);
            window_stub.args[0][1]();
            expect(spy.returnValues[1],'count2').to.eql(3);
            window_stub.args[0][1]();
            expect(spy.returnValues[2],'count3').to.eql(4);
        });
    });

    describe('fromCallbackメソッド', function() {
        var spy;
        before(function() {
            spy = sinon.spy(nativeCall.prototype, 'fromCallback');
        });
        after(function() {
            spy.restore();
        });

        it("test1", function() {
            var nc = new nativeCall('', {"":""}, function(){return 'test1';});
            //todo sessionIdが5
            nc.fromCallback(5);
            expect(spy.returnValues[0]).to.eql('test1');
        });

        it("test2", function() {
            var nc = new nativeCall('', {"":""}, function(){return 'test2';});
            //todo sessionIdが6
            nc.fromCallback(6);
            expect(spy.returnValues[1]).to.eql('test2');
        });
    });

});