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
            expect(spy.args[0][2]).to.be.a('string');
        });
    });

    describe('templateメソッド', function() {
        var spy;
        before(function() {
            spy = sinon.spy(nativeCall.prototype,'template');
        });

        after(function() {
            spy.restore();
        });

        it('test1', function() {
            new nativeCall('apiName', {"param_key":"param_value"}, 'callback');
            expect(spy.returnValues[0])
            .to.eql('cobit-sdk:call/apiName?param={"param_key":"param_value"}&sessionId=nnn&callback=callback');
        });

        it('test2', function() {
            new nativeCall('CALLBACK', {"param_key":"param_value"}, 'SCHEME');
            expect(spy.returnValues[1])
            .to.eql('cobit-sdk:call/CALLBACK?param={"param_key":"param_value"}&sessionId=nnn&callback=SCHEME');
        });

        it('test3', function() {
            new nativeCall('', {"param_key":"param_value"}, '');
            expect(spy.returnValues[2])
            .to.eql('cobit-sdk:call/?param={"param_key":"param_value"}&sessionId=nnn&callback=');
        });

        it('test4', function() {
            new nativeCall('null', {"param_key":"param_value"}, 'null');
            expect(spy.returnValues[3])
            .to.eql('cobit-sdk:call/null?param={"param_key":"param_value"}&sessionId=nnn&callback=null');
        });
    });

});
